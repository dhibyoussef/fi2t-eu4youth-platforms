#!/usr/bin/env python3
"""Deep CMS editor simulation + patch roundtrips."""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from base64 import b64encode

import os

# Credentials come from the environment — never hardcode them.
BASIC = b64encode(os.environ.get("EU4Y_BASIC_AUTH", "").encode()).decode()
BASE = os.environ.get("EU4Y_API_BASE", "http://localhost:8040/api")
SITE = os.environ.get("EU4Y_SITE_URL", "http://localhost:3030")
ADMIN_EMAIL = os.environ.get("EU4Y_ADMIN_EMAIL", "")
ADMIN_PASSWORD = os.environ.get("EU4Y_ADMIN_PASSWORD", "")


def req(method, path, token=None, body=None, base=BASE):
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Basic {BASIC}",
    }
    if token:
        headers["X-EU4Y-Token"] = token
    data = None if body is None else json.dumps(body).encode()
    request = urllib.request.Request(f"{BASE}{path}" if base == BASE else f"{base}{path}", data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=60) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            ctype = resp.headers.get("Content-Type", "")
            if "json" in ctype or raw[:1] in "{[":
                try:
                    return resp.status, json.loads(raw) if raw else None
                except json.JSONDecodeError:
                    return resp.status, raw[:300]
            return resp.status, raw
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, raw[:300]


def loc_text(value, locale="fr"):
    if value is None:
        return ""
    if isinstance(value, (str, int, float)):
        return str(value)
    if isinstance(value, dict):
        picked = value.get(locale) or value.get("fr") or value.get("en") or value.get("ar") or ""
        if isinstance(picked, dict):
            return loc_text(picked, locale)
        return str(picked)
    return str(value)


def loc_array(value, locale="fr"):
    if isinstance(value, list):
        return value
    if isinstance(value, dict):
        picked = value.get(locale) or value.get("fr") or value.get("en") or value.get("ar")
        return picked if isinstance(picked, list) else []
    return []


def display_value(value):
    if value is None:
        return ""
    if isinstance(value, bool):
        return "Oui" if value else "Non"
    if isinstance(value, list):
        return ", ".join(map(str, value))
    if isinstance(value, dict):
        return str(value.get("fr") or value.get("en") or value.get("ar") or json.dumps(value))
    return str(value)


def main():
    fails = 0
    code, login = req("POST", "/auth/login", body={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if code != 200 or not isinstance(login, dict) or not login.get("token"):
        print("FAIL login", code, login)
        return 1
    token = login["token"]
    print("OK login")

    # Projects editor simulation
    code, projects = req("GET", "/admin/projects", token=token)
    assert code == 200 and isinstance(projects, list)
    for p in projects:
        try:
            loc_text(p.get("acronym"))
            loc_text(p.get("partner"))
            loc_text(p.get("period"))
            loc_text(p.get("sectors"))
            loc_text(p.get("generalObjective"))
            "\n".join(loc_array(p.get("presentation")))
            "\n".join(loc_array(p.get("specificObjectives")))
            comps = loc_array(p.get("components"))
            kpis = loc_array(p.get("kpis"))
            for c in comps:
                if not isinstance(c.get("results") or [], list):
                    raise TypeError("comp.results not list")
            print(f"OK project-editor {p['slug']} comps={len(comps)} kpis={len(kpis)}")
        except Exception as e:
            fails += 1
            print(f"FAIL project-editor {p.get('slug')}: {e}")

    kinds = {
        "news": ["title", "summary", "body"],
        "publications": ["title", "summary", "body"],
        "events": ["title", "summary"],
        "opportunities": ["title", "summary", "body"],
        "initiatives": ["name"],
        "videos": ["title"],
        "stories": ["firstName", "quote"],
    }
    for kind, loc_keys in kinds.items():
        code, rows = req("GET", f"/admin/{kind}", token=token)
        if code != 200 or not isinstance(rows, list):
            fails += 1
            print(f"FAIL list {kind} {code}")
            continue
        if not rows:
            print(f"OK {kind} empty")
            continue
        for row in rows[:8]:
            display_value(row.get("title") or row.get("name") or row.get("firstName"))
        item = rows[0]
        for k in loc_keys:
            loc_text(item.get(k))
        iid = item.get("id") or item.get("slug")
        status = item.get("status") or "published"
        code, _ = req("PATCH", f"/admin/{kind}/{iid}", token=token, body={"status": status, "translate": False})
        if code != 200:
            fails += 1
            print(f"FAIL patch {kind}/{iid} HTTP {code}")
        else:
            print(f"OK {kind} list={len(rows)} open+patch id={iid}")

    # glossary
    code, gloss = req("GET", "/admin/glossary", token=token)
    if code == 200 and isinstance(gloss, list) and gloss:
        cat = gloss[0]
        loc_text(cat.get("label"))
        for e in (cat.get("entries") or [])[:3]:
            for k in ("term", "tag", "def", "ctx"):
                loc_text(e.get(k))
        print(f"OK glossary cats={len(gloss)} open")
    else:
        fails += 1
        print(f"FAIL glossary {code}")

    # inbox
    code, inbox = req("GET", "/admin/inbox", token=token)
    if code == 200 and isinstance(inbox, list):
        print(f"OK inbox list={len(inbox)}")
        if inbox:
            code, _ = req("PATCH", f"/admin/inbox/{inbox[0]['id']}", token=token, body={"unread": False})
            print(f"{'OK' if code == 200 else 'FAIL'} inbox patch {code}")
            if code != 200:
                fails += 1
    else:
        fails += 1
        print(f"FAIL inbox {code}")

    # content / nav / users
    for path, label in [
        ("/admin/content/matrix?page=home", "matrix"),
        ("/admin/site-nav", "site-nav"),
        ("/admin/users", "users"),
        ("/admin/roles", "roles"),
        ("/admin/activity", "activity"),
        ("/admin/validation-queue", "validation"),
        ("/admin/overview", "overview"),
    ]:
        code, data = req("GET", path, token=token)
        ok = code == 200
        print(f"{'OK' if ok else 'FAIL'} {label} HTTP {code}")
        if not ok:
            fails += 1

    # public SPA shells + project routes
    for path in [
        "/",
        "/admin/",
        "/admin/projets",
        "/admin/actualites",
        "/admin/publications",
        "/admin/agenda",
        "/admin/initiatives",
        "/admin/inbox",
        "/projets",
        "/projets/jeuness",
        "/projets/go4youth",
        "/projets/fe3ila",
        "/projets/maghroumin",
        "/projets/swafy",
        "/projets/irada4youth",
        "/actualites",
        "/publications",
        "/agenda",
        "/opportunites",
        "/carte",
    ]:
        code, html = req("GET", path, base=SITE)
        # SPA returns index.html
        text = html if isinstance(html, str) else json.dumps(html)
        ok = code == 200 and ("id=\"root\"" in text or "EU4Youth" in text or "Back-office" in text)
        print(f"{'OK' if ok else 'FAIL'} page {path} HTTP {code} bytes={len(text)}")
        if not ok:
            fails += 1

    print(f"\nRESULT fails={fails}")
    return 1 if fails else 0


if __name__ == "__main__":
    raise SystemExit(main())
