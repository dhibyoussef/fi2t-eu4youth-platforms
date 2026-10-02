# Extracted i18n content

Structured JSON parsed from trilingual Word source documents in `EU4Youth/Sections trilingues/` using `tools/extract_trilingual_docx.py` (python-docx).

## Files

- `fe3ila.json` — slug `fe3ila`; KPIs fr/en/ar: 9/9/9; components fr: 4
- `go4youth.json` — slug `go4youth`; KPIs fr/en/ar: 2/2/3; components fr: 3
- `irada4youth.json` — slug `irada4youth`; KPIs fr/en/ar: 2/2/6; components fr: 3
- `jeuness.json` — slug `jeuness`; KPIs fr/en/ar: 7/7/8; components fr: 8
- `programme.json` — block keys fr/en/ar: 24/36/32
- `eu-en-tunisie.json` — themes fr/en/ar: 12/12/12; links fr: 2

## Notes

- Project files (`fe3ila.json`, `go4youth.json`, `irada4youth.json`, `jeuness.json`) share a common schema with `fr`, `en`, and `ar` blocks.
- `programme.json` uses CMS-style semantic keys under `blocks` per language.
- `eu-en-tunisie.json` holds hero, themes (~12), CTA, and link metadata.
- Key-info tables are mapped as table0=FR, with order varying by document (see script `table_order` per file).
- Encoding: UTF-8.
