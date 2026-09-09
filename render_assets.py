import fitz
import os

doc = fitz.open("clean_official_modulo1.pdf")
os.makedirs("assets/pages", exist_ok=True)

for i in range(len(doc)):
    page = doc[i]
    # SVG
    svg = page.get_svg_image()
    with open(f"assets/pages/page_{i+1}.svg", "w", encoding="utf-8") as f:
        f.write(svg)
    # PNG 2x scale for ultra crispness
    pix = page.get_pixmap(dpi=150)
    pix.save(f"assets/pages/page_{i+1}.png")
    print(f"Rendered Page {i+1} SVG and PNG")
