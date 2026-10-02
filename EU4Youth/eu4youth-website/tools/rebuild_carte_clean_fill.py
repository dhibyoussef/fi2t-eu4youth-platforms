"""Build a clean carte hero fill: map + pins only, solid orange right (no baked text/WM)."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "public" / "img"
ORANGE = np.array([241, 168, 72], dtype=np.float32)


def main() -> None:
    comp = Image.open(IMG / "carte-hero-comp.png").convert("RGB")
    arr = np.array(comp, dtype=np.float32)
    h, w, _ = arr.shape
    print("comp", w, h)

    # Keep map+pins through the large center pin; wipe everything to the right.
    # 1320/3156 ≈ 0.418 — past the large pin, before design titles.
    cut = 1320
    fade = 140

    out = np.empty_like(arr)
    out[:, :cut] = arr[:, :cut]
    out[:, cut:] = ORANGE

    # Soft map → solid orange (no leftover glyphs in the fade zone)
    for i, x in enumerate(range(cut, min(w, cut + fade))):
        t = i / max(1, fade - 1)
        # Ease-in so map stays strong longer, then fully orange
        t = t * t * (3 - 2 * t)
        out[:, x] = arr[:, x] * (1 - t) + ORANGE * t

    # Hard wipe any remaining non-orange “textish” pixels on the right of the fade
    right = out[:, cut + fade :]
    if right.size:
        r, g, b = right[:, :, 0], right[:, :, 1], right[:, :, 2]
        # Anything that isn't close to brand orange → force orange
        dist = np.abs(r - 241) + np.abs(g - 168) + np.abs(b - 72)
        right[dist > 18] = ORANGE
        out[:, cut + fade :] = right

    # Also scrub faint outline / white / blue glyphs that sit in the fade band
    band = out[:, cut : cut + fade]
    r, g, b = band[:, :, 0], band[:, :, 1], band[:, :, 2]
    whiteish = (r > 200) & (g > 190) & (b > 170)
    blueish = (b > 90) & (b > r + 25) & (b > g + 20) & (r < 140)
    # Darker-orange watermark strokes (YOUTH leftovers)
    dark_wm = (r > 150) & (r < 235) & (g > 80) & (g < 160) & (b < 120) & (r > g + 20) & (
        (np.abs(r - 241) + np.abs(g - 168) + np.abs(b - 72)) > 35
    )
    kill = whiteish | blueish | dark_wm
    for c in range(3):
        channel = band[:, :, c]
        channel[kill] = ORANGE[c]
        band[:, :, c] = channel
    out[:, cut : cut + fade] = band

    fill = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    path = IMG / "carte-hero-fill.png"
    fill.save(path, optimize=True)
    print("saved", path, fill.size, path.stat().st_size)

    # Preview right half for QA
    preview = fill.crop((int(w * 0.38), 0, w, h)).resize((960, int(960 * h / (w * 0.62))))
    preview.save(IMG / "_inspect_fill_right.png")
    print("preview ok")


if __name__ == "__main__":
    main()
