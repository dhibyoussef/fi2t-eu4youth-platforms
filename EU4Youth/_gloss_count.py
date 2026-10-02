import re, json
from pathlib import Path

p = Path(r"c:\Users\youss\OneDrive\Attachments\Desktop\fi2t-live-editor\EU4Youth\EU4Youth\site web EU4Youth.org-20260811T205332Z-1-001\site web EU4Youth.org\Glossaire\glossaire_eu4youth_complet.html")
h = p.read_text(encoding="utf-8")
terms = re.findall(r'term:\s*"([^"]+)"', h)
sections = re.findall(r'label:\s*"([^"]+)"', h)
out = {"term_count": len(terms), "section_count": len(sections), "section_labels": sections}
Path(r"c:\Users\youss\OneDrive\Attachments\Desktop\fi2t-live-editor\EU4Youth\_gloss_count.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8"
)
