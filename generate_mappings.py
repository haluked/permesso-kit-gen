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

p1_boxes = get_page_boxes(0)
p2_boxes = get_page_boxes(1)

# Map Page 1
p1_fields = {
    "sigla_questura": [
        {"x": 177.12, "y": 67.84, "w": 14.16, "h": 19.92},
        {"x": 194.40, "y": 67.84, "w": 14.16, "h": 19.92}
    ],
    "cognome": sorted([b for b in p1_boxes if 215 < b["y"] < 255], key=lambda b: (round(b["y"]/10)*10, b["x"])),
    "nome": sorted([b for b in p1_boxes if 275 < b["y"] < 315], key=lambda b: (round(b["y"]/10)*10, b["x"])),
    "provincia_domicilio": sorted([b for b in p1_boxes if 320 < b["y"] < 335], key=lambda b: b["x"]),
    "comune_domicilio": sorted([b for b in p1_boxes if 360 < b["y"] < 375], key=lambda b: b["x"]),
    
    # Checkboxes
    "chk_rilascio": [b for b in p1_boxes if 410 < b["y"] < 425 and b["x"] < 250][:1],
    "chk_rinnovo": [b for b in p1_boxes if 430 < b["y"] < 445 and b["x"] < 250][:1],
    "chk_aggiornamento": [b for b in p1_boxes if 455 < b["y"] < 470 and b["x"] < 250][:1],
    "chk_duplicato": [b for b in p1_boxes if 480 < b["y"] < 495 and b["x"] < 250][:1],
    "chk_conversione": [b for b in p1_boxes if 505 < b["y"] < 520 and b["x"] < 250][:1],
    
    "chk_permesso": [b for b in p1_boxes if 410 < b["y"] < 425 and b["x"] > 500][:1],
    "chk_carta": [b for b in p1_boxes if 430 < b["y"] < 445 and b["x"] > 500][:1],
    "codice_tipologia_richiesta": sorted([b for b in p1_boxes if 480 < b["y"] < 495 and b["x"] > 500], key=lambda b: b["x"]),
    "chk_aggiornamento_foto": [b for b in p1_boxes if 505 < b["y"] < 520 and b["x"] > 500][:1],
    
    "num_permesso_in_possesso": sorted([b for b in p1_boxes if 540 < b["y"] < 555], key=lambda b: b["x"]),
    "codice_in_possesso": sorted([b for b in p1_boxes if 568 < b["y"] < 580], key=lambda b: b["x"]),
    "scadenza_permesso": sorted([b for b in p1_boxes if 590 < b["y"] < 605], key=lambda b: b["x"]),
    
    # Sezione 2
    "moduli_compilati": sorted([b for b in p1_boxes if 655 < b["y"] < 670 and b["x"] < 300], key=lambda b: b["x"]),
    "chk_modulo_1": [b for b in p1_boxes if 655 < b["y"] < 670 and 370 < b["x"] < 400][:1],
    "modulo_2_boxes": sorted([b for b in p1_boxes if 655 < b["y"] < 670 and b["x"] > 500], key=lambda b: b["x"]),
    "numero_totale_fogli": sorted([b for b in p1_boxes if 680 < b["y"] < 695 and b["x"] < 300], key=lambda b: b["x"]),
    "figli_a_carico": sorted([b for b in p1_boxes if 680 < b["y"] < 695 and b["x"] > 500], key=lambda b: b["x"]),
    "data_presentazione": sorted([b for b in p1_boxes if 750 < b["y"] < 770], key=lambda b: b["x"])
}

# Map Page 2
r18 = [b for b in p2_boxes if 748 < b["y"] < 760]
p2_fields = {
    "codice_fiscale": sorted([b for b in p2_boxes if 168 < b["y"] < 180], key=lambda b: b["x"]),
    "stato_civile": [b for b in p2_boxes if 192 < b["y"] < 205 and b["x"] < 150][:1],
    "sesso": [b for b in p2_boxes if 192 < b["y"] < 205 and 220 < b["x"] < 260][:1],
    "data_nascita": sorted([b for b in p2_boxes if 192 < b["y"] < 205 and b["x"] > 350], key=lambda b: b["x"]),
    "cod_stato_nascita": sorted([b for b in p2_boxes if 228 < b["y"] < 240 and 150 < b["x"] < 230], key=lambda b: b["x"]),
    "cod_stato_cittadinanza": sorted([b for b in p2_boxes if 228 < b["y"] < 240 and 350 < b["x"] < 430], key=lambda b: b["x"]),
    "chk_rifugiato_si": [b for b in p2_boxes if 228 < b["y"] < 240 and 490 < b["x"] < 525][:1],
    "chk_rifugiato_no": [b for b in p2_boxes if 228 < b["y"] < 240 and b["x"] > 525][:1],
    "citta_nascita": sorted([b for b in p2_boxes if 252 < b["y"] < 290], key=lambda b: (round(b["y"]/10)*10, b["x"])),
    
    "chk_passaporto": [b for b in p2_boxes if 352 < b["y"] < 365 and b["x"] < 150][:1],
    "chk_altro_doc": [b for b in p2_boxes if 352 < b["y"] < 365 and 280 < b["x"] < 320][:1],
    "specifica_altro_doc": sorted([b for b in p2_boxes if 352 < b["y"] < 365 and b["x"] > 500], key=lambda b: b["x"]),
    "altro_doc_desc": sorted([b for b in p2_boxes if 378 < b["y"] < 390], key=lambda b: b["x"]),
    "num_passaporto": sorted([b for b in p2_boxes if 400 < b["y"] < 415], key=lambda b: b["x"]),
    "pass_valido_al": sorted([b for b in p2_boxes if 425 < b["y"] < 438], key=lambda b: b["x"]),
    "rilasciato_da": sorted([b for b in p2_boxes if 460 < b["y"] < 475], key=lambda b: b["x"]),
    
    "data_ingresso": sorted([b for b in p2_boxes if 545 < b["y"] < 558], key=lambda b: b["x"]),
    "frontiera": sorted([b for b in p2_boxes if 580 < b["y"] < 595], key=lambda b: b["x"]),
    "num_visto": sorted([b for b in p2_boxes if 605 < b["y"] < 618 and b["x"] < 350], key=lambda b: b["x"]),
    "tipo_visto": [b for b in p2_boxes if 605 < b["y"] < 618 and b["x"] > 380][:1],
    "chk_ingresso_singolo": [b for b in p2_boxes if 628 < b["y"] < 640 and b["x"] < 250][:1],
    "chk_ingresso_multiplo": [b for b in p2_boxes if 628 < b["y"] < 640 and b["x"] > 350][:1],
    "motivo_visto": sorted([b for b in p2_boxes if 675 < b["y"] < 715], key=lambda b: (round(b["y"]/10)*10, b["x"])),
    "durata_visto": sorted([b for b in p2_boxes if 725 < b["y"] < 738], key=lambda b: b["x"]),
    "visto_valido_dal": sorted([b for b in r18 if b["x"] < 350], key=lambda b: b["x"]),
    "visto_valido_al": sorted([b for b in r18 if b["x"] > 350], key=lambda b: b["x"])
}

field_mappings = {
    "page_1": p1_fields,
    "page_2": p2_fields
}

with open("field_mappings.json", "w", encoding="utf-8") as f:
    json.dump(field_mappings, f, indent=2)

print(f"Page 2 visto_valido_al count: {len(p2_fields['visto_valido_al'])}")
