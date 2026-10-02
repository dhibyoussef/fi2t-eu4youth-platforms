#!/usr/bin/env python3
"""Best-of: Stitch exact UI clone + HQ partner logos + FR/EN/AR one-file."""
from __future__ import annotations

import base64
import io
import json
import pathlib

from PIL import Image

IMG = pathlib.Path(
    r"C:\Users\youss\OneDrive\Attachments\Desktop\fi2t-live-editor\EU4Youth\eu4youth-website\public\img"
)
CROP = IMG / "_coming-soon-crops"
OUT = pathlib.Path(
    r"C:\Users\youss\OneDrive\Attachments\Desktop\fi2t-live-editor\EU4Youth\eu4youth-website\EU4Youth-coming-soon.html"
)
DESKTOP = pathlib.Path(r"C:\Users\youss\OneDrive\Attachments\Desktop\EU4Youth-coming-soon.html")


def to_uri(im: Image.Image) -> str:
    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def trim(im: Image.Image, pad: int = 2) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    return im.crop(
        (max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad))
    )


def load(name: str, max_h: int) -> Image.Image:
    im = Image.open(IMG / name).convert("RGBA")
    im = trim(im)
    if im.height > max_h:
        w = max(1, int(im.width * max_h / im.height))
        im = im.resize((w, max_h), Image.Resampling.LANCZOS)
    return im


def fix_swafy(im: Image.Image) -> Image.Image:
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a > 20 and r > 230 and g > 230 and b > 230:
                px[x, y] = (70, 70, 80, a)
    return im


def make_eu(h: int = 100) -> Image.Image:
    im = Image.open(IMG / "flag-ue.png").convert("RGBA")
    px = im.load()
    w, ht = im.size
    xs, ys = [], []
    for y in range(ht):
        for x in range(w):
            r, g, b, a = px[x, y]
            if b > 100 and b > r + 40 and b > g + 40:
                xs.append(x)
                ys.append(y)
    crop = im.crop((min(xs), min(ys), max(xs) + 1, max(ys) + 1))
    nw = int(crop.width * h / crop.height)
    return crop.resize((nw, h), Image.Resampling.LANCZOS)


assets = {
    "tn": to_uri(load("flag-tunisie.png", 100)),
    "eu": to_uri(make_eu(100)),
    "fe3ila": to_uri(load("logo-fe3ila.png", 120)),
    "jeuness": to_uri(load("logo-jeuness.png", 140)),
    "maghroumin": to_uri(load("logo-maghroumin.png", 130)),
    "swafy": to_uri(fix_swafy(load("logo-swafy.png", 150))),
    "irada": to_uri(load("logo-irada4youth.png", 120)),
    "go4": to_uri(load("logo-go4youth.png", 80)),
}
for k, v in assets.items():
    print(k, len(v) // 1024, "KB")

A = json.dumps(assets)

html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>EU4Youth — Site en préparation</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Changa:wght@600;700;800&display=swap" rel="stylesheet" />
<style>
:root {{
  --blue: #0d5ca4;
  --amber: #e4972e;
  --ink: #000;
  --font: "Montserrat", "Segoe UI", Arial, sans-serif;
  --font-ar: "Changa", "Segoe UI", Tahoma, sans-serif;
}}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
html, body {{ min-height: 100%; background: #fff; }}
body {{
  font-family: var(--font);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}}
html[dir="rtl"] body {{ font-family: var(--font-ar); }}

.page {{
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  background: #fff;
}}

/* —— Stitch background: peach glow + browser + magnifying glass —— */
.bg {{
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}}
.glow {{
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
}}
.glow.a {{ top: 50px; left: 28%; width: 112px; height: 112px; background: rgba(254,215,170,.22); }}
.glow.b {{ bottom: 12%; left: 8%; width: 192px; height: 192px; background: rgba(255,237,213,.4); filter: blur(56px); }}
.glow.c {{ top: 38%; right: 22%; width: 80px; height: 80px; background: rgba(254,215,170,.28); filter: blur(24px); }}
.bg svg {{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}}

.langs {{
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px clamp(14px, 3vw, 36px) 0;
  direction: ltr;
}}
.langs button {{
  min-width: 46px;
  height: 28px;
  border-radius: 3px;
  cursor: pointer;
  border: 1.5px solid var(--blue);
  background: #fff;
  color: var(--blue);
  font: 800 11px/1 var(--font);
  letter-spacing: .04em;
}}
.langs button.on {{ background: var(--blue); color: #fff; }}

.header {{
  position: relative;
  z-index: 2;
  width: min(1120px, 94vw);
  margin: 4px auto 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: start;
  column-gap: clamp(10px, 2.5vw, 32px);
  direction: ltr;
  padding: 0 4px;
}}
.side {{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}}
.side.l {{ justify-self: start; }}
.side.r {{ justify-self: end; }}
.side img {{
  height: 48px;
  width: auto;
  display: block;
  object-fit: contain;
  border-radius: 1px;
  box-shadow: 0 1px 2px rgba(0,0,0,.08);
}}
.side span {{
  font-size: 10px;
  font-weight: 700;
  color: #000;
  line-height: 1.2;
  max-width: 16ch;
}}
.side.r span {{ max-width: 18ch; }}

/* Stitch-style EU4Youth mark (colored letter tiles) */
.brand-mark {{
  display: flex;
  align-items: center;
  gap: 10px;
  justify-self: center;
  padding-top: 2px;
}}
.brand-grid {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  width: 52px;
  height: 52px;
}}
.brand-grid span {{
  border-radius: 6px;
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 900;
  font-size: 15px;
  line-height: 1;
  font-family: var(--font);
}}
.brand-grid .e {{ background: #2ca653; }}
.brand-grid .u {{ background: #e42d62; }}
.brand-grid .n {{ background: #12b4ba; }}
.brand-grid .y {{ background: #f2a829; }}
.brand-txt {{
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1;
}}
.brand-txt .youth {{
  font-size: clamp(1.35rem, 2.4vw, 1.75rem);
  font-weight: 900;
  color: #0c4384;
  letter-spacing: -0.02em;
  text-transform: lowercase;
}}
.brand-txt .tag {{
  font-size: 11px;
  font-weight: 800;
  color: #0c4384;
  margin-top: 4px;
}}

.main {{
  position: relative;
  z-index: 2;
  flex: 1;
  width: min(920px, 90vw);
  margin: 0 auto;
  padding: clamp(28px, 4.5vh, 48px) 12px clamp(24px, 3.5vh, 36px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(14px, 2vh, 20px);
}}
.head {{
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
}}
h1 {{
  font-size: clamp(1.15rem, 2.55vw, 1.82rem);
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--blue);
  max-width: 38ch;
  margin: 0 auto;
}}
html[lang="en"] h1 {{ max-width: 40ch; }}
html[dir="rtl"] h1 {{
  text-transform: none;
  letter-spacing: 0;
  font-size: clamp(1.35rem, 2.9vw, 2rem);
  max-width: 22ch;
  line-height: 1.45;
}}
h1 .brand {{ color: var(--amber); }}
.soon {{
  font-size: clamp(1.15rem, 2.55vw, 1.82rem);
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--blue);
}}
html[dir="rtl"] .soon {{
  text-transform: none;
  letter-spacing: 0;
  font-size: clamp(1.3rem, 2.7vw, 1.85rem);
}}
.body, .follow {{
  font-size: clamp(.88rem, 1.35vw, 1rem);
  font-weight: 800;
  line-height: 1.4;
  color: #000;
  max-width: 58ch;
}}
html[dir="rtl"] .body,
html[dir="rtl"] .follow {{
  max-width: 46ch;
  line-height: 1.6;
}}

.footer {{
  position: relative;
  z-index: 2;
  width: min(1120px, 94vw);
  margin: 0 auto;
  padding: 8px 4px clamp(22px, 3.5vh, 36px);
  direction: ltr;
}}
.footer ul {{
  list-style: none;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: center;
  gap: 10px 16px;
}}
.footer li {{
  display: grid;
  place-items: center;
  min-width: 0;
}}
.footer img {{
  max-height: 54px;
  max-width: 100%;
  width: auto;
  object-fit: contain;
}}
.footer li:nth-child(1) img {{ max-height: 44px; }}
.footer li:nth-child(4) img {{ max-height: 60px; }}
.footer li:nth-child(6) img {{ max-height: 40px; }}

@media (max-width: 760px) {{
  .header {{
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "c c" "l r";
    row-gap: 16px;
  }}
  .brand-mark {{ grid-area: c; }}
  .side.l {{ grid-area: l; justify-self: center; }}
  .side.r {{ grid-area: r; justify-self: center; }}
  .brand-grid {{ width: 44px; height: 44px; gap: 4px; }}
  .brand-grid span {{ font-size: 13px; border-radius: 5px; }}
  .side img {{ height: 42px; }}
  .footer ul {{
    grid-template-columns: repeat(3, 1fr);
    row-gap: 20px;
  }}
}}
</style>
</head>
<body>
<div class="page">
  <div class="bg" aria-hidden="true">
    <div class="glow a"></div>
    <div class="glow b"></div>
    <div class="glow c"></div>
    <svg viewBox="0 0 1000 560" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <g opacity="0.14" stroke="#2563eb" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.5">
        <rect fill="white" fill-opacity="0.8" height="245" rx="18" width="220" x="155" y="105"></rect>
        <line stroke-width="3" x1="155" x2="375" y1="145" y2="145"></line>
        <circle cx="178" cy="125" fill="#2563eb" r="4"></circle>
        <circle cx="193" cy="125" fill="#2563eb" r="4"></circle>
        <circle cx="208" cy="125" fill="#2563eb" r="4"></circle>
        <rect height="16" rx="8" stroke-width="2.5" width="125" x="228" y="117"></rect>
        <rect height="60" rx="8" stroke-width="3" width="80" x="180" y="170"></rect>
        <rect height="60" rx="8" stroke-width="3" width="80" x="275" y="170"></rect>
        <line stroke-width="3" x1="180" x2="355" y1="250" y2="250"></line>
        <line stroke-width="3" x1="180" x2="310" y1="270" y2="270"></line>
      </g>
      <g opacity="0.1" stroke="#2563eb" stroke-width="3">
        <rect fill="white" height="180" rx="12" width="170" x="375" y="270"></rect>
        <line x1="375" x2="545" y1="310" y2="310"></line>
        <line stroke-dasharray="2 2" x1="431" x2="431" y1="310" y2="450"></line>
        <line stroke-dasharray="2 2" x1="488" x2="488" y1="310" y2="450"></line>
        <line stroke-dasharray="2 2" x1="375" x2="545" y1="355" y2="355"></line>
        <line stroke-dasharray="2 2" x1="375" x2="545" y1="400" y2="400"></line>
      </g>
      <g opacity="0.18">
        <line stroke="#1d4ed8" stroke-linecap="round" stroke-width="52" x1="695" x2="590" y1="210" y2="460"></line>
        <line stroke="#eff6ff" stroke-linecap="round" stroke-width="28" x1="695" x2="590" y1="210" y2="460"></line>
        <circle cx="725" cy="145" fill="white" fill-opacity="0.85" r="120" stroke="#1d4ed8" stroke-width="24"></circle>
        <g stroke="#2563eb" stroke-linecap="round" stroke-width="2">
          <line stroke-width="3" x1="615" x2="835" y1="145" y2="145"></line>
          <line stroke-width="3" x1="725" x2="725" y1="35" y2="255"></line>
          <path d="M 635 105 Q 725 125 815 105" fill="none"></path>
          <path d="M 635 185 Q 725 165 815 185" fill="none"></path>
          <ellipse cx="725" cy="145" fill="none" rx="55" ry="105" stroke-width="2.5"></ellipse>
        </g>
      </g>
    </svg>
  </div>

  <div class="langs" role="navigation" aria-label="Language">
    <button type="button" data-lang="fr">FR</button>
    <button type="button" data-lang="en">EN</button>
    <button type="button" data-lang="ar">AR</button>
  </div>

  <header class="header">
    <div class="side l">
      <img id="tn" alt="Tunisie" />
      <span data-i18n="tunisia">République Tunisienne</span>
    </div>
    <div class="brand-mark" aria-label="EU4Youth">
      <div class="brand-grid">
        <span class="e">E</span>
        <span class="u">U</span>
        <span class="n">4</span>
        <span class="y">Y</span>
      </div>
      <div class="brand-txt">
        <span class="youth">youth</span>
        <span class="tag">#EU4Youth</span>
      </div>
    </div>
    <div class="side r">
      <img id="eu" alt="Union européenne" />
      <span data-i18n="funded">Financé par l’Union européenne</span>
    </div>
  </header>

  <main class="main">
    <div class="head">
      <h1 data-i18n="title" data-html="1"></h1>
      <p class="soon" data-i18n="soon"></p>
    </div>
    <p class="body" data-i18n="body"></p>
    <p class="follow" data-i18n="follow"></p>
  </main>

  <footer class="footer">
    <ul id="projects"></ul>
  </footer>
</div>
<script>
const A = {A};
const P = [
  ["fe3ila","Fe3il.a"],["jeuness","Jeun'ESS"],["maghroumin","Maghroum'IN"],
  ["swafy","SWAFY"],["irada","IRADA4YOUTH"],["go4","GO4Youth"]
];
const T = {{
  fr: {{
    doc: "EU4Youth — Site en préparation",
    tunisia: "République Tunisienne",
    funded: "Financé par l’Union européenne",
    title: "Le nouveau site <span class=\\"brand\\">EU4Youth</span> est actuellement en préparation.",
    soon: "Rendez-vous bientôt.",
    body: "À travers cette plateforme, découvrez prochainement les projets, les initiatives, les opportunités et les parcours qui contribuent à renforcer la place des jeunes dans le développement économique, social et citoyen de la Tunisie.",
    follow: "En attendant, suivez EU4Youth sur nos réseaux sociaux et restez connectés pour découvrir nos actualités, projets et opportunités."
  }},
  en: {{
    doc: "EU4Youth — Website under construction",
    tunisia: "République Tunisienne",
    funded: "Financé par l’Union européenne",
    title: "The new <span class=\\"brand\\">EU4Youth</span> website is currently under construction. See you soon.",
    soon: "",
    body: "Through this platform, you will soon discover the projects, initiatives, opportunities and stories that contribute to strengthening young people’s role in Tunisia’s economic, social and civic development.",
    follow: "In the meantime, follow the latest news from the European Union in Tunisia."
  }},
  ar: {{
    doc: "EU4Youth — الموقع قيد الإعداد",
    tunisia: "République Tunisienne",
    funded: "Financé par l’Union européenne",
    title: "الموقع الجديد متاع <span class=\\"brand\\">EU4Youth</span> قاعد يحضر.",
    soon: "نلتقي قريباً.",
    body: "من خلال المنصة هاذي، باش تكتشفوا قريبا المشاريع والمبادرات والفرص والتجارب اللي تساهم في تعزيز دور الشباب في التنمية الاقتصادية والاجتماعية والمواطنة في تونس.",
    follow: "وفي الأثناء، تابعوا EU4Youth على شبكات التواصل الاجتماعي وخليكم على تواصل باش تكتشفوا آخر الأخبار والمشاريع والفرص."
  }}
}};

function setLang(lang) {{
  if (!T[lang]) lang = "fr";
  const t = T[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = t.doc;
  document.querySelectorAll("[data-i18n]").forEach((el) => {{
    const k = el.getAttribute("data-i18n");
    const v = t[k] || "";
    if (el.getAttribute("data-html") === "1") el.innerHTML = v;
    else el.textContent = v;
    if (k === "soon") el.hidden = !String(v).trim();
  }});
  document.querySelectorAll("[data-lang]").forEach((b) =>
    b.classList.toggle("on", b.getAttribute("data-lang") === lang)
  );
  try {{ localStorage.setItem("eu4y_coming_lang", lang); }} catch (e) {{}}
  const u = new URL(location.href);
  u.searchParams.set("lang", lang);
  history.replaceState({{}}, "", u);
}}

function boot() {{
  document.getElementById("tn").src = A.tn;
  document.getElementById("eu").src = A.eu;
  document.getElementById("projects").innerHTML = P.map(
    ([k, a]) => `<li><img src="${{A[k]}}" alt="${{a}}" /></li>`
  ).join("");
  document.querySelectorAll("[data-lang]").forEach((b) =>
    b.addEventListener("click", () => setLang(b.getAttribute("data-lang")))
  );
  const q = new URLSearchParams(location.search).get("lang");
  let lang = q && T[q] ? q : null;
  if (!lang) try {{ lang = localStorage.getItem("eu4y_coming_lang"); }} catch (e) {{}}
  if (!lang || !T[lang]) {{
    const n = (navigator.language || "fr").toLowerCase();
    lang = n.startsWith("ar") ? "ar" : n.startsWith("en") ? "en" : "fr";
  }}
  setLang(lang);
}}
document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", boot)
  : boot();
</script>
</body>
</html>
"""

OUT.write_text(html, encoding="utf-8")
DESKTOP.write_text(html, encoding="utf-8")
print("OK", OUT.stat().st_size // 1024, "KB")
