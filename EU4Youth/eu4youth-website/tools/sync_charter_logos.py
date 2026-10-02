"""Sync site logos from the client charter pack.

Replaces low-res / white-boxed / mismatched org + project marks with the
charter sources (black keyed to transparent for white strips).

Usage: python tools/sync_charter_logos.py
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / 'public' / 'img'
CHARTE = ROOT.parent / 'EU4Youth' / 'web eu4youth - Charte graphique et logos'


def key_edge(img: Image.Image, thr: int = 24) -> Image.Image:
    img = img.convert('RGBA')
    w, h = img.size
    px = img.load()
    corner = px[0, 0]
    # Prefer luma key when corner is already transparent / near-black.
    use_luma = corner[3] < 20 or sum(corner[:3]) < 40

    def is_bg(p) -> bool:
        r, g, b, a = p
        if a < 12:
            return True
        if use_luma:
            return max(r, g, b) <= thr
        return sum(abs(x - y) for x, y in zip((r, g, b), corner[:3])) <= thr

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


def save_webp(img: Image.Image, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, quality=90, method=6)
    print(f'  -> {dest.name} {img.size} opaque={(np.asarray(img)[..., 3] > 20).sum()}')


def save_png(img: Image.Image, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, optimize=True)
    print(f'  -> {dest.name} {img.size}')


def from_charter(rel: str, thr: int = 24) -> Image.Image:
    return key_edge(Image.open(CHARTE / rel), thr=thr)


def main() -> None:
    jobs_webp = [
        # Fe3il.a partners
        ('fe3il.a/main logo/cilg.webp', 'org-cilg.webp', 20),
        ('fe3il.a/main logo/vng.webp', 'org-vng-international.webp', 20),
        ('fe3il.a/main logo/mia.webp', 'org-nl-mfa.webp', 28),
        ('fe3il.a/main logo/ministere.webp', 'org-jeunesse-sports.webp', 20),
        ('fe3il.a/main logo/eu4youth.webp', 'org-eu4youth-lockup.webp', 20),
        # Irada partners (Asset 13 = ODS seal)
        ('irada4youth/main logo/Asset 13.webp', 'org-ods.webp', 20),
        ('irada4youth/main logo/odco.webp', 'org-odco.webp', 20),
        ('irada4youth/main logo/odno.webp', 'org-odno.webp', 20),
        ('irada4youth/main logo/cgdr.webp', 'org-cgdr.webp', 20),
        # Jeun'ESS partners
        ('jeun_ess/main logo/Asset 3.webp', 'org-oit-lockup.webp', 20),
        ('jeun_ess/main logo/Asset 2.webp', 'org-oit-coop-ess.webp', 20),
        # Maghroum'IN partners (correct charter mapping)
        ('maghroumin/Asset 26.webp', 'org-cooperacion-espana-block.webp', 28),
        ('maghroumin/Asset 25.webp', 'org-british-council-lockup.webp', 20),
        ('maghroumin/Asset 24.webp', 'org-eunic.webp', 20),
        ('maghroumin/Asset 23.webp', 'org-fiiapp-lockup.webp', 24),
        ('maghroumin/Asset 23.webp', 'org-aecid.webp', 24),
        ('maghroumin/eu4youth.webp', 'logo-eu4youth-from-magh.webp', 20),  # temp unused
    ]

    print('=== partner / org marks ===')
    for src, dest, thr in jobs_webp:
        if dest == 'logo-eu4youth-from-magh.webp':
            continue
        img = from_charter(src, thr=thr)
        save_webp(img, IMG / dest)

    print('=== project colour lockups ===')
    save_png(from_charter('eu4youth/main logo/eu4youth.webp', 20), IMG / 'logo-eu4youth.png')
    # Also keep a webp copy for modern browsers if referenced later
    save_webp(from_charter('eu4youth/main logo/eu4youth.webp', 20), IMG / 'logo-eu4youth.webp')

    # Fe3ila keeps navy panels — copy as-is
    fe = Image.open(CHARTE / 'fe3il.a' / 'main logo' / 'fe3ila.webp').convert('RGBA')
    save_png(fe, IMG / 'logo-fe3ila.png')

    save_png(from_charter('go4youth/main logo/Asset 1q.webp', 18), IMG / 'logo-go4youth.png')
    save_png(from_charter('irada4youth/main logo/irada.webp', 18), IMG / 'logo-irada4youth.png')
    save_png(from_charter('maghroumin/magroumin.webp', 18), IMG / 'logo-maghroumin.png')
    save_png(from_charter('jeun_ess/main logo/Asset 9.webp', 18), IMG / 'logo-jeuness.png')
    save_webp(from_charter('jeun_ess/main logo/Asset 9.webp', 18), IMG / 'logo-jeuness.webp')

    # Jeun'ESS composantes (already synced earlier — refresh)
    print('=== jeuness composantes ===')
    for src, dest in [
        ('jeun_ess/les composants/Asset 4.webp', 'composante-community.webp'),
        ('jeun_ess/les composants/Asset 8.webp', 'composante-limitless-club.webp'),
        ('jeun_ess/les composants/Asset 7.webp', 'composante-social-innovation.webp'),
        ('jeun_ess/les composants/Asset 6.webp', 'composante-refund.webp'),
        ('jeun_ess/les composants/Asset 5.webp', 'composante-market.webp'),
    ]:
        save_webp(from_charter(src, 18), IMG / dest)
    gen = key_edge(Image.open(CHARTE / 'jeun_ess' / 'les composants' / 'Asset 9.png'), thr=18)
    save_webp(gen, IMG / 'composante-limitless-generation.webp')

    print('done sync')


if __name__ == '__main__':
    main()
