"""Enhance carte hero map fill + rebuild crisp full-height monogram.

Safe path: always use the clean map_banner (no baked text), 2.5x LANCZOS + mild sharpen.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "public" / "img"
ASSETS = Path(
    r"C:\Users\youss\.cursor\projects\c-Users-youss-OneDrive-Attachments-Desktop-fi2t-live-editor\assets"
)
BANNER = (
    ASSETS
    / "c__Users_youss_AppData_Roaming_Cursor_User_workspaceStorage_d13b565caeed60f0dada9c6e0e629c5e_images_map_banner_no_watermark-ee27ae30-fc0d-4fee-9fbb-8782a3030118.png"
)


def enhance_fill() -> None:
    src = BANNER if BANNER.exists() else IMG / "carte-hero-fill.png"
    im = Image.open(src).convert("RGB")
    print("map source", src.name, im.size)

    scale = 2.5
    up = im.resize(
        (int(im.width * scale), int(im.height * scale)),
        Image.Resampling.LANCZOS,
    )
    up = up.filter(ImageFilter.UnsharpMask(radius=1.25, percent=100, threshold=2))
    up = ImageEnhance.Sharpness(up).enhance(1.08)

    out = IMG / "carte-hero-fill.png"
    up.save(out, format="PNG", optimize=True)
    print("saved fill", out.name, up.size, out.stat().st_size)


def enhance_monogram() -> None:
    mono = Image.open(IMG / "eu4y-monogram.png").convert("RGBA")
    bbox = mono.split()[-1].getbbox()
    if not bbox:
        raise RuntimeError("monogram has no opaque pixels")
    cropped = mono.crop(bbox)
    pad = 2
    canvas = Image.new(
        "RGBA",
        (cropped.width + pad * 2, cropped.height + pad * 2),
        (0, 0, 0, 0),
    )
    canvas.paste(cropped, (pad, pad), cropped)

    mw = 1600
    mh = int(round(canvas.height * (mw / canvas.width)))
    hi = canvas.resize((mw, mh), Image.Resampling.LANCZOS)

    out = IMG / "eu4y-monogram.png"
    hi.save(out, format="PNG", optimize=True)
    print("saved mono", out.name, hi.size, out.stat().st_size)


if __name__ == "__main__":
    enhance_fill()
    enhance_monogram()
