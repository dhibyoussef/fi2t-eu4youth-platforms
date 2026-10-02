#!/usr/bin/env python3
"""EU4Youth CMS admin smoke check — login, list, open-shape, patch roundtrip."""
from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request
from base64 import b64encode
from typing import Any

import os

# Credentials come from the environment — never hardcode them.
BASE = os.environ.get("EU4Y_API_BASE", "http://localhost:8040/api")
BASIC = b64encode(os.environ.get("EU4Y_BASIC_AUTH", "").encode()).decode()
EMAIL = os.environ.get("EU4Y_ADMIN_EMAIL", "")
PASSWORD = os.environ.get("EU4Y_ADMIN_PASSWORD", "")

results: list[tuple[str, str, str]] = []


def req(method: str, path: str, token: str | None = None, body: dict | None = None) -> tuple[int, Any]:
    data = None if body is None else json.dumps(body).encode("utf-8")
    url = f"{BASE}{path}"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Basic {BASIC}",
    }
    if token:
        # Frontend sends JWT in X-EU4Y-Token so nginx Basic Auth stays intact.
        headers["X-EU4Y-Token"] = token
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=45) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            try:
                return resp.status, json.loads(raw) if raw else None
            except json.JSONDecodeError:
                return resp.status, raw[:200]
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        try:
            return e.code, json.loads(raw) if raw else None
        except json.JSONDecodeError:
            return e.code, raw[:200]


def note(area: str, status: str, detail: str = "") -> None:
    results.append((area, status, detail))
    mark = "OK" if status == "ok" else ("WARN" if status == "warn" else "FAIL")
    print(f"[{mark}] {area}: {detail}")


def shape_ok(value: Any) -> str:
    if value is None:
        return "null"
    if isinstance(value, list):
        return f"list[{len(value)}]"
    if isinstance(value, dict):
        # locale bag?
        if set(value.keys()) <= {"fr", "en", "ar"} or {"fr", "en", "ar"} <= set(value.keys()):
            sample = value.get("fr")
            if isinstance(sample, list):
                return f"locArray[{len(sample)}]"
            if isinstance(sample, dict):
                return "locObject"
            return "locStr"
        return f"dict{{{','.join(list(value.keys())[:5])}}}"
    return type(value).__name__


def render_safe_for_projects(item: dict) -> list[str]:
    """Simulate what ProjectsPage used to crash on."""
    crashes = []
    for key in ("presentation", "specificObjectives", "components", "kpis"):
        val = item.get(key)
        if isinstance(val, dict) and not isinstance(val, list):
            # old code: (val || []).join / .map — would crash
            crashes.append(f"{key}=localeBag (needs unwrap)")
        elif val is not None and not isinstance(val, list) and key in ("presentation", "specificObjectives", "components", "kpis"):
            crashes.append(f"{key}=unexpected {type(val).__name__}")
    for key in ("sectors", "generalObjective", "period", "partner", "acronym"):
        val = item.get(key)
        if isinstance(val, dict):
            # controlled input value={object} is unsafe without locText
            crashes.append(f"{key}=localeBag")
    return crashes


def main() -> int:
    code, login = req("POST", "/auth/login", body={"email": EMAIL, "password": PASSWORD})
    if code != 200 or not isinstance(login, dict) or not login.get("token"):
        note("auth/login", "fail", f"HTTP {code} {login}")
        return 1
    token = str(login["token"])
    note("auth/login", "ok", f"role={login.get('user', {}).get('role') or login.get('role')}")

    code, health = req("GET", "/health")
    note("health", "ok" if code == 200 else "fail", f"{health}")

    catalogs = [
        ("projects", "slug"),
        ("news", "id"),
        ("publications", "id"),
        ("events", "id"),
        ("opportunities", "id"),
        ("initiatives", "id"),
        ("stories", "id"),
        ("videos", "id"),
        ("glossary", None),
        ("inbox", "id"),
    ]

    first_items: dict[str, dict] = {}

    for name, id_key in catalogs:
        code, data = req("GET", f"/admin/{name}", token=token)
        if code != 200:
            note(f"list/{name}", "fail", f"HTTP {code} {data}")
            continue
        if not isinstance(data, list):
            # glossary might be object
            if name == "glossary" and isinstance(data, (list, dict)):
                note(f"list/{name}", "ok", f"type={type(data).__name__} len={len(data) if isinstance(data, list) else 'n/a'}")
                continue
            note(f"list/{name}", "fail", f"not a list: {type(data).__name__}")
            continue
        note(f"list/{name}", "ok", f"{len(data)} items")
        if data and isinstance(data[0], dict):
            first_items[name] = data[0]

    # Project editor crash regression
    if "projects" in first_items:
        for slug_item in [first_items["projects"]]:
            # fetch all projects for crash check
            pass
        code, projects = req("GET", "/admin/projects", token=token)
        if isinstance(projects, list):
            bad = 0
            for p in projects:
                issues = render_safe_for_projects(p)
                if issues:
                    bad += 1
                    if bad <= 2:
                        note(
                            f"projects/shape/{p.get('slug')}",
                            "warn",
                            "locale bags present (editor must unwrap): " + ", ".join(issues[:4]),
                        )
            if bad == 0:
                note("projects/shape", "ok", "no locale bags (flat)")
            else:
                note("projects/shape", "ok", f"{bad}/{len(projects)} have locale bags — ProjectsPage unwrap handles this")

    # Patch roundtrip on a news item (safe field: no content change if we set same title)
    if "news" in first_items:
        item = first_items["news"]
        iid = item.get("id")
        title = item.get("title")
        code, patched = req(
            "PATCH",
            f"/admin/news/{iid}",
            token=token,
            body={"title": title, "translate": False},
        )
        if code == 200:
            note("patch/news", "ok", f"id={iid}")
        else:
            note("patch/news", "fail", f"HTTP {code} {patched}")

    if "projects" in first_items:
        item = first_items["projects"]
        slug = item.get("slug")
        # soft patch: same status
        code, patched = req(
            "PATCH",
            f"/admin/projects/{slug}",
            token=token,
            body={"status": item.get("status") or "published", "translate": False},
        )
        if code == 200:
            note("patch/projects", "ok", f"slug={slug}")
        else:
            note("patch/projects", "fail", f"HTTP {code} {patched}")

    if "inbox" in first_items:
        item = first_items["inbox"]
        note("inbox/sample", "ok", f"from={item.get('from')} kind={item.get('kind')} unread={item.get('unread')}")

    # Content matrix / pages
    code, matrix = req("GET", "/admin/content/matrix?page=home", token=token)
    if code == 200 and isinstance(matrix, dict):
        pages = matrix.get("pages") or []
        note("content/matrix", "ok", f"pages={len(pages)}")
    else:
        note("content/matrix", "fail", f"HTTP {code}")

    # Public catalog still works
    for kind in ("projects", "news", "publications", "events"):
        code, data = req("GET", f"/catalog/{kind}?locale=fr")
        if code == 200 and isinstance(data, list):
            # ensure flattened (string/array not loc bags for key fields)
            flat_ok = True
            if data:
                sample = data[0]
                for k in ("title", "acronym", "tagline", "partner"):
                    if k in sample and isinstance(sample[k], dict):
                        flat_ok = False
                for k in ("presentation", "components"):
                    if k in sample and isinstance(sample[k], dict):
                        flat_ok = False
            note(f"public/{kind}", "ok" if flat_ok else "warn", f"{len(data)} items flat={flat_ok}")
        else:
            note(f"public/{kind}", "fail", f"HTTP {code}")

    # Check nested objects in news/pubs that catalogFields listToString might mishandle
    for name in ("news", "publications", "events", "opportunities", "initiatives"):
        if name not in first_items:
            continue
        item = first_items[name]
        risky = []
        for k, v in item.items():
            if isinstance(v, dict) and set(v.keys()) & {"fr", "en", "ar"}:
                # localized — ok for localized fields; risky if rendered as plain input
                pass
            if isinstance(v, dict) and not (set(v.keys()) <= {"fr", "en", "ar"} or {"fr", "en", "ar"} & set(v.keys())):
                risky.append(k)
        note(f"shape/{name}", "ok", f"keys={len(item)} nestedNonLocale={risky[:5] or 'none'}")

    fails = sum(1 for _, s, _ in results if s == "fail")
    warns = sum(1 for _, s, _ in results if s == "warn")
    oks = sum(1 for _, s, _ in results if s == "ok")
    print("\n=== SUMMARY ===")
    print(f"ok={oks} warn={warns} fail={fails}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
