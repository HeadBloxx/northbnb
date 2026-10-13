"""River Union listing photos: .raw-img/river-union/N.jpg -> responsive WebP in public/assets/img/."""
import os
from PIL import Image, ImageOps
SRC, OUT = ".raw-img/river-union", "public/assets/img"
PICK = {1: "living", 2: "bedroom", 6: "lounge", 4: "kitchen", 5: "stairs", 8: "bathroom"}
for n, name in PICK.items():
    im = ImageOps.exif_transpose(Image.open(f"{SRC}/{n}.jpg")).convert("RGB")
    for w in (480, 900):
        h = round(w * im.height / im.width)
        p = f"{OUT}/river-union-{name}-{w}.webp"
        im.resize((w, h), Image.LANCZOS).save(p, "WEBP", quality=76, method=6)
        print(p, w, h, round(os.path.getsize(p) / 1024), "KB")
