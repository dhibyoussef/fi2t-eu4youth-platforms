"""Build carte-hero-fill with design-accurate pins from high-res comp."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "public" / "img"
ASSETS = Path(
    r"C:\Users\youss\.cursor\projects\c-Users-youss-OneDrive-Attachments-Desktop-fi2t-live-editor\assets"
)
SCALE = 3


def clusters_from_mask(mask: np.ndarray, min_pts: int = 40, x_max: int | None = None):
    h, w = mask.shape
    if x_max is None:
        x_max = w
    visited = np.zeros_like(mask, dtype=bool)
    out = []
    for y in range(h):
        for x in range(x_max):
            if not mask[y, x] or visited[y, x]:
                continue
            q = deque([(x, y)])
            visited[y, x] = True
            pts: list[tuple[int, int]] = []
            while q:
                cx, cy = q.popleft()
                pts.append((cx, cy))
                for nx, ny in (
                    (cx + 1, cy),
                    (cx - 1, cy),
                    (cx, cy + 1),
                    (cx, cy - 1),
                    (cx + 1, cy + 1),
                    (cx - 1, cy - 1),
                    (cx + 1, cy - 1),
                    (cx - 1, cy + 1),
                ):
                    if 0 <= nx < w and 0 <= ny < h and mask[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        q.append((nx, ny))
            if len(pts) < min_pts:
                continue
            xs = [p[0] for p in pts]
            ys = [p[1] for p in pts]
            tip = max(pts, key=lambda p: p[1])
            out.append(
                {
                    "n": len(pts),
                    "h": max(ys) - min(ys) + 1,
                    "bbox": (min(xs), min(ys), max(xs), max(ys)),
                    "tip": tip,
                    "pts": pts,
                }
            )
    out.sort(key=lambda c: -c["n"])
    return out


def inpaint(arr: np.ndarray, kill: np.ndarray) -> np.ndarray:
    tmp = arr.astype(np.float32).copy()
    filled = tmp.copy()
    tmp[kill] = 0
    for _ in range(18):
        for dy, dx in (
            (0, 1),
            (0, -1),
            (1, 0),
            (-1, 0),
            (1, 1),
            (-1, 1),
            (1, -1),
            (-1, -1),
        ):
            sh = np.roll(np.roll(tmp, dy, 0), dx, 1)
            need = kill & (tmp.sum(2) == 0)
            has = sh.sum(2) > 0
            m = need & has
            tmp[m] = sh[m]
    filled[kill] = tmp[kill]
    return filled


def main() -> None:
    banner = Image.open(next(ASSETS.glob("*map_banner_no_watermark*"))).convert("RGB")
    comp = Image.open(IMG / "carte-hero-comp.png").convert("RGBA")
    ba = np.array(banner)
    h, w, _ = ba.shape
    r, g, b = ba[:, :, 0], ba[:, :, 1], ba[:, :, 2]
    bmask = (b > 110) & (b > r + 35) & (b > g + 25) & (r < 90)
    place = clusters_from_mask(bmask, min_pts=40)
    print("banner pins", len(place))

    kill = np.zeros((h, w), dtype=bool)
    for c in place:
        for x, y in c["pts"]:
            kill[y, x] = True
    for _ in range(5):
        n = kill.copy()
        n[1:] |= kill[:-1]
        n[:-1] |= kill[1:]
        n[:, 1:] |= kill[:, :-1]
        n[:, :-1] |= kill[:, 1:]
        kill = n
    kill = kill | ((r < 170) & (g < 130) & (b < 110) & kill)

    map_arr = inpaint(ba, kill)
    map_img = Image.fromarray(np.clip(map_arr, 0, 255).astype(np.uint8), "RGB")
    map_img = map_img.resize((w * SCALE, h * SCALE), Image.Resampling.LANCZOS)
    map_img = map_img.filter(ImageFilter.UnsharpMask(radius=1.0, percent=80, threshold=2))

    ca = np.array(comp)
    cr, cg, cb, caa = ca[:, :, 0], ca[:, :, 1], ca[:, :, 2], ca[:, :, 3]
    cmask = (cb > 100) & (cb > cr + 28) & (cb > cg + 18) & (cr < 110) & (caa > 200)
    source_pins = clusters_from_mask(cmask, min_pts=80, x_max=ca.shape[1] // 2 + 80)
    print("comp pins", len(source_pins), [c["n"] for c in source_pins[:6]])

    result = map_img.convert("RGBA")
    pins_dir = IMG / "carte-pins"
    pins_dir.mkdir(exist_ok=True)

    for i, (src, dst) in enumerate(zip(source_pins[:6], place[:6])):
        x0, y0, x1, y1 = src["bbox"]
        pad = max(10, int((x1 - x0) * 0.18))
        x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
        x1, y1 = min(comp.width - 1, x1 + pad), min(comp.height - 1, y1 + pad + int(pad * 0.7))
        sprite = comp.crop((x0, y0, x1 + 1, y1 + 1)).convert("RGBA")
        sa = np.array(sprite)
        rr, gg, bb, aa = sa[:, :, 0], sa[:, :, 1], sa[:, :, 2], sa[:, :, 3]
        pin = (bb > 95) & (bb > rr + 25) & (bb > gg + 15) & (rr < 120)
        shadow = (rr < 95) & (gg < 85) & (bb < 85) & (aa > 20)
        keep = pin | shadow
        for _ in range(2):
            n = keep.copy()
            n[1:] |= keep[:-1]
            n[:-1] |= keep[1:]
            n[:, 1:] |= keep[:, :-1]
            n[:, :-1] |= keep[:, 1:]
            keep = n
        alpha = np.zeros(aa.shape, dtype=np.uint8)
        alpha[pin] = 255
        alpha[shadow & ~pin] = 170
        alpha[keep & ~pin & ~shadow] = 210
        sa[:, :, 3] = alpha
        sprite = Image.fromarray(sa, "RGBA")

        target_h = max(40, int(dst["h"] * SCALE * 1.1))
        tw = max(1, int(sprite.width * (target_h / sprite.height)))
        sprite = sprite.resize((tw, target_h), Image.Resampling.LANCZOS)

        tip_x = int(dst["tip"][0] * SCALE)
        tip_y = int(dst["tip"][1] * SCALE)
        spa = np.array(sprite)
        ys, xs = np.where(spa[:, :, 3] > 200)
        if len(xs):
            tip_local_y = int(ys.max())
            tip_local_x = int(np.median(xs[ys >= ys.max() - 3]))
        else:
            tip_local_x, tip_local_y = sprite.width // 2, sprite.height - 1

        result.alpha_composite(sprite, (tip_x - tip_local_x, tip_y - tip_local_y))
        sprite.save(pins_dir / f"pin-{i}.png")
        print(f"pin{i}: tip=({tip_x},{tip_y}) size={sprite.size}")

    out = result.convert("RGB")
    out_path = IMG / "carte-hero-fill.png"
    out.save(out_path, format="PNG", optimize=True)
    print("saved", out_path, out.size, out_path.stat().st_size)


if __name__ == "__main__":
    main()
