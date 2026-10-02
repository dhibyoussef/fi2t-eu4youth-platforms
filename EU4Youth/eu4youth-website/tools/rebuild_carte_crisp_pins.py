"""Rebuild carte hero fill with crisp vector-quality pins."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "public" / "img"
ASSETS = Path(
    r"C:\Users\youss\.cursor\projects\c-Users-youss-OneDrive-Attachments-Desktop-fi2t-live-editor\assets"
)
OUT = IMG / "carte-hero-fill.png"
PIN_BLUE = (7, 78, 162, 255)  # EU blue-ish
SCALE = 3


def find_banner() -> Path:
    return next(ASSETS.glob("*map_banner_no_watermark*"))


def blue_mask(arr: np.ndarray) -> np.ndarray:
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    return (b > 110) & (b > r + 35) & (b > g + 25) & (r < 90)


def pin_clusters(arr: np.ndarray) -> list[dict]:
    h, w, _ = arr.shape
    mask = blue_mask(arr)
    visited = np.zeros((h, w), dtype=bool)
    clusters: list[dict] = []
    for y in range(h):
        for x in range(w):
            if not mask[y, x] or visited[y, x]:
                continue
            q = deque([(x, y)])
            visited[y, x] = True
            pts: list[tuple[int, int]] = []
            while q:
                cx, cy = q.popleft()
                pts.append((cx, cy))
                for nx, ny in (
                    (cx - 1, cy),
                    (cx + 1, cy),
                    (cx, cy - 1),
                    (cx, cy + 1),
                ):
                    if 0 <= nx < w and 0 <= ny < h and mask[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        q.append((nx, ny))
            if len(pts) < 40:
                continue
            xs = [p[0] for p in pts]
            ys = [p[1] for p in pts]
            tip = max(pts, key=lambda p: (p[1], -abs(p[0] - sum(xs) / len(xs))))
            clusters.append(
                {
                    "n": len(pts),
                    "h": max(ys) - min(ys) + 1,
                    "w": max(xs) - min(xs) + 1,
                    "tip": tip,
                    "pts": pts,
                }
            )
    clusters.sort(key=lambda c: -c["n"])
    return clusters


def inpaint_pins(arr: np.ndarray, clusters: list[dict]) -> np.ndarray:
    """Replace pin pixels with nearby non-blue map color."""
    out = arr.copy()
    h, w, _ = arr.shape
    mask = np.zeros((h, w), dtype=bool)
    for c in clusters:
        for x, y in c["pts"]:
            mask[y, x] = True
    # Dilate slightly to catch soft edges/shadows
    dil = mask.copy()
    for _ in range(3):
        n = dil.copy()
        n[1:, :] |= dil[:-1, :]
        n[:-1, :] |= dil[1:, :]
        n[:, 1:] |= dil[:, :-1]
        n[:, :-1] |= dil[:, 1:]
        dil = n
    # Also catch dark soft shadows under pins
    r, g, b = out[:, :, 0], out[:, :, 1], out[:, :, 2]
    shadow = dil & (r < 160) & (g < 120) & (b < 100)
    kill = dil | shadow

    ys, xs = np.where(kill)
    for x, y in zip(xs.tolist(), ys.tolist()):
        # sample ring of non-kill pixels
        samples = []
        for rad in (4, 8, 12, 18):
            for dy in range(-rad, rad + 1):
                for dx in (-rad, rad):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and not kill[ny, nx]:
                        samples.append(out[ny, nx])
                for dx in range(-rad + 1, rad):
                    for dy in (-rad, rad):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h and not kill[ny, nx]:
                            samples.append(out[ny, nx])
            if samples:
                break
        if samples:
            out[y, x] = np.median(np.array(samples), axis=0)
    # Soft blur only on patched area edges
    return out


def draw_pin(height: int) -> Image.Image:
    """Antialiased map pin with hole + soft shadow, supersampled."""
    ss = 4
    H = height * ss
    W = int(H * 0.72)
    canvas = Image.new("RGBA", (W + 8 * ss, H + 10 * ss), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    # Shadow ellipse under tip
    tip_x = canvas.width // 2
    tip_y = H - 2 * ss
    sw, sh = int(W * 0.55), int(H * 0.12)
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse(
        (tip_x - sw // 2, tip_y - sh // 3, tip_x + sw // 2, tip_y + sh),
        fill=(0, 0, 0, 90),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=2.2 * ss))
    canvas = Image.alpha_composite(canvas, shadow)
    draw = ImageDraw.Draw(canvas)

    # Teardrop body: circle + triangle to tip
    head_r = int(W * 0.42)
    head_cx = tip_x
    head_cy = int(H * 0.38)
    # circle head
    draw.ellipse(
        (head_cx - head_r, head_cy - head_r, head_cx + head_r, head_cy + head_r),
        fill=PIN_BLUE,
    )
    # pointed body
    draw.polygon(
        [
            (head_cx - int(head_r * 0.92), head_cy + int(head_r * 0.25)),
            (head_cx + int(head_r * 0.92), head_cy + int(head_r * 0.25)),
            (tip_x, tip_y),
        ],
        fill=PIN_BLUE,
    )
    # smooth join: second circle slightly lower
    draw.ellipse(
        (
            head_cx - int(head_r * 0.95),
            head_cy - int(head_r * 0.15),
            head_cx + int(head_r * 0.95),
            head_cy + int(head_r * 1.05),
        ),
        fill=PIN_BLUE,
    )

    # Inner hole
    hole_r = int(head_r * 0.38)
    # punch hole with destination-out
    hole = Image.new("L", canvas.size, 0)
    hd = ImageDraw.Draw(hole)
    hd.ellipse(
        (head_cx - hole_r, head_cy - hole_r, head_cx + hole_r, head_cy + hole_r),
        fill=255,
    )
    r, g, b, a = canvas.split()
    a = ImageChops_subtract(a, hole)
    canvas = Image.merge("RGBA", (r, g, b, a))

    # Downscale with LANCZOS for crisp AA
    final = canvas.resize(
        (max(1, canvas.width // ss), max(1, canvas.height // ss)),
        Image.Resampling.LANCZOS,
    )
    return final


def ImageChops_subtract(a: Image.Image, hole: Image.Image) -> Image.Image:
    aa = np.array(a).astype(np.int16)
    hh = np.array(hole).astype(np.int16)
    return Image.fromarray(np.clip(aa - hh, 0, 255).astype(np.uint8), mode="L")


def main() -> None:
    src = find_banner()
    base = Image.open(src).convert("RGB")
    print("source", src.name, base.size)
    clusters = pin_clusters(np.array(base))
    print("pins found", len(clusters))

    cleaned = inpaint_pins(np.array(base), clusters)
    map_img = Image.fromarray(cleaned.astype(np.uint8), "RGB")
    map_img = map_img.resize(
        (base.width * SCALE, base.height * SCALE),
        Image.Resampling.LANCZOS,
    )
    map_img = map_img.filter(ImageFilter.UnsharpMask(radius=1.1, percent=90, threshold=2))
    result = map_img.convert("RGBA")

    # Draw crisp pins largest first so small ones sit cleanly
    for i, c in enumerate(clusters):
        tip_x = int(c["tip"][0] * SCALE)
        tip_y = int(c["tip"][1] * SCALE)
        pin_h = max(28, int(c["h"] * SCALE * 1.05))
        pin = draw_pin(pin_h)
        # align tip of pin image to tip point
        # tip is near bottom-center of pin image
        px = tip_x - pin.width // 2
        py = tip_y - pin.height + 2
        result.alpha_composite(pin, (px, py))
        print(f"pin {i}: tip=({tip_x},{tip_y}) h={pin_h}")

    out_rgb = result.convert("RGB")
    out_rgb.save(OUT, format="PNG", optimize=True)
    print("saved", OUT, out_rgb.size, OUT.stat().st_size)


if __name__ == "__main__":
    main()
