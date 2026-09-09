import fitz

doc = fitz.open(r"C:\Users\haluk\Downloads\Sample_Modulo 1_first application.temizpdf.pdf")

# We want to remove only the university guide red annotations (English notes)
# Let's inspect each red text span carefully and avoid clipping official Italian text
for pno in range(len(doc)):
    page = doc[pno]
    text_blocks = page.get_text("dict")["blocks"]
    red_rects = []
    
    for b in text_blocks:
        if "lines" in b:
            for l in b["lines"]:
                for s in l["spans"]:
                    c = s["color"]
                    r = (c >> 16) & 255
                    g = (c >> 8) & 255
                    b_c = c & 255
                    # Red English annotation text
                    if r > 150 and g < 100 and b_c < 100:
                        txt = s["text"].strip()
                        # If it's a known red note:
                        bbox = list(s["bbox"])
                        # Shrink bbox vertically so it doesn't touch adjacent black text
                        if "house number" in txt.lower():
                            # house number was touching 69. NUMERO CIVICO at y=393
                            bbox[3] = min(bbox[3], 392.0)
                        elif "italian phone" in txt.lower():
                            # was touching 75. TELEFONO CELLULARE at y=524
                            bbox[3] = min(bbox[3], 523.5)
                        elif "date of submission" in txt.lower():
                            bbox[3] = min(bbox[3], 802.0)
                        
                        rect = fitz.Rect(bbox)
                        red_rects.append(rect)
                        print(f"P{pno+1} redacting: {txt} at {bbox}")
                        
    for r in red_rects:
        page.add_redact_annot(r, fill=(1, 1, 1))
    page.apply_redactions()
    
    # Normalize cropbox and mediabox
    page.set_cropbox(fitz.Rect(0, 0, 595.0, 842.0))
    page.set_mediabox(fitz.Rect(0, 0, 595.0, 842.0))

doc.save("clean_official_modulo1.pdf")
print("Saved clean_official_modulo1.pdf successfully with all official titles intact!")
