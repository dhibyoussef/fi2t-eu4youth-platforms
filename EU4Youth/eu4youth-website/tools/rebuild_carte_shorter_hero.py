"""Rebuild full-bleed carte fill (design size) + matching watermark.

Restores left map coverage so there is no empty orange gap, matching the
reference mockup proportions (3156×1252).
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "public" / "img"
ORANGE = np.array([241, 168, 72], dtype=np.float32)


def clean_fill_from_comp(comp: Image.Image) -> Image.Image:
    arr = np.array(comp.convert("RGB"), dtype=np.float32)
    h, w, _ = arr.shape
    cut = 1320
    fade = 140

    out = np.empty_like(arr)
    out[:, :cut] = arr[:, :cut]
    out[:, cut:] = ORANGE

    for i, x in enumerate(range(cut, min(w, cut + fade))):
        t = i / max(1, fade - 1)
        t = t * t * (3 - 2 * t)
        out[:, x] = arr[:, x] * (1 - t) + ORANGE * t

    right = out[:, cut + fade :]
    if right.size:
        r, g, b = right[:, :, 0], right[:, :, 1], right[:, :, 2]
        dist = np.abs(r - 241) + np.abs(g - 168) + np.abs(b - 72)
        right[dist > 18] = ORANGE
        out[:, cut + fade :] = right

    band = out[:, cut : cut + fade]
    r, g, b = band[:, :, 0], band[:, :, 1], band[:, :, 2]
    whiteish = (r > 200) & (g > 190) & (b > 170)
    blueish = (b > 90) & (b > r + 25) & (b > g + 20) & (r < 140)
    dark_wm = (
        (r > 150)
        & (r < 235)
        & (g > 80)
        & (g < 160)
        & (b < 120)
        & (r > g + 20)
        & ((np.abs(r - 241) + np.abs(g - 168) + np.abs(b - 72)) > 35)
    )
    kill = whiteish | blueish | dark_wm
    for c in range(3):
        channel = band[:, :, c]
        channel[kill] = ORANGE[c]
        band[:, :, c] = channel
    out[:, cut : cut + fade] = band
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def main() -> None:
    fill = clean_fill_from_comp(Image.open(IMG / "carte-hero-comp.png"))
    fill_path = IMG / "carte-hero-fill.png"
    fill.save(fill_path, optimize=True)
    tw, th = fill.size
    print("fill", fill.size)

    mark_src = IMG / "carte-eu4y-mark.png"
    if not mark_src.exists():
        mark_src = IMG / "eu4y-monogram.png"
    mark = Image.open(mark_src).convert("RGBA")
    mw, mh = mark.size
    # Bleed slightly past the hero edges like the mockup.
    inner_h = int(th * 1.12)
    inner_w = max(1, int(round(mw * (inner_h / mh))))
    resized = mark.resize((inner_w, inner_h), Image.Resampling.LANCZOS)
    mark_out = Image.new("RGBA", (inner_w, th), (0, 0, 0, 0))
    mark_out.paste(resized, (0, (th - inner_h) // 2), resized)
    mark_path = IMG / "eu4y-monogram.png"
    mark_out.save(mark_path, optimize=True)
    print("mark", mark_out.size)


if __name__ == "__main__":
    main()
