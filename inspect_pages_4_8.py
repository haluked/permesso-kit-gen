import fitz
import json

doc = fitz.open("clean_official_modulo1.pdf")

def dedup(boxes):
    unique = []
    for b in boxes:
        if not any(abs(u["x"] - b["x"]) < 2 and abs(u["y"] - b["y"]) < 2 for u in unique):
            unique.append(b)
    return sorted(unique, key=lambda b: (round(b["y"]/4)*4, b["x"]))

def get_page_boxes(pno):
    p = doc[pno]
    raw = []
    for d in p.get_drawings():
        c = d.get("color")
        if c and len(c) == 3 and c[0] > 0.8 and c[1] < 0.4 and c[2] < 0.3:
            r = d["rect"]
            if r.width > 6 and r.height > 6:
                raw.append({
                    "x": round(r.x0, 2),
                    "y": round(r.y0, 2),
                    "w": round(r.width, 2),
                    "h": round(r.height, 2)
                })
    return dedup(raw)

# Let's inspect pages 4-8
for p in range(3, 8):
    boxes = get_page_boxes(p)
    print(f"Page {p+1}: {len(boxes)} unique boxes found.")
