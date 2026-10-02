# -*- coding: utf-8 -*-
from pathlib import Path
import re, json

OUT = Path(r"c:\Users\youss\OneDrive\Attachments\Desktop\fi2t-live-editor\EU4Youth\_extract_parts")

# Glossary term count
html = Path(r"c:\Users\youss\OneDrive\Attachments\Desktop\fi2t-live-editor\EU4Youth\EU4Youth\site web EU4Youth.org-20260811T205332Z-1-001\site web EU4Youth.org\Glossaire\glossaire_eu4youth_complet.html").read_text(encoding="utf-8")
classes = set(re.findall(r'class="([^"]+)"', html))
interesting = sorted(c for c in classes if any(k in c.lower() for k in ["term", "gloss", "entry", "item", "def", "mot", "word", "card"]))
# Try common patterns
patterns = {
    "gloss-term": len(re.findall(r'class="[^"]*gloss-term[^"]*"', html)),
    "term-card": len(re.findall(r'class="[^"]*term-card[^"]*"', html)),
    "term-name": len(re.findall(r'class="[^"]*term-name[^"]*"', html)),
    "entry": len(re.findall(r'class="[^"]*entry[^"]*"', html)),
    "details": len(re.findall(r"<details", html, re.I)),
    "data-term": len(re.findall(r"data-term", html, re.I)),
    "letter-section": len(re.findall(r'class="[^"]*letter[^"]*"', html)),
}
# Extract visible term titles: often <div class="term-title"> or similar
titles = re.findall(r'class="([^"]*(?:term|entry)[^"]*)"[^>]*>(.*?)</', html, re.I | re.S)
clean_titles = []
for cls, inner in titles:
    t = re.sub(r"<[^>]+>", "", inner).strip()
    t = re.sub(r"\s+", " ", t)
    if 2 < len(t) < 100:
        clean_titles.append((cls, t))
# Also try JSON embedded data
json_blobs = re.findall(r"const\s+\w+\s*=\s*(\[[\s\S]*?\]);", html)
term_count_from_js = None
js_sample = []
for blob in json_blobs:
    try:
        data = json.loads(blob)
        if isinstance(data, list) and data and isinstance(data[0], dict):
            keys = set(data[0].keys())
            if any(k in keys for k in ("term", "terme", "title", "name", "fr", "definition")):
                term_count_from_js = len(data)
                js_sample = data[:5]
                break
    except Exception:
        pass
# count occurrences of pattern like "terme" fields in script
script_terms = re.findall(r'"(?:term|terme|title|name)"\s*:\s*"([^"]+)"', html)
# letter groups
letters = re.findall(r'data-letter="([A-Za-zÀ-ÿ])"', html)
# Find section after stats
idx = html.find("stat-pill")
snippet = html[idx : idx + 3000] if idx >= 0 else html[2000:5000]

gloss = {
    "interesting_classes": interesting,
    "patterns": patterns,
    "title_hits": len(clean_titles),
    "sample_titles": clean_titles[:20],
    "js_term_count": term_count_from_js,
    "js_sample": js_sample,
    "script_term_strings": len(set(script_terms)),
    "script_sample": list(dict.fromkeys(script_terms))[:30],
    "data_letters": sorted(set(letters)),
    "snippet": snippet[:1500],
}
(OUT / "09_glossaire_deep.json").write_text(json.dumps(gloss, ensure_ascii=False, indent=2), encoding="utf-8")
print("gloss done", patterns, "js", term_count_from_js, "script uniq", len(set(script_terms)))

# Pull filter taxonomies from cadrage
cadrage = (OUT / "02_cadrage_uxui.txt").read_text(encoding="utf-8")
# extract tables mentioning Filtre
tables = re.split(r"### TABLE \d+", cadrage)
# find lines with Filtre |
filter_lines = [ln for ln in cadrage.splitlines() if "Filtre" in ln or "filtre" in ln.lower() or "Type d'" in ln or "Thématique" in ln]
(OUT / "02_filters_snip.txt").write_text("\n".join(filter_lines[:120]), encoding="utf-8")

# a propos headings
apropos = (OUT / "04_a_propos.txt").read_text(encoding="utf-8")
heads = [ln for ln in apropos.splitlines() if ln.startswith("##")]
(OUT / "04_heads.txt").write_text("\n".join(heads), encoding="utf-8")
print("apropos heads", len(heads))

# programme heads
prog = (OUT / "06_programme.txt").read_text(encoding="utf-8")
(OUT / "06_heads.txt").write_text("\n".join(ln for ln in prog.splitlines() if ln.startswith("##")), encoding="utf-8")

# UI first pages condensed
ui_notes = {}
for p in OUT.glob("ui_*.txt"):
    text = p.read_text(encoding="utf-8")
    m = re.search(r"PAGE_COUNT=(\d+)", text)
    pages = int(m.group(1)) if m else None
    # first page only
    first = text.split("===== PAGE 2 =====")[0]
    first = re.sub(r"===== PAGE 1 =====\n?", "", first)
    first = re.sub(r"PAGE_COUNT=\d+\n?", "", first).strip()
    # lines that look like titles
    lines = [ln.strip() for ln in first.splitlines() if ln.strip()]
    titles = [ln for ln in lines if len(ln) < 70][:25]
    ui_notes[p.stem] = {"pages": pages, "first_lines": titles, "first_text_preview": first[:1200]}
(OUT / "ui_notes.json").write_text(json.dumps(ui_notes, ensure_ascii=False, indent=2), encoding="utf-8")
print("ui notes", len(ui_notes))

# Fe3il pubs check + all remaining projects one-liners already in meta
# cadrage taxonomy tables - extract TABLE sections with Filtre | Valeurs
tax = []
for m in re.finditer(r"(Filtre \| Valeurs[\s\S]{0,800})", cadrage):
    tax.append(m.group(1)[:800])
(OUT / "02_tax.txt").write_text("\n\n----\n\n".join(tax), encoding="utf-8")
print("tax blocks", len(tax))
