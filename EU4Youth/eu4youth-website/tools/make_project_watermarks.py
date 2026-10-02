"""Build transparent white hero watermarks from each project's actual logo.

Jeun'ESS already ships a clean watermark. This regenerates the other five from
charter / site colour lockups so heroes never show a white/grey plate.

Usage: python tools/make_project_watermarks.py
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / 'public' / 'img'
CHARTE = ROOT.parent / 'EU4Youth' / 'web eu4youth - Charte graphique et logos'
OUT = ROOT / 'tools' / 'out'

COLOURS = {
    'fe3ila': (4, 8, 132),
    'swafy': (108, 92, 164),
    'maghroumin': (80, 184, 76),
    'go4youth': (32, 180, 228),
    'irada4youth': (240, 168, 72),
}


def key_edge_bg(img: Image.Image, thr: int = 28) -> Image.Image:
    """Flood-fill near-corner colour (or already-transparent) to alpha 0."""
    img = img.convert('RGBA')
    w, h = img.size
    px = img.load()
    base = px[0, 0][:3]
    # If corner is already transparent, treat near-black / near-white as bg.
    if px[0, 0][3] < 12:
        base_mode = 'luma'
    else:
        base_mode = 'rgb'

    def is_bg(p) -> bool:
        r, g, b, a = p
        if a < 12:
            return True
        if base_mode == 'luma':
            return max(r, g, b) <= thr or (r + g + b) >= 765 - thr
        return sum(abs(a - b) for a, b in zip((r, g, b), base)) <= thr

    seen = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))
    while q:
        x, y = q.popleft()
        if not (0 <= x < w and 0 <= y < h):
            continue
        i = y * w + x
        if seen[i]:
            continue
        seen[i] = 1
        if not is_bg(px[x, y]):
            continue
        px[x, y] = (0, 0, 0, 0)
        q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    return img


def to_white_mark(img: Image.Image) -> Image.Image:
    """Paint every opaque pixel white, keep source alpha (boost dark ink)."""
    arr = np.asarray(img.convert('RGBA')).astype(np.float32)
    rgb = arr[..., :3]
    a = arr[..., 3]
    lum = rgb.mean(axis=2)
    # Dark navy/charcoal wordmarks need full coverage when flipped to white.
    boost = np.where((a > 8) & (lum < 70), np.minimum(255, a * 1.25), a)
    out = np.zeros_like(arr)
    out[..., 0] = 255
    out[..., 1] = 255
    out[..., 2] = 255
    out[..., 3] = boost
    return Image.fromarray(out.astype(np.uint8), 'RGBA')


def fe3ila_glyphs_white(src: Path) -> Image.Image:
    """Keep yellow + teal calligraphy only — drop navy panel plates."""
    arr = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32)
    r, g, b, a = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]
    # Navy panel ≈ (42, 52, 122); yellow ≈ (247, 206, 16); teal accents.
    navy_dist = np.sqrt((r - 42) ** 2 + (g - 52) ** 2 + (b - 122) ** 2)
    yellow = (r > 180) & (g > 140) & (b < 100) & (a > 20)
    teal = (b > 120) & (g > 140) & (r < 120) & (a > 20)
    # Also keep anything chromatic that is not navy fill.
    chroma = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
    ink = ((yellow | teal) | ((chroma > 40) & (navy_dist > 55) & (a > 20))) & (a > 20)
    out = np.zeros_like(arr)
    out[..., 0] = 255
    out[..., 1] = 255
    out[..., 2] = 255
    out[..., 3] = np.where(ink, np.minimum(255, a * 1.05), 0)
    return Image.fromarray(out.astype(np.uint8), 'RGBA')


def black_bg_to_white(src: Path) -> Image.Image:
    img = key_edge_bg(Image.open(src), thr=22)
    return to_white_mark(img)


def white_bg_to_white_mark(src: Path) -> Image.Image:
    img = key_edge_bg(Image.open(src), thr=40)
    return to_white_mark(img)


def save_pair(slug: str, white: Image.Image, colour: Image.Image | None = None) -> None:
    white.save(IMG / f'logo-{slug}-white.webp', quality=90, method=6)
    white.save(IMG / f'logo-{slug}-watermark.webp', quality=90, method=6)
    if colour is not None:
        colour.save(IMG / f'logo-{slug}.png', optimize=True)
    # Preview on project colour
    rgb = COLOURS[slug]
    canvas = Image.new('RGBA', (1400, 600), (*rgb, 255))
    scale = min(520 / white.width, 360 / white.height)
    wm = white.resize(
        (max(1, int(white.width * scale)), max(1, int(white.height * scale))),
        Image.Resampling.LANCZOS,
    )
    layer = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    layer.paste(wm, (1400 - wm.width - 48, 600 - wm.height - 36), wm)
    a = layer.split()[-1].point(lambda v: int(v * 0.18))
    layer.putalpha(a)
    OUT.mkdir(parents=True, exist_ok=True)
    Image.alpha_composite(canvas, layer).convert('RGB').save(OUT / f'wm-final-{slug}.png')
    print(f'{slug}: white {white.size} opaque={(np.asarray(white)[..., 3] > 20).sum()}')


def main() -> None:
    # --- Fe3il.a: glyphs only (no navy plates) ---
    fe_src = CHARTE / 'fe3il.a' / 'main logo' / 'fe3ila.webp'
    fe_white = fe3ila_glyphs_white(fe_src)
    # Keep navy panels for the colour strip lockup — do not key navy fills.
    fe_colour = Image.open(fe_src).convert('RGBA')
    save_pair('fe3ila', fe_white, fe_colour)

    # --- GO4Youth ---
    go_src = CHARTE / 'go4youth' / 'main logo' / 'Asset 1q.webp'
    go_white = black_bg_to_white(go_src)
    go_colour = key_edge_bg(Image.open(go_src), thr=18)
    save_pair('go4youth', go_white, go_colour)

    # --- Irada4Youth ---
    ir_src = CHARTE / 'irada4youth' / 'main logo' / 'irada.webp'
    ir_white = black_bg_to_white(ir_src)
    ir_colour = key_edge_bg(Image.open(ir_src), thr=18)
    save_pair('irada4youth', ir_white, ir_colour)

    # --- Maghroum'IN ---
    mg_src = CHARTE / 'maghroumin' / 'magroumin.webp'
    mg_white = black_bg_to_white(mg_src)
    mg_colour = key_edge_bg(Image.open(mg_src), thr=18)
    save_pair('maghroumin', mg_white, mg_colour)

    # --- SWAFY (no charter pack folder — use site colour lockup) ---
    sw_src = IMG / 'logo-swafy.png'
    sw_white = white_bg_to_white_mark(sw_src)
    sw_colour = key_edge_bg(Image.open(sw_src), thr=36)
    save_pair('swafy', sw_white, sw_colour)

    print('done')


if __name__ == '__main__':
    main()
