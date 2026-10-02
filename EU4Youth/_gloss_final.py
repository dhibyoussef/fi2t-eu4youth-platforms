# -*- coding: utf-8 -*-
import re, json
from pathlib import Path
from collections import Counter

OUT = Path(r"c:\Users\youss\OneDrive\Attachments\Desktop\fi2t-live-editor\EU4Youth\_extract_parts")
s = (OUT / "gloss_script_0.js").read_text(encoding="utf-8")
terms = re.findall(r'term:\s*"((?:\\.|[^"\\])*)"', s)
tags = re.findall(r'tag:\s*"((?:\\.|[^"\\])*)"', s)
labels = re.findall(r'label:\s*"((?:\\.|[^"\\])*)"', s)
print("term_count", len(terms))
print("unique", len(set(terms)))
print("sample", terms[:20])
print("tags", dict(Counter(tags)))
print("labels", labels)

ui = json.loads((OUT / "ui_summary.json").read_text(encoding="utf-8"))
compact = {}
for k, v in ui.items():
    compact[k] = {"pages": v["pages"], "lines": v["lines"][:18]}
(OUT / "ui_compact.json").write_text(json.dumps(compact, ensure_ascii=False, indent=2), encoding="utf-8")
print("wrote ui_compact")

# Fe3il publications empty?
pub = Path(r"c:\Users\youss\OneDrive\Attachments\Desktop\fi2t-live-editor\EU4Youth\EU4Youth\site web EU4Youth.org-20260811T205332Z-1-001\site web EU4Youth.org")
for p in pub.iterdir():
    if "publication" in p.name.lower():
        for sub in p.iterdir():
            files = list(sub.rglob("*")) if sub.is_dir() else []
            print(sub.name, "files", len([f for f in files if f.is_file()]), [f.name for f in files if f.is_file()][:20])
