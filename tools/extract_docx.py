import glob
import os
import sys
import xml.etree.ElementTree as ET
import zipfile

out_dir = os.path.join(os.path.dirname(__file__), "out", "gap-audit")
os.makedirs(out_dir, exist_ok=True)
base = r"c:\Users\youss\OneDrive\Attachments\Desktop\fi2t-live-editor\EU4Youth\EU4Youth"


def extract(fp: str) -> list[str]:
    with zipfile.ZipFile(fp) as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    paras: list[str] = []
    for p in root.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p"):
        texts = [
            t.text
            for t in p.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t")
            if t.text
        ]
        if texts:
            paras.append("".join(texts))
    return paras


for fp in glob.glob(os.path.join(base, "*.docx")):
    if os.path.basename(fp).startswith("~$"):
        continue
    try:
        paras = extract(fp)
        safe = "".join(c if c.isalnum() or c in "-_" else "_" for c in os.path.basename(fp))
        out = os.path.join(out_dir, safe + ".txt")
        with open(out, "w", encoding="utf-8") as f:
            f.write("\n".join(paras))
        print(f"OK {os.path.basename(fp)} ({len(paras)} lines)")
    except Exception as exc:
        print(f"FAIL {os.path.basename(fp)}: {exc}", file=sys.stderr)
