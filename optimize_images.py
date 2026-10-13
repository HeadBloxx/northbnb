"""Asset image pipeline: resize + re-encode brand photos to responsive WebP.
Reads originals from .raw-img/, writes optimized assets to public/assets/img/.
Run from project root:  python optimize_images.py
"""
import os
from PIL import Image, ImageOps

SRC = ".raw-img"
OUT = "public/assets/img"
os.makedirs(OUT, exist_ok=True)

# (source, out-basename, [widths], quality, also_jpg_at_width)
JOBS = [
    ("hero.jpg",              "hero-montenegro",   [480, 960, 1600, 2000], 70, 1600),
    ("montenegro.jpg",        "montenegro-coast",  [640, 1100, 1600],      74, None),
    ("about.webp",            "about-northbnb",    [560, 900],             78, None),
    ("dest-podgorica.webp",   "dest-podgorica",    [480, 760],             80, None),
    ("dest-herceg-novi.webp", "dest-herceg-novi",  [480, 760],             80, None),
    ("dest-budva.webp",       "dest-budva",        [480, 760],             80, None),
]

def load(path):
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)        # honor orientation
    if im.mode in ("RGBA", "P", "LA"):
        im = im.convert("RGB")
    elif im.mode != "RGB":
        im = im.convert("RGB")
    return im

report = []
for src, base, widths, q, jpgw in JOBS:
    p = os.path.join(SRC, src)
    if not os.path.exists(p):
        print(f"SKIP (missing): {src}")
        continue
    im = load(p)
    ow, oh = im.size
    ar = oh / ow
    for w in widths:
        if w > ow:   # never upscale
            w = ow
        h = round(w * ar)
        rz = im.resize((w, h), Image.LANCZOS)
        outp = os.path.join(OUT, f"{base}-{w}.webp")
        rz.save(outp, "WEBP", quality=q, method=6)
        kb = os.path.getsize(outp) / 1024
        report.append((f"{base}-{w}.webp", w, h, round(kb, 1)))
    if jpgw:
        w = min(jpgw, ow); h = round(w * ar)
        rz = im.resize((w, h), Image.LANCZOS)
        outp = os.path.join(OUT, f"{base}-{w}.jpg")
        rz.save(outp, "JPEG", quality=72, optimize=True, progressive=True)
        kb = os.path.getsize(outp) / 1024
        report.append((f"{base}-{w}.jpg", w, h, round(kb, 1)))
    print(f"done: {base}  (orig {ow}x{oh})")

print("\n== OUTPUT ==")
total = 0
for name, w, h, kb in report:
    total += kb
    print(f"  {name:34s} {w}x{h:<5} {kb} KB")
print(f"  total: {round(total,1)} KB across {len(report)} files")
