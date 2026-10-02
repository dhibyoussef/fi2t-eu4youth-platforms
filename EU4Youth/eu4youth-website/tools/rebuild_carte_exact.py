"""Rebuild carte hero fill + full-height design watermark to match mockup."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "public" / "img"
ORANGE = np.array([241, 168, 72], dtype=np.uint8)


def main() -> None:
    comp = Image.open(IMG / "carte-hero-comp.png").convert("RGB")
    arr = np.array(comp)
    h, w, _ = arr.shape
    print("comp", w, h)

    out = arr.copy()
    x0 = int(w * 0.46)
    right = slice(x0, w)

    r = out[:, :, 0].astype(np.int16)
    g = out[:, :, 1].astype(np.int16)
    b = out[:, :, 2].astype(np.int16)

    white = (r[:, right] > 215) & (g[:, right] > 215) & (b[:, right] > 210)
    blue = (
        (b[:, right] > 100)
        & (b[:, right] > r[:, right] + 35)
        & (b[:, right] > g[:, right] + 25)
        & (r[:, right] < 120)
    )
    near_white = (
        (r[:, right] > 200)
        & (g[:, right] > 180)
        & (b[:, right] > 160)
        & ((r[:, right] + g[:, right] + b[:, right]) > 560)
    )
    cream = (r[:, right] > 245) & (g[:, right] > 220) & (b[:, right] > 190)
    kill = white | blue | near_white | cream

    region = out[:, right].astype(np.float32)
    region[kill] = ORANGE.astype(np.float32)

    kill_img = Image.fromarray((kill.astype(np.uint8) * 255))
    kill_img = kill_img.filter(ImageFilter.MaxFilter(5))
    mask2 = np.array(kill_img) > 0
    lum = region[:, :, 0] + region[:, :, 1] + region[:, :, 2]
    is_textish = mask2 & (
        (lum > 560) | ((region[:, :, 2] > region[:, :, 0] + 20) & (region[:, :, 2] > 90))
    )
    region[is_textish] = ORANGE.astype(np.float32)
    out[:, right] = np.clip(region, 0, 255).astype(np.uint8)

    # Soft blend map → cleaned right; kill baked text in blend zone
    blend_w = int(w * 0.08)
    bx1 = min(w, x0 + blend_w)
    orig = arr.astype(np.float32)
    for x in range(x0, bx1):
        t = (x - x0) / max(1, blend_w - 1)
        o = orig[:, x]
        c = out[:, x].astype(np.float32)
        rr, gg, bb = o[:, 0], o[:, 1], o[:, 2]
        is_txt = ((rr > 215) & (gg > 215) & (bb > 210)) | (
            (bb > 100) & (bb > rr + 35) & (bb > gg + 25) & (rr < 120)
        )
        mixed = o * (1 - t) + c * t
        mixed[is_txt] = ORANGE
        out[:, x] = np.clip(mixed, 0, 255).astype(np.uint8)

    fill_path = IMG / "carte-hero-fill.png"
    Image.fromarray(out).save(fill_path, optimize=True)
    print("saved fill", out.shape, fill_path.stat().st_size)

    # Watermark from original design (full height, right bleed kept)
    src = arr.astype(np.int16)
    bg = np.array([241, 168, 72], dtype=np.int16)
    dist = np.abs(src - bg).sum(2)
    rr, gg, bb = src[:, :, 0], src[:, :, 1], src[:, :, 2]
    is_orange_fam = (rr > 160) & (gg > 90) & (bb < 140) & (rr > gg) & (gg > bb - 10)
    is_wm = is_orange_fam & (dist > 18) & (dist < 140)
    is_wm &= ~((rr > 210) & (gg > 210) & (bb > 200))
    is_wm &= ~((bb > 100) & (bb > rr + 30) & (bb > gg + 20) & (rr < 120))

    wm_mask = np.zeros((h, w), dtype=bool)
    wm_mask[:, int(w * 0.52) :] = is_wm[:, int(w * 0.52) :]
    ys, xs = np.where(wm_mask)
    y0, y1 = max(0, int(ys.min()) - 10), min(h, int(ys.max()) + 10)
    x_left = max(0, int(xs.min()) - 20)
    x_right = w

    crop = arr[y0:y1, x_left:x_right]
    crop_mask = wm_mask[y0:y1, x_left:x_right]
    d = dist[y0:y1, x_left:x_right]

    rgba = np.zeros((crop.shape[0], crop.shape[1], 4), dtype=np.uint8)
    alpha = np.zeros_like(d, dtype=np.float32)
    alpha[crop_mask] = np.clip((d[crop_mask] - 18) / 80.0, 0, 1) * 255
    amber = np.array([196, 118, 36], dtype=np.uint8)
    for c in range(3):
        rgba[:, :, c] = np.where(alpha > 0, amber[c], 0)
    rgba[:, :, 3] = alpha.astype(np.uint8)

    mono = Image.fromarray(rgba, "RGBA")
    mono = mono.resize((mono.width * 2, mono.height * 2), Image.Resampling.LANCZOS)
    mono_path = IMG / "eu4y-monogram.png"
    mono.save(mono_path, optimize=True)
    print("saved mono", mono.size, mono_path.stat().st_size)

    Image.fromarray(out).resize((900, int(900 * h / w))).save(IMG / "_preview_new_fill.png")
    bg_prev = Image.new("RGB", mono.size, (241, 168, 72))
    bg_prev.paste(mono, mask=mono.split()[-1])
    bg_prev.resize((400, int(400 * mono.height / mono.width))).save(IMG / "_preview_new_mono.png")
    print("previews ok")


if __name__ == "__main__":
    main()
