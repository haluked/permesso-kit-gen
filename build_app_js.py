import json

with open("field_mappings.json", "r", encoding="utf-8") as f:
    mappings = json.load(f)

js_content = f"""/**
 * İtalyan Oturum İzni (Mod. 209 - Modulo 1) Akıllı Form Asistanı
 */

const FIELD_MAPPINGS = {json.dumps(mappings, indent=2)};

// İtalyan İlleri (Sigle Province)
const PROVINCES = [
  {{ code: "MI", name: "Milano" }},
  {{ code: "RM", name: "Roma" }},
  {{ code: "TO", name: "Torino" }},
  {{ code: "TN", name: "Trento" }},
  {{ code: "BO", name: "Bologna" }},
  {{ code: "FI", name: "Firenze" }},
  {{ code: "NA", name: "Napoli" }},
  {{ code: "PD", name: "Padova" }},
  {{ code: "VE", name: "Venezia" }},
  {{ code: "GE", name: "Genova" }},
  {{ code: "VR", name: "Verona" }},
  {{ code: "BS", name: "Brescia" }},
  {{ code: "BG", name: "Bergamo" }},
  {{ code: "PR", name: "Parma" }},
  {{ code: "MO", name: "Modena" }},
  {{ code: "PI", name: "Pisa" }},
  {{ code: "SI", name: "Siena" }},
  {{ code: "TS", name: "Trieste" }},
  {{ code: "UD", name: "Udine" }},
  {{ code: "BA", name: "Bari" }},
  {{ code: "CT", name: "Catania" }},
  {{ code: "PA", name: "Palermo" }},
  {{ code: "AN", name: "Ancona" }},
  {{ code: "PG", name: "Perugia" }}
];

// Ülke Kodları (Tabella 3 - Codici Stato)
const COUNTRIES = [
  {{ code: "TUR", name: "Türkiye (Turchia)" }},
  {{ code: "ITA", name: "İtalya (Italia)" }},
  {{ code: "AZE", name: "Azerbaycan (Azerbaigian)" }},
  {{ code: "DEU", name: "Almanya (Germania)" }},
  {{ code: "FRA", name: "Fransa (Francia)" }},
  {{ code: "GBR", name: "Birleşik Krallık (Regno Unito)" }},
  {{ code: "USA", name: "Amerika Birleşik Devletleri (USA)" }},
  {{ code: "IRN", name: "İran" }},
  {{ code: "RUS", name: "Rusya (Russia)" }},
  {{ code: "UKR", name: "Ukrayna (Ucraina)" }},
  {{ code: "KAZ", name: "Kazakistan" }},
  {{ code: "UZB", name: "Özbekistan" }},
  {{ code: "TKM", name: "Türkmenistan" }},
  {{ code: "KGZ", name: "Kırgızistan" }},
  {{ code: "MAR", name: "Fas (Marocco)" }},
  {{ code: "TUN", name: "Tunus (Tunisia)" }},
  {{ code: "DZA", name: "Cezayir (Algeria)" }},
  {{ code: "EGY", name: "Mısır (Egitto)" }},
  {{ code: "CHN", name: "Çin (Cina)" }},
  {{ code: "IND", name: "Hindistan (India)" }},
  {{ code: "PAK", name: "Pakistan" }}
];

let currentPage = 1;
let currentZoom = 1.0;
let activeField = null;

// DOM Yüklendiğinde başlat
document.addEventListener("DOMContentLoaded", () => {{
  populateDropdowns();
  setupTabs();
  setupZoom();
  setupPageSelector();
  setupInputListeners();
  setupDateMasks();
  renderOverlay();

  document.getElementById("btn-demo").addEventListener("click", loadDemoData);
  document.getElementById("btn-clear").addEventListener("click", clearForm);
  document.getElementById("btn-download").addEventListener("click", downloadOfficialPdf);
}});

// Dropdownları doldur
function populateDropdowns() {{
  document.querySelectorAll(".select-prov").forEach(sel => {{
    PROVINCES.forEach(p => {{
      const opt = document.createElement("option");
      opt.value = p.code;
      opt.textContent = `${{p.code}} - ${{p.name}}`;
      sel.appendChild(opt);
    }});
  }});

  document.querySelectorAll(".select-country").forEach(sel => {{
    COUNTRIES.forEach(c => {{
      const opt = document.createElement("option");
      opt.value = c.code;
      opt.textContent = `${{c.code}} - ${{c.name}}`;
      sel.appendChild(opt);
    }});
  }});
}}

// Tablar
function setupTabs() {{
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {{
    btn.addEventListener("click", () => {{
      tabBtns.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add("active");

      // Sayfa otomatik geçişi
      if (["tab-s3", "tab-s4", "tab-s5"].includes(btn.dataset.tab)) {{
        switchPage(2);
      }} else {{
        switchPage(1);
      }}
    }});
  }});
}}

// Sayfa Değiştirici
function setupPageSelector() {{
  document.querySelectorAll(".page-pill").forEach(pill => {{
    pill.addEventListener("click", () => {{
      const page = parseInt(pill.dataset.page);
      switchPage(page);
    }});
  }});
}}

function switchPage(pageNum) {{
  currentPage = pageNum;
  document.querySelectorAll(".page-pill").forEach(p => {{
    p.classList.toggle("active", parseInt(p.dataset.page) === pageNum);
  }});
  const bgImg = document.getElementById("page-background");
  bgImg.src = `assets/pages/page_${{pageNum}}.svg`;
  renderOverlay();
}}

// Zoom Kontrolleri
function setupZoom() {{
  const container = document.getElementById("document-container");
  const zoomText = document.getElementById("zoom-level");

  const updateZoom = (z) => {{
    currentZoom = Math.max(0.6, Math.min(1.8, z));
    container.style.transform = `scale(${{currentZoom}})`;
    zoomText.textContent = `${{Math.round(currentZoom * 100)}}%`;
  }};

  document.getElementById("btn-zoom-in").addEventListener("click", () => updateZoom(currentZoom + 0.15));
  document.getElementById("btn-zoom-out").addEventListener("click", () => updateZoom(currentZoom - 0.15));
  document.getElementById("btn-zoom-reset").addEventListener("click", () => updateZoom(1.0));
}}

// Tarih Maskeleme (GG/AA/YYYY)
function setupDateMasks() {{
  document.querySelectorAll(".date-mask").forEach(inp => {{
    inp.addEventListener("input", (e) => {{
      let v = e.target.value.replace(/\\D/g, "").slice(0, 8);
      if (v.length >= 5) {{
        v = `${{v.slice(0, 2)}}/${{v.slice(2, 4)}}/${{v.slice(4)}}`;
      }} else if (v.length >= 3) {{
        v = `${{v.slice(0, 2)}}/${{v.slice(2)}}`;
      }}
      e.target.value = v;
      renderOverlay();
    }});
  }});
}}

// Türkçe Karakterleri ve Boşlukları Temizleme
function sanitizeItalianText(str) {{
  if (!str) return "";
  const map = {{
    "ç": "C", "Ç": "C", "ğ": "G", "Ğ": "G", "ı": "I", "İ": "I",
    "ö": "O", "Ö": "O", "ş": "S", "Ş": "S", "ü": "U", "Ü": "U"
  }};
  return str.replace(/[çÇğĞıİöÖşŞüÜ]/g, m => map[m] || m).toUpperCase();
}}

// Form Değerlerini Çıkarma
function getFormValues() {{
  const g = id => (document.getElementById(id) ? document.getElementById(id).value.trim() : "");
  
  return {{
    // Sayfa 1
    sigla_questura: g("inp_sigla_questura"),
    cognome: sanitizeItalianText(g("inp_cognome")),
    nome: sanitizeItalianText(g("inp_nome")),
    provincia_domicilio: g("inp_provincia_domicilio"),
    comune_domicilio: sanitizeItalianText(g("inp_comune_domicilio")),
    tipo_richiesta: g("inp_tipo_richiesta"),
    del_della: g("inp_del_della"),
    codice_tipologia: g("inp_codice_tipologia"),
    num_permesso_possesso: sanitizeItalianText(g("inp_num_permesso_possesso")),
    scadenza_permesso: g("inp_scadenza_permesso").replace(/\\//g, ""),
    moduli_compilati: g("inp_moduli_compilati"),
    totale_fogli: g("inp_totale_fogli").padStart(2, "0"),
    figli_carico: g("inp_figli_carico").padStart(2, "0"),
    data_presentazione: g("inp_data_presentazione").replace(/\\//g, ""),

    // Sayfa 2
    codice_fiscale: sanitizeItalianText(g("inp_codice_fiscale")),
    stato_civile: g("inp_stato_civile"), // 'A' veya 'B'
    sesso: g("inp_sesso"), // 'M' veya 'F'
    data_nascita: g("inp_data_nascita").replace(/\\//g, ""),
    stato_nascita: g("inp_stato_nascita"), // 'TUR'
    stato_cittadinanza: g("inp_stato_cittadinanza"), // 'TUR'
    rifugiato: g("inp_rifugiato"),
    citta_nascita: sanitizeItalianText(g("inp_citta_nascita")),
    tipo_documento: g("inp_tipo_documento"),
    num_passaporto: sanitizeItalianText(g("inp_num_passaporto")),
    pass_scadenza: g("inp_pass_scadenza").replace(/\\//g, ""),
    rilasciato_da: g("inp_rilasciato_da"), // '01'
    data_ingresso: g("inp_data_ingresso").replace(/\\//g, ""),
    frontiera: sanitizeItalianText(g("inp_frontiera")),
    num_visto: sanitizeItalianText(g("inp_num_visto")),
    tipo_visto: sanitizeItalianText(g("inp_tipo_visto")),
    tipo_ingresso: g("inp_tipo_ingresso"),
    motivo_visto: sanitizeItalianText(g("inp_motivo_visto")),
    durata_visto: g("inp_durata_visto"),
    visto_valido_dal: g("inp_visto_valido_dal").replace(/\\//g, ""),
    visto_valido_al: g("inp_visto_valido_al").replace(/\\//g, "")
  }};
}}

// İnput Dinleyicileri
function setupInputListeners() {{
  document.querySelectorAll(".form-control").forEach(el => {{
    el.addEventListener("input", renderOverlay);
    el.addEventListener("change", renderOverlay);

    el.addEventListener("focus", () => {{
      activeField = el.id.replace("inp_", "");
      highlightActiveBoxes();
    }});

    el.addEventListener("blur", () => {{
      activeField = null;
      highlightActiveBoxes();
    }});
  }});
}}

function highlightActiveBoxes() {{
  document.querySelectorAll(".char-cell").forEach(cell => {{
    cell.classList.toggle("active-field", cell.dataset.field === activeField);
  }});
}}

// Canlı Önizleme Katmanını Çiz
function renderOverlay() {{
  const overlay = document.getElementById("overlay-layer");
  overlay.innerHTML = "";

  const data = getFormValues();
  const pageKey = `page_${{currentPage}}`;
  const pageFields = FIELD_MAPPINGS[pageKey];

  if (!pageFields) return;

  const PDF_WIDTH = 595.22;
  const PDF_HEIGHT = 842.0;

  const placeBoxes = (fieldKey, text, isCheckbox = false) => {{
    const boxes = pageFields[fieldKey];
    if (!boxes) return;

    boxes.forEach((b, idx) => {{
      const cell = document.createElement("div");
      cell.className = "char-cell" + (isCheckbox ? " checkbox-cell" : "");
      cell.dataset.field = fieldKey;

      cell.style.left = `${{(b.x / PDF_WIDTH) * 100}}%`;
      cell.style.top = `${{(b.y / PDF_HEIGHT) * 100}}%`;
      cell.style.width = `${{(b.w / PDF_WIDTH) * 100}}%`;
      cell.style.height = `${{(b.h / PDF_HEIGHT) * 100}}%`;

      if (isCheckbox) {{
        cell.textContent = text ? "X" : "";
      }} else {{
        cell.textContent = (text && text[idx]) ? text[idx] : "";
      }}

      cell.addEventListener("click", () => {{
        const inp = document.getElementById(`inp_${{fieldKey}}`) || 
                    document.getElementById(`inp_${{fieldKey.replace('chk_', '')}}`);
        if (inp) {{
          inp.focus();
          inp.scrollIntoView({{ behavior: "smooth", block: "center" }});
        }}
      }});

      overlay.appendChild(cell);
    }});
  }};

  if (currentPage === 1) {{
    placeBoxes("sigla_questura", data.sigla_questura);
    placeBoxes("cognome", data.cognome);
    placeBoxes("nome", data.nome);
    placeBoxes("provincia_domicilio", data.provincia_domicilio);
    placeBoxes("comune_domicilio", data.comune_domicilio);

    // Başvuru Türü Checkbox
    placeBoxes("chk_rilascio", data.tipo_richiesta === "rilascio", true);
    placeBoxes("chk_rinnovo", data.tipo_richiesta === "rinnovo", true);
    placeBoxes("chk_aggiornamento", data.tipo_richiesta === "aggiornamento", true);
    placeBoxes("chk_duplicato", data.tipo_richiesta === "duplicato", true);
    placeBoxes("chk_conversione", data.tipo_richiesta === "conversione", true);

    // Belge Türü Checkbox
    placeBoxes("chk_permesso", data.del_della === "permesso", true);
    placeBoxes("chk_carta", data.del_della === "carta", true);
    placeBoxes("chk_aggiornamento_foto", data.del_della === "foto", true);

    // İzin Türü Kodu (24, 16, vb.)
    placeBoxes("codice_tipologia_richiesta", data.codice_tipologia);

    // Yenileme Bilgileri
    placeBoxes("num_permesso_in_possesso", data.num_permesso_possesso);
    placeBoxes("scadenza_permesso", data.scadenza_permesso);

    // Sezione 2
    placeBoxes("chk_modulo_1", true, true);
    placeBoxes("moduli_compilati", data.moduli_compilati.padStart(2, "0"));
    placeBoxes("numero_totale_fogli", data.totale_fogli);
    placeBoxes("figli_a_carico", data.figli_carico);
    placeBoxes("data_presentazione", data.data_presentazione);
  }} else if (currentPage === 2) {{
    placeBoxes("codice_fiscale", data.codice_fiscale);
    placeBoxes("stato_civile", data.stato_civile); // A veya B
    placeBoxes("sesso", data.sesso); // M veya F
    placeBoxes("data_nascita", data.data_nascita);
    placeBoxes("cod_stato_nascita", data.stato_nascita);
    placeBoxes("cod_stato_cittadinanza", data.stato_cittadinanza);
    placeBoxes("chk_rifugiato_no", data.rifugiato === "NO", true);
    placeBoxes("chk_rifugiato_si", data.rifugiato === "SI", true);
    placeBoxes("citta_nascita", data.citta_nascita);

    placeBoxes("chk_passaporto", data.tipo_documento === "passaporto", true);
    placeBoxes("chk_altro_doc", data.tipo_documento === "altro", true);
    placeBoxes("num_passaporto", data.num_passaporto);
    placeBoxes("pass_valido_al", data.pass_scadenza);
    placeBoxes("rilasciato_da", data.rilasciato_da);

    placeBoxes("data_ingresso", data.data_ingresso);
    placeBoxes("frontiera", data.frontiera);
    placeBoxes("num_visto", data.num_visto);
    placeBoxes("tipo_visto", data.tipo_visto);
    placeBoxes("chk_ingresso_singolo", data.tipo_ingresso === "singolo", true);
    placeBoxes("chk_ingresso_multiplo", data.tipo_ingresso === "multiplo", true);
    placeBoxes("motivo_visto", data.motivo_visto);
    placeBoxes("durata_visto", data.durata_visto.padStart(3, "0"));
    placeBoxes("visto_valido_dal", data.visto_valido_dal);
    placeBoxes("visto_valido_al", data.visto_valido_al);
  }}

  highlightActiveBoxes();
}}

// Örnek Veri Doldurma
function loadDemoData() {{
  const s = (id, val) => {{
    const el = document.getElementById(id);
    if (el) el.value = val;
  }};

  // Sayfa 1 Demo
  s("inp_sigla_questura", "MI");
  s("inp_cognome", "YILMAZ");
  s("inp_nome", "AHMET");
  s("inp_provincia_domicilio", "MI");
  s("inp_comune_domicilio", "MILANO");
  s("inp_tipo_richiesta", "rilascio");
  s("inp_del_della", "permesso");
  s("inp_codice_tipologia", "24");
  s("inp_moduli_compilati", "1");
  s("inp_totale_fogli", "16");
  s("inp_figli_carico", "0");
  s("inp_data_presentazione", "15/10/2026");

  // Sayfa 2 Demo
  s("inp_codice_fiscale", "YLMHMT01E15Z104A");
  s("inp_stato_civile", "A");
  s("inp_sesso", "M");
  s("inp_data_nascita", "15/05/2001");
  s("inp_stato_nascita", "TUR");
  s("inp_stato_cittadinanza", "TUR");
  s("inp_rifugiato", "NO");
  s("inp_citta_nascita", "ANKARA");
  s("inp_tipo_documento", "passaporto");
  s("inp_num_passaporto", "U12345678");
  s("inp_pass_scadenza", "20/08/2032");
  s("inp_rilasciato_da", "01");
  s("inp_data_ingresso", "01/10/2026");
  s("inp_frontiera", "MILANO MALPENSA");
  s("inp_num_visto", "1234567");
  s("inp_tipo_visto", "D");
  s("inp_tipo_ingresso", "multiplo");
  s("inp_motivo_visto", "STUDIO");
  s("inp_durata_visto", "365");
  s("inp_visto_valido_dal", "01/09/2026");
  s("inp_visto_valido_al", "31/08/2027");

  renderOverlay();
}}

// Formu Temizleme
function clearForm() {{
  document.querySelectorAll(".form-control").forEach(inp => {{
    if (inp.tagName === "SELECT") {{
      inp.selectedIndex = 0;
    }} else {{
      inp.value = "";
    }}
  }});
  document.getElementById("inp_tipo_visto").value = "D";
  document.getElementById("inp_motivo_visto").value = "STUDIO";
  document.getElementById("inp_totale_fogli").value = "16";
  document.getElementById("inp_figli_carico").value = "0";
  renderOverlay();
}}

// Resmi PDF Çıktısı Üretme (pdf-lib)
async function downloadOfficialPdf() {{
  const btn = document.getElementById("btn-download");
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span>PDF Hazırlanıyor...</span>`;

  try {{
    let pdfBytes = null;
    try {{
      if (window.location.protocol !== 'file:') {{
        const res = await fetch("clean_official_modulo1.pdf");
        if (res.ok) {{
          pdfBytes = await res.arrayBuffer();
        }}
      }}
    }} catch (e) {{
      console.warn("Fetch failed, falling back to embedded template:", e);
    }}

    if (!pdfBytes && window.EMBEDDED_PDF_BASE64) {{
      const binaryString = atob(window.EMBEDDED_PDF_BASE64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {{
        bytes[i] = binaryString.charCodeAt(i);
      }}
      pdfBytes = bytes.buffer;
    }}

    if (!pdfBytes) {{
      throw new Error("Şablon PDF dosyası yüklenemedi!");
    }}

    const {{ PDFDocument, rgb, StandardFonts }} = PDFLib;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const data = getFormValues();

    const writeBoxes = (page, boxes, text, isCheckbox = false) => {{
      if (!boxes || !boxes.length || !text) return;
      
      boxes.forEach((b, i) => {{
        const char = isCheckbox ? (text ? "X" : "") : (text[i] || "");
        if (!char) return;

        const fontSize = isCheckbox ? 11 : 10;
        const charWidth = font.widthOfTextAtSize(char, fontSize);
        
        // Kutucuğun tam merkezine yerleştir (X, Y PDF koordinat düzlemi)
        const pdfX = b.x + (b.w - charWidth) / 2;
        const pdfY = 842.0 - b.y - b.h + (b.h - fontSize) / 2 + 1.2;

        page.drawText(char, {{
          x: pdfX,
          y: pdfY,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0) // SCRIVERE CON PENNA NERA
        }});
      }});
    }};

    const pages = pdfDoc.getPages();
    const p1 = pages[0];
    const p2 = pages[1];
    const p1F = FIELD_MAPPINGS.page_1;
    const p2F = FIELD_MAPPINGS.page_2;

    // Sayfa 1 Verilerini Yaz
    writeBoxes(p1, p1F.sigla_questura, data.sigla_questura);
    writeBoxes(p1, p1F.cognome, data.cognome);
    writeBoxes(p1, p1F.nome, data.nome);
    writeBoxes(p1, p1F.provincia_domicilio, data.provincia_domicilio);
    writeBoxes(p1, p1F.comune_domicilio, data.comune_domicilio);

    writeBoxes(p1, p1F.chk_rilascio, data.tipo_richiesta === "rilascio", true);
    writeBoxes(p1, p1F.chk_rinnovo, data.tipo_richiesta === "rinnovo", true);
    writeBoxes(p1, p1F.chk_aggiornamento, data.tipo_richiesta === "aggiornamento", true);
    writeBoxes(p1, p1F.chk_duplicato, data.tipo_richiesta === "duplicato", true);
    writeBoxes(p1, p1F.chk_conversione, data.tipo_richiesta === "conversione", true);

    writeBoxes(p1, p1F.chk_permesso, data.del_della === "permesso", true);
    writeBoxes(p1, p1F.chk_carta, data.del_della === "carta", true);
    writeBoxes(p1, p1F.chk_aggiornamento_foto, data.del_della === "foto", true);

    writeBoxes(p1, p1F.codice_tipologia_richiesta, data.codice_tipologia);
    writeBoxes(p1, p1F.num_permesso_in_possesso, data.num_permesso_possesso);
    writeBoxes(p1, p1F.scadenza_permesso, data.scadenza_permesso);

    writeBoxes(p1, p1F.chk_modulo_1, true, true);
    writeBoxes(p1, p1F.moduli_compilati, data.moduli_compilati.padStart(2, "0"));
    writeBoxes(p1, p1F.numero_totale_fogli, data.totale_fogli);
    writeBoxes(p1, p1F.figli_a_carico, data.figli_carico);
    writeBoxes(p1, p1F.data_presentazione, data.data_presentazione);

    // Sayfa 2 Verilerini Yaz
    writeBoxes(p2, p2F.codice_fiscale, data.codice_fiscale);
    writeBoxes(p2, p2F.stato_civile, data.stato_civile);
    writeBoxes(p2, p2F.sesso, data.sesso);
    writeBoxes(p2, p2F.data_nascita, data.data_nascita);
    writeBoxes(p2, p2F.cod_stato_nascita, data.stato_nascita);
    writeBoxes(p2, p2F.cod_stato_cittadinanza, data.stato_cittadinanza);
    writeBoxes(p2, p2F.chk_rifugiato_no, data.rifugiato === "NO", true);
    writeBoxes(p2, p2F.chk_rifugiato_si, data.rifugiato === "SI", true);
    writeBoxes(p2, p2F.citta_nascita, data.citta_nascita);

    writeBoxes(p2, p2F.chk_passaporto, data.tipo_documento === "passaporto", true);
    writeBoxes(p2, p2F.chk_altro_doc, data.tipo_documento === "altro", true);
    writeBoxes(p2, p2F.num_passaporto, data.num_passaporto);
    writeBoxes(p2, p2F.pass_valido_al, data.pass_scadenza);
    writeBoxes(p2, p2F.rilasciato_da, data.rilasciato_da);

    writeBoxes(p2, p2F.data_ingresso, data.data_ingresso);
    writeBoxes(p2, p2F.frontiera, data.frontiera);
    writeBoxes(p2, p2F.num_visto, data.num_visto);
    writeBoxes(p2, p2F.tipo_visto, data.tipo_visto);
    writeBoxes(p2, p2F.chk_ingresso_singolo, data.tipo_ingresso === "singolo", true);
    writeBoxes(p2, p2F.chk_ingresso_multiplo, data.tipo_ingresso === "multiplo", true);
    writeBoxes(p2, p2F.motivo_visto, data.motivo_visto);
    writeBoxes(p2, p2F.durata_visto, data.durata_visto.padStart(3, "0"));
    writeBoxes(p2, p2F.visto_valido_dal, data.visto_valido_dal);
    writeBoxes(p2, p2F.visto_valido_al, data.visto_valido_al);

    // Dışa aktar ve tarayıcıda indirt
    const outBytes = await pdfDoc.save();
    const blob = new Blob([outBytes], {{ type: "application/pdf" }});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Modulo_209_Modulo_1_${{data.cognome || "Doldurulmus"}}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }} catch (err) {{
    alert("PDF oluşturulurken hata oluştu: " + err.message);
    console.error(err);
  }} finally {{
    btn.disabled = false;
    btn.innerHTML = originalText;
  }}
}}
"""

with open("app.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Updated app.js successfully with fallback loading!")
