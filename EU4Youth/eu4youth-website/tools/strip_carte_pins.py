"""Strip blue map pins from carte-hero-fill.png and emit pin tip positions."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "img" / "carte-hero-fill.png"
OUT = ROOT / "public" / "img" / "carte-hero-map-only.png"


def is_blue(r: int, g: int, b: int, a: int) -> bool:
    return a > 200 and b > 110 and b > r + 35 and b > g + 25 and r < 80


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    px = im.load()

    mask = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_blue(r, g, b, a):
                mask[y][x] = True

    visited = [[False] * w for _ in range(h)]
    clusters: list[dict] = []
    for y in range(h):
        for x in range(w):
            if not mask[y][x] or visited[y][x]:
                continue
            q = deque([(x, y)])
            visited[y][x] = True
            pts: list[tuple[int, int]] = []
            while q:
                cx, cy = q.popleft()
                pts.append((cx, cy))
                for nx, ny in (
                    (cx - 1, cy),
                    (cx + 1, cy),
                    (cx, cy - 1),
                    (cx, cy + 1),
                    (cx - 1, cy - 1),
                    (cx + 1, cy - 1),
                    (cx - 1, cy + 1),
                    (cx + 1, cy + 1),
                ):
                    if 0 <= nx < w and 0 <= ny < h and mask[ny][nx] and not visited[ny][nx]:
                        visited[ny][nx] = True
                        q.append((nx, ny))
            if len(pts) < 40:
                continue
            xs = [p[0] for p in pts]
            ys = [p[1] for p in pts]
            minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
            tip_y = maxy
            tip_xs = [px_ for px_, py_ in pts if py_ >= maxy - 2]
            tip_x = sum(tip_xs) / len(tip_xs)
            clusters.append(
                {
                    "n": len(pts),
                    "w": maxx - minx + 1,
                    "h": maxy - miny + 1,
                    "tip": (tip_x, tip_y),
                }
            )

    clusters.sort(key=lambda c: -c["n"])
    print("clusters", len(clusters))
    for i, c in enumerate(clusters):
        left = c["tip"][0] / w * 100
        top = c["tip"][1] / h * 100
        print(
            f"{i}: left={left:.2f}% top={top:.2f}% "
            f"w={c['w']/w*100:.2f}% h={c['h']/h*100:.2f}% n={c['n']}"
        )

    kill = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if not mask[y][x]:
                continue
            for dy in range(-2, 3):
                for dx in range(-2, 3):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h:
                        kill[ny][nx] = True

    for c in clusters:
        tipx, tipy = c["tip"]
        rw = max(6, int(c["w"] * 0.55))
        rh = max(3, int(c["h"] * 0.12))
        for yy in range(int(tipy) - 2, int(tipy) + rh + 4):
            for xx in range(int(tipx) - rw - 2, int(tipx) + rw + 3):
                if 0 <= xx < w and 0 <= yy < h:
                    r, g, b, a = px[xx, yy]
                    if a > 0 and r < 230 and g < 160 and b < 100 and not (b > r and b > 100):
                        kill[yy][xx] = True

    out = im.copy()
    opx = out.load()
    for y in range(h):
        for x in range(w):
            if not kill[y][x]:
                continue
            acc = [0, 0, 0]
            n = 0
            for rad in (4, 8, 12, 18):
                for dy in range(-rad, rad + 1):
                    for dx in range(-rad, rad + 1):
                        if abs(dx) + abs(dy) < rad // 2:
                            continue
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h and not kill[ny][nx]:
                            r, g, b, a = px[nx, ny]
                            if r > 180 and g > 90:
                                acc[0] += r
                                acc[1] += g
                                acc[2] += b
                                n += 1
                if n >= 8:
                    break
            if n:
                opx[x, y] = (acc[0] // n, acc[1] // n, acc[2] // n, 255)
            else:
                opx[x, y] = (245, 170, 45, 255)

    blur = out.filter(ImageFilter.GaussianBlur(1.2))
    bpx = blur.load()
    for y in range(h):
        for x in range(w):
            if kill[y][x]:
                opx[x, y] = bpx[x, y]

    out.save(OUT)
    print("saved", OUT)


if __name__ == "__main__":
    main()
