/**
 * Öğrenciler için İtalyan Oturum İzni (Mod. 209 - Modulo 1) Akıllı Form Asistanı
 * Kesintisiz Dikey Kaydırmalı 10 Sayfa Motoru (2 Kılavuz Sayfası + 8 Sayfa Resmi Modül)
 */

const FIELD_MAPPINGS = window.FIELD_MAPPINGS || {};

// İtalyan İlleri (Sigle Province)
const PROVINCES = [
  { code: "MI", name: "Milano" },
  { code: "RM", name: "Roma" },
  { code: "TO", name: "Torino" },
  { code: "TN", name: "Trento" },
  { code: "BO", name: "Bologna" },
  { code: "FI", name: "Firenze" },
  { code: "NA", name: "Napoli" },
  { code: "PD", name: "Padova" },
  { code: "VE", name: "Venezia" },
  { code: "GE", name: "Genova" },
  { code: "VR", name: "Verona" },
  { code: "BS", name: "Brescia" },
  { code: "BG", name: "Bergamo" },
  { code: "PR", name: "Parma" },
  { code: "MO", name: "Modena" },
  { code: "PI", name: "Pisa" },
  { code: "SI", name: "Siena" },
  { code: "TS", name: "Trieste" },
  { code: "UD", name: "Udine" },
  { code: "BA", name: "Bari" },
  { code: "CT", name: "Catania" },
  { code: "PA", name: "Palermo" },
  { code: "AN", name: "Ancona" },
  { code: "PG", name: "Perugia" }
];

// Ülke Kodları (Tabella 3 - Codici Stato)
const COUNTRIES = [
  { code: "TUR", name: "Türkiye (Turchia)" },
  { code: "ITA", name: "İtalya (Italia)" },
  { code: "AZE", name: "Azerbaycan (Azerbaigian)" },
  { code: "DEU", name: "Almanya (Germania)" },
  { code: "FRA", name: "Fransa (Francia)" },
  { code: "GBR", name: "Birleşik Krallık (Regno Unito)" },
  { code: "USA", name: "Amerika Birleşik Devletleri (USA)" },
  { code: "IRN", name: "İran" },
  { code: "RUS", name: "Rusya (Russia)" },
  { code: "UKR", name: "Ukrayna (Ucraina)" },
  { code: "KAZ", name: "Kazakistan" },
  { code: "UZB", name: "Özbekistan" },
  { code: "TKM", name: "Türkmenistan" },
  { code: "KGZ", name: "Kırgızistan" },
  { code: "MAR", name: "Fas (Marocco)" },
  { code: "TUN", name: "Tunus (Tunisia)" },
  { code: "DZA", name: "Cezayir (Algeria)" },
  { code: "EGY", name: "Mısır (Egitto)" },
  { code: "CHN", name: "Çin (Cina)" },
  { code: "IND", name: "Hindistan (India)" },
  { code: "PAK", name: "Pakistan" }
];

let currentZoom = 1.0;
let activeField = null;
let currentLang = localStorage.getItem("app_lang") || "tr";

// DOM Yüklendiğinde başlat
document.addEventListener("DOMContentLoaded", () => {
  buildAllPages();
  populateDropdowns();
  setupZoom();
  setupInputListeners();
  setupDateMasks();
  setupAccordionToggle();
  setupLanguageSwitcher();
  setupWelcomeModal();
  setLanguage(currentLang);
  loadDemoData(); // Varsayılan olarak Torino ve HALUK YILMAZ ile başlar
  renderOverlay();

  document.getElementById("btn-demo").addEventListener("click", loadDemoData);
  document.getElementById("btn-clear").addEventListener("click", clearForm);
  document.getElementById("btn-download").addEventListener("click", downloadOfficialPdf);
});

// Bilgilendirme Modalı (Welcome Modal)
function setupWelcomeModal() {
  const overlay = document.getElementById("welcome-modal-overlay");
  const btnClose = document.getElementById("modal-close-btn");
  const btnCloseX = document.getElementById("modal-close-icon");
  const btnSwitch = document.getElementById("modal-switch-lang");
  const btnOpen = document.getElementById("btn-open-info");

  if (!overlay) return;

  const closeModal = () => {
    overlay.style.display = "none";
    overlay.classList.add("hidden");
  };

  const openModal = () => {
    overlay.style.display = "flex";
    overlay.classList.remove("hidden");
  };

  if (btnClose) btnClose.onclick = closeModal;
  if (btnCloseX) btnCloseX.onclick = closeModal;
  if (btnOpen) btnOpen.onclick = openModal;

  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  if (btnSwitch) {
    btnSwitch.onclick = () => {
      const nextLang = currentLang === "tr" ? "en" : "tr";
      setLanguage(nextLang);
    };
  }
}

// Dil Değiştirme Motoru (i18n)
function setLanguage(lang) {
  currentLang = lang;
  try {
    localStorage.setItem("app_lang", lang);
  } catch (e) {}

  document.documentElement.lang = lang;

  const btnTr = document.getElementById("lang-btn-tr");
  const btnEn = document.getElementById("lang-btn-en");
  if (btnTr) btnTr.classList.toggle("active", lang === "tr");
  if (btnEn) btnEn.classList.toggle("active", lang === "en");

  const btnModalLang = document.getElementById("modal-switch-lang");
  if (btnModalLang) {
    btnModalLang.textContent = lang === "tr" ? "Press for English" : "Türkçe";
  }

  const dict = window.TRANSLATIONS ? window.TRANSLATIONS[lang] : null;
  if (!dict) return;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.dataset.i18nHtml;
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.dataset.i18nTitle;
    if (dict[key] !== undefined) el.title = dict[key];
  });

  // Kılavuz ve Modül Başlıklarını Çevir
  const h1 = document.querySelector("#page-card-guide-1 .page-card-header");
  if (h1 && dict.card_header_guide_1) h1.textContent = dict.card_header_guide_1;

  const h2 = document.querySelector("#page-card-guide-2 .page-card-header");
  if (h2 && dict.card_header_guide_2) h2.textContent = dict.card_header_guide_2;

  for (let p = 1; p <= 8; p++) {
    const hp = document.querySelector(`#page-card-${p} .page-card-header`);
    if (hp && dict.card_header_modulo) {
      hp.textContent = dict.card_header_modulo.replace("{p}", p).replace("{doc}", p + 2);
    }
  }
}

function setupLanguageSwitcher() {
  const btnTr = document.getElementById("lang-btn-tr");
  const btnEn = document.getElementById("lang-btn-en");
  if (btnTr) btnTr.addEventListener("click", () => setLanguage("tr"));
  if (btnEn) btnEn.addEventListener("click", () => setLanguage("en"));
}

// 10 Sayfayı (2 Rehber + 8 Modül) Dikey Kesintisiz Olarak Ekle
function buildAllPages() {
  const wrapper = document.getElementById("pages-scroll-wrapper");
  wrapper.innerHTML = "";

  // 1. Kılavuz Sayfa 1: Sarı Zarf (Busta) Rehberi (Canva PNG Doğrudan)
  const bustaCard = document.createElement("div");
  bustaCard.className = "page-card";
  bustaCard.id = "page-card-guide-1";
  bustaCard.innerHTML = `
    <div class="page-card-header">BAŞVURU REHBERİ • SAYFA 1 / 10 • POSTE ITALIANE SARI ZARF (BUSTA)</div>
    <div class="guide-image-only-container" id="doc-container-guide-1">
      <img src="assets/guide_busta_user.png" alt="Sarı Zarf (Busta) Rehberi" class="guide-direct-img">
    </div>
  `;
  wrapper.appendChild(bustaCard);

  // 2. Kılavuz Sayfa 2: Posta Ödeme Makbuzu (Bollettino) Rehberi (Canva PNG Doğrudan)
  const bollettinoCard = document.createElement("div");
  bollettinoCard.className = "page-card";
  bollettinoCard.id = "page-card-guide-2";
  bollettinoCard.innerHTML = `
    <div class="page-card-header">BAŞVURU REHBERİ • SAYFA 2 / 10 • POSTA ÖDEME MAKBUZU (BOLLETTINO - 70,46 €)</div>
    <div class="guide-image-only-container" id="doc-container-guide-2">
      <img src="assets/guide_bollettino_user.png" alt="Bollettino Postale Rehberi" class="guide-direct-img">
    </div>
  `;
  wrapper.appendChild(bollettinoCard);

  // 3-10. Modulo 1 Sayfaları (Sayfa 1 - 8)
  for (let p = 1; p <= 8; p++) {
    const pageCard = document.createElement("div");
    pageCard.className = "page-card";
    pageCard.id = `page-card-${p}`;

    pageCard.innerHTML = `
      <div class="page-card-header">MOD. 209 - MODULO 1 • SAYFA ${p} DI 8 (BELGE ${p + 2} / 10)</div>
      <div class="document-container" id="doc-container-${p}">
        <img src="assets/pages/page_${p}.svg" alt="Sayfa ${p}" class="page-img" loading="lazy">
        <div id="overlay-layer-${p}" class="overlay-layer"></div>
      </div>
    `;

    wrapper.appendChild(pageCard);
  }
}

// Dropdownları doldur
function populateDropdowns() {
  document.querySelectorAll(".select-prov").forEach(sel => {
    PROVINCES.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.code;
      opt.textContent = `${p.code} - ${p.name}`;
      sel.appendChild(opt);
    });
  });

  document.querySelectorAll(".select-country").forEach(sel => {
    COUNTRIES.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.code;
      opt.textContent = `${c.code} - ${c.name}`;
      sel.appendChild(opt);
    });
  });
}

// Zoom Kontrolleri
function setupZoom() {
  const wrapper = document.getElementById("pages-scroll-wrapper");
  const zoomText = document.getElementById("zoom-level");

  const updateZoom = (z) => {
    currentZoom = Math.max(0.3, Math.min(2.0, z));
    wrapper.style.zoom = currentZoom;
    zoomText.textContent = `${Math.round(currentZoom * 100)}%`;
  };

  document.getElementById("btn-zoom-in").addEventListener("click", () => updateZoom(currentZoom + 0.15));
  document.getElementById("btn-zoom-out").addEventListener("click", () => updateZoom(currentZoom - 0.15));
  
  document.getElementById("btn-zoom-reset").addEventListener("click", () => updateZoom(1.0));

  // Initial Responsive Zoom
  if (window.innerWidth < 500) {
    updateZoom(0.40);
  } else if (window.innerWidth < 768) {
    updateZoom(0.60);
  } else if (window.innerWidth < 1200) {
    updateZoom(0.80);
  } else {
    updateZoom(1.0);
  }

}

// Tarih Maskeleme (GG/AA/YYYY)
function setupDateMasks() {
  document.querySelectorAll(".date-mask").forEach(inp => {
    inp.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "").slice(0, 8);
      if (v.length >= 5) {
        v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
      } else if (v.length >= 3) {
        v = `${v.slice(0, 2)}/${v.slice(2)}`;
      }
      e.target.value = v;
      renderOverlay();
    });
  });
}

// Açılır İleri Düzey Bölümler (Sayfa 5 - 8)
function setupAccordionToggle() {
  const btn = document.getElementById("btn-toggle-advanced");
  const content = document.getElementById("advanced-content");
  const chevron = document.getElementById("advanced-chevron");

  if (btn && content) {
    btn.addEventListener("click", () => {
      const isHidden = content.style.display === "none";
      content.style.display = isHidden ? "flex" : "none";
      if (chevron) {
        chevron.classList.toggle("open", isHidden);
      }
    });
  }
}

// Türkçe Karakterleri ve Boşlukları Temizleme
function sanitizeItalianText(str) {
  if (!str) return "";
  const map = {
    "ç": "C", "Ç": "C", "ğ": "G", "Ğ": "G", "ı": "I", "İ": "I",
    "ö": "O", "Ö": "O", "ş": "S", "Ş": "S", "ü": "U", "Ü": "U"
  };
  return str.replace(/[çÇğĞıİöÖşŞüÜ]/g, m => map[m] || m).toUpperCase();
}

// Form Değerlerini Çıkarma
function getFormValues() {
  const g = id => (document.getElementById(id) ? document.getElementById(id).value.trim() : "");
  
  return {
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
    scadenza_permesso: g("inp_scadenza_permesso").replace(/\//g, ""),
    moduli_compilati: g("inp_moduli_compilati"),
    totale_fogli: g("inp_totale_fogli").padStart(2, "0"),
    figli_carico: g("inp_figli_carico").padStart(2, "0"),
    data_presentazione: g("inp_data_presentazione").replace(/\//g, ""),

    // Sayfa 2
    codice_fiscale: sanitizeItalianText(g("inp_codice_fiscale")),
    stato_civile: g("inp_stato_civile"),
    sesso: g("inp_sesso"),
    data_nascita: g("inp_data_nascita").replace(/\//g, ""),
    stato_nascita: g("inp_stato_nascita"),
    stato_cittadinanza: g("inp_stato_cittadinanza"),
    rifugiato: g("inp_rifugiato"),
    citta_nascita: sanitizeItalianText(g("inp_citta_nascita")),
    tipo_documento: g("inp_tipo_documento"),
    num_passaporto: sanitizeItalianText(g("inp_num_passaporto")),
    pass_scadenza: g("inp_pass_scadenza").replace(/\//g, ""),
    rilasciato_da: g("inp_rilasciato_da"),
    data_ingresso: g("inp_data_ingresso").replace(/\//g, ""),
    frontiera: sanitizeItalianText(g("inp_frontiera")),
    num_visto: sanitizeItalianText(g("inp_num_visto")),
    tipo_visto: sanitizeItalianText(g("inp_tipo_visto")),
    tipo_ingresso: g("inp_tipo_ingresso"),
    motivo_visto: sanitizeItalianText(g("inp_motivo_visto")),
    durata_visto: g("inp_durata_visto"),
    visto_valido_dal: g("inp_visto_valido_dal").replace(/\//g, ""),
    visto_valido_al: g("inp_visto_valido_al").replace(/\//g, ""),

    // Sayfa 3 (Recapito)
    recapito_provincia: g("inp_recapito_provincia"),
    recapito_comune: sanitizeItalianText(g("inp_recapito_comune")),
    recapito_indirizzo: sanitizeItalianText(g("inp_recapito_indirizzo")),
    recapito_civico_num: sanitizeItalianText(g("inp_recapito_civico_num")),
    recapito_scala: sanitizeItalianText(g("inp_recapito_scala")),
    recapito_interno: sanitizeItalianText(g("inp_recapito_interno")),
    recapito_cap: sanitizeItalianText(g("inp_recapito_cap")),
    recapito_email: sanitizeItalianText(g("inp_recapito_email")),
    phone_prefix: g("inp_phone_prefix").replace(/\D/g, "").slice(0, 4),
    phone_number: g("inp_phone_number").replace(/\D/g, ""),

    // Sayfa 4 (Carta di Soggiorno - Idoneità & Soggiorni Precedenti)
    data_idoneita: g("inp_data_idoneita").replace(/\//g, ""),
    comune_rilascio: sanitizeItalianText(g("inp_comune_rilascio")),
    soggiorno1_provincia: sanitizeItalianText(g("inp_soggiorno1_provincia")),
    soggiorno1_comune: sanitizeItalianText(g("inp_soggiorno1_comune")),
    soggiorno1_indirizzo: sanitizeItalianText(g("inp_soggiorno1_indirizzo")),
    soggiorno2_provincia: sanitizeItalianText(g("inp_soggiorno2_provincia")),
    soggiorno2_comune: sanitizeItalianText(g("inp_soggiorno2_comune")),
    soggiorno2_indirizzo: sanitizeItalianText(g("inp_soggiorno2_indirizzo")),
    soggiorno3_provincia: sanitizeItalianText(g("inp_soggiorno3_provincia")),
    soggiorno3_comune: sanitizeItalianText(g("inp_soggiorno3_comune")),
    soggiorno3_indirizzo: sanitizeItalianText(g("inp_soggiorno3_indirizzo")),

    // Sayfa 5 (Familiari Conviventi)
    conviventi_numero: g("inp_conviventi_numero"),
    parentela_figli_num: g("inp_parentela_figli_num"),

    // Sayfa 6 (Coniuge & 1. Figlio)
    coniuge_cognome: sanitizeItalianText(g("inp_coniuge_cognome")),
    coniuge_nome: sanitizeItalianText(g("inp_coniuge_nome")),
    coniuge_sesso: g("inp_coniuge_sesso"),
    coniuge_data_nascita: g("inp_coniuge_data_nascita").replace(/\//g, ""),
    coniuge_cod_cittadinanza: sanitizeItalianText(g("inp_coniuge_cod_cittadinanza")),
    coniuge_citta_nascita: sanitizeItalianText(g("inp_coniuge_citta_nascita")),

    figlio1_cognome: sanitizeItalianText(g("inp_figlio1_cognome")),
    figlio1_nome: sanitizeItalianText(g("inp_figlio1_nome")),
    figlio1_data_nascita: g("inp_figlio1_data_nascita").replace(/\//g, ""),
    figlio1_cod_cittadinanza: sanitizeItalianText(g("inp_figlio1_cod_cittadinanza")),
    figlio1_citta_nascita: sanitizeItalianText(g("inp_figlio1_citta_nascita")),

    // Sayfa 7 (2. & 3. Figlio)
    figlio2_cognome: sanitizeItalianText(g("inp_figlio2_cognome")),
    figlio2_nome: sanitizeItalianText(g("inp_figlio2_nome")),
    figlio2_data_nascita: g("inp_figlio2_data_nascita").replace(/\//g, ""),
    figlio2_cod_cittadinanza: sanitizeItalianText(g("inp_figlio2_cod_cittadinanza")),
    figlio2_citta_nascita: sanitizeItalianText(g("inp_figlio2_citta_nascita")),

    figlio3_cognome: sanitizeItalianText(g("inp_figlio3_cognome")),
    figlio3_nome: sanitizeItalianText(g("inp_figlio3_nome")),
    figlio3_data_nascita: g("inp_figlio3_data_nascita").replace(/\//g, ""),
    figlio3_cod_cittadinanza: sanitizeItalianText(g("inp_figlio3_cod_cittadinanza")),
    figlio3_citta_nascita: sanitizeItalianText(g("inp_figlio3_citta_nascita")),

    // Sayfa 8 (4. & 5. Figlio)
    figlio4_cognome: sanitizeItalianText(g("inp_figlio4_cognome")),
    figlio4_nome: sanitizeItalianText(g("inp_figlio4_nome")),
    figlio4_data_nascita: g("inp_figlio4_data_nascita").replace(/\//g, ""),
    figlio4_cod_cittadinanza: sanitizeItalianText(g("inp_figlio4_cod_cittadinanza")),
    figlio4_citta_nascita: sanitizeItalianText(g("inp_figlio4_citta_nascita")),

    figlio5_cognome: sanitizeItalianText(g("inp_figlio5_cognome")),
    figlio5_nome: sanitizeItalianText(g("inp_figlio5_nome")),
    figlio5_data_nascita: g("inp_figlio5_data_nascita").replace(/\//g, ""),
    figlio5_cod_cittadinanza: sanitizeItalianText(g("inp_figlio5_cod_cittadinanza")),
    figlio5_citta_nascita: sanitizeItalianText(g("inp_figlio5_citta_nascita"))
  };
}

// İnput Dinleyicileri ve Çift Yönlü Otomatik Kaydırma
function setupInputListeners() {
  document.querySelectorAll(".form-control").forEach(el => {
    el.addEventListener("input", renderOverlay);
    el.addEventListener("change", renderOverlay);

    el.addEventListener("focus", () => {
      activeField = el.id.replace("inp_", "");
      highlightActiveBoxes();

      // Odaklanan alana göre ilgili sayfaya otomatik kaydır
      const sec = el.closest(".form-section-card");
      if (sec) {
        let targetPage = 1;
        if (["sec-1", "sec-2"].includes(sec.id)) targetPage = 1;
        else if (["sec-3", "sec-4", "sec-5"].includes(sec.id)) targetPage = 2;
        else if (sec.id === "sec-7") targetPage = 3;
        else if (sec.id === "sec-9") targetPage = 4;
        else {
          const id = el.id;
          if (id.includes("conviventi") || id.includes("parentela")) targetPage = 5;
          else if (id.includes("coniuge") || id.includes("figlio1")) targetPage = 6;
          else if (id.includes("figlio2") || id.includes("figlio3")) targetPage = 7;
          else if (id.includes("figlio4") || id.includes("figlio5")) targetPage = 8;
        }

        const pageCard = document.getElementById(`page-card-${targetPage}`);
        if (pageCard) {
          pageCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    });

    el.addEventListener("blur", () => {
      activeField = null;
      highlightActiveBoxes();
    });
  });
}

function highlightActiveBoxes() {
  document.querySelectorAll(".char-cell").forEach(cell => {
    cell.classList.toggle("active-field", cell.dataset.field === activeField);
  });
}

// Canlı Önizleme Katmanını Çiz
function renderOverlay() {
  const data = getFormValues();
  const PDF_WIDTH = 595.22;
  const PDF_HEIGHT = 842.0;

  const placeBoxesOnPage = (pageNum, fieldKey, text, isCheckbox = false) => {
    const pageKey = `page_${pageNum}`;
    const pageFields = FIELD_MAPPINGS[pageKey];
    if (!pageFields) return;

    const boxes = pageFields[fieldKey];
    if (!boxes || !boxes.length) return;

    const overlay = document.getElementById(`overlay-layer-${pageNum}`);
    if (!overlay) return;

    boxes.forEach((b, idx) => {
      const cell = document.createElement("div");
      cell.className = "char-cell" + (isCheckbox ? " checkbox-cell" : "");
      cell.dataset.field = fieldKey;

      cell.style.left = `${(b.x / PDF_WIDTH) * 100}%`;
      cell.style.top = `${(b.y / PDF_HEIGHT) * 100}%`;
      cell.style.width = `${(b.w / PDF_WIDTH) * 100}%`;
      cell.style.height = `${(b.h / PDF_HEIGHT) * 100}%`;

      if (isCheckbox) {
        cell.textContent = text ? "X" : "";
      } else {
        cell.textContent = (text && text[idx]) ? text[idx] : "";
      }

      cell.addEventListener("click", () => {
        const inp = document.getElementById(`inp_${fieldKey}`) || 
                    document.getElementById(`inp_${fieldKey.replace('chk_', '')}`);
        if (inp) {
          inp.focus();
          inp.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });

      overlay.appendChild(cell);
    });
  };

  // 1. Modulo 1 sayfalarının katmanlarını temizle
  for (let p = 1; p <= 8; p++) {
    const overlay = document.getElementById(`overlay-layer-${p}`);
    if (overlay) overlay.innerHTML = "";
  }

  // 2. Sayfa 1
  placeBoxesOnPage(1, "sigla_questura", data.sigla_questura);
  placeBoxesOnPage(1, "cognome", data.cognome);
  placeBoxesOnPage(1, "nome", data.nome);
  placeBoxesOnPage(1, "provincia_domicilio", data.provincia_domicilio);
  placeBoxesOnPage(1, "comune_domicilio", data.comune_domicilio);

  placeBoxesOnPage(1, "chk_rilascio", data.tipo_richiesta === "rilascio", true);
  placeBoxesOnPage(1, "chk_rinnovo", data.tipo_richiesta === "rinnovo", true);
  placeBoxesOnPage(1, "chk_aggiornamento", data.tipo_richiesta === "aggiornamento", true);
  placeBoxesOnPage(1, "chk_duplicato", data.tipo_richiesta === "duplicato", true);
  placeBoxesOnPage(1, "chk_conversione", data.tipo_richiesta === "conversione", true);

  placeBoxesOnPage(1, "chk_permesso", data.del_della === "permesso", true);
  placeBoxesOnPage(1, "chk_carta", data.del_della === "carta", true);
  placeBoxesOnPage(1, "chk_aggiornamento_foto", data.del_della === "foto", true);

  placeBoxesOnPage(1, "codice_tipologia_richiesta", data.codice_tipologia);
  placeBoxesOnPage(1, "num_permesso_in_possesso", data.num_permesso_possesso);
  placeBoxesOnPage(1, "scadenza_permesso", data.scadenza_permesso);

  placeBoxesOnPage(1, "chk_modulo_1", true, true);
  placeBoxesOnPage(1, "moduli_compilati", data.moduli_compilati.padStart(2, "0"));
  placeBoxesOnPage(1, "numero_totale_fogli", data.totale_fogli);
  placeBoxesOnPage(1, "figli_a_carico", data.figli_carico);
  placeBoxesOnPage(1, "data_presentazione", data.data_presentazione);

  // 3. Sayfa 2
  placeBoxesOnPage(2, "codice_fiscale", data.codice_fiscale);
  placeBoxesOnPage(2, "stato_civile", data.stato_civile);
  placeBoxesOnPage(2, "sesso", data.sesso);
  placeBoxesOnPage(2, "data_nascita", data.data_nascita);
  placeBoxesOnPage(2, "cod_stato_nascita", data.stato_nascita);
  placeBoxesOnPage(2, "cod_stato_cittadinanza", data.stato_cittadinanza);
  placeBoxesOnPage(2, "chk_rifugiato_no", data.rifugiato === "NO", true);
  placeBoxesOnPage(2, "chk_rifugiato_si", data.rifugiato === "SI", true);
  placeBoxesOnPage(2, "citta_nascita", data.citta_nascita);

  placeBoxesOnPage(2, "chk_passaporto", data.tipo_documento === "passaporto", true);
  placeBoxesOnPage(2, "chk_altro_doc", data.tipo_documento === "altro", true);
  placeBoxesOnPage(2, "num_passaporto", data.num_passaporto);
  placeBoxesOnPage(2, "pass_valido_al", data.pass_scadenza);
  placeBoxesOnPage(2, "rilasciato_da", data.rilasciato_da);

  placeBoxesOnPage(2, "data_ingresso", data.data_ingresso);
  placeBoxesOnPage(2, "frontiera", data.frontiera);
  placeBoxesOnPage(2, "num_visto", data.num_visto);
  placeBoxesOnPage(2, "tipo_visto", data.tipo_visto);
  placeBoxesOnPage(2, "chk_ingresso_singolo", data.tipo_ingresso === "singolo", true);
  placeBoxesOnPage(2, "chk_ingresso_multiplo", data.tipo_ingresso === "multiplo", true);
  placeBoxesOnPage(2, "motivo_visto", data.motivo_visto);
  placeBoxesOnPage(2, "durata_visto", data.durata_visto.padStart(3, "0"));
  placeBoxesOnPage(2, "visto_valido_dal", data.visto_valido_dal);
  placeBoxesOnPage(2, "visto_valido_al", data.visto_valido_al);

  // 4. Sayfa 3
  placeBoxesOnPage(3, "recapito_provincia", data.recapito_provincia);
  placeBoxesOnPage(3, "recapito_comune", data.recapito_comune);
  placeBoxesOnPage(3, "recapito_indirizzo", data.recapito_indirizzo);
  placeBoxesOnPage(3, "recapito_civico_num", data.recapito_civico_num);
  placeBoxesOnPage(3, "recapito_scala", data.recapito_scala);
  placeBoxesOnPage(3, "recapito_interno", data.recapito_interno);
  placeBoxesOnPage(3, "recapito_cap", data.recapito_cap);
  placeBoxesOnPage(3, "recapito_email", data.recapito_email);

  // 75. Telefon Kutuları (Prefix 4 kutu + Numara 12 kutu)
  const phoneBoxes = FIELD_MAPPINGS.page_3 ? FIELD_MAPPINGS.page_3.recapito_cellulare : null;
  if (phoneBoxes) {
    const overlay3 = document.getElementById("overlay-layer-3");
    if (overlay3) {
      const prefText = data.phone_prefix || "";
      for (let i = 0; i < 4 && i < phoneBoxes.length; i++) {
        const b = phoneBoxes[i];
        const cell = document.createElement("div");
        cell.className = "char-cell";
        cell.dataset.field = "phone_prefix";
        cell.style.left = `${(b.x / PDF_WIDTH) * 100}%`;
        cell.style.top = `${(b.y / PDF_HEIGHT) * 100}%`;
        cell.style.width = `${(b.w / PDF_WIDTH) * 100}%`;
        cell.style.height = `${(b.h / PDF_HEIGHT) * 100}%`;
        cell.textContent = prefText[i] || "";
        cell.addEventListener("click", () => {
          document.getElementById("inp_phone_prefix").focus();
        });
        overlay3.appendChild(cell);
      }

      const numText = data.phone_number || "";
      for (let i = 4; i < phoneBoxes.length; i++) {
        const b = phoneBoxes[i];
        const charIdx = i - 4;
        const cell = document.createElement("div");
        cell.className = "char-cell";
        cell.dataset.field = "phone_number";
        cell.style.left = `${(b.x / PDF_WIDTH) * 100}%`;
        cell.style.top = `${(b.y / PDF_HEIGHT) * 100}%`;
        cell.style.width = `${(b.w / PDF_WIDTH) * 100}%`;
        cell.style.height = `${(b.h / PDF_HEIGHT) * 100}%`;
        cell.textContent = numText[charIdx] || "";
        cell.addEventListener("click", () => {
          document.getElementById("inp_phone_number").focus();
        });
        overlay3.appendChild(cell);
      }
    }
  }

  // 5. Sayfa 4 (Carta di Soggiorno - Idoneità & Soggiorni)
  placeBoxesOnPage(4, "data_idoneita", data.data_idoneita);
  placeBoxesOnPage(4, "comune_rilascio", data.comune_rilascio);
  placeBoxesOnPage(4, "soggiorno1_provincia", data.soggiorno1_provincia);
  placeBoxesOnPage(4, "soggiorno1_comune", data.soggiorno1_comune);
  placeBoxesOnPage(4, "soggiorno1_indirizzo", data.soggiorno1_indirizzo);
  placeBoxesOnPage(4, "soggiorno2_provincia", data.soggiorno2_provincia);
  placeBoxesOnPage(4, "soggiorno2_comune", data.soggiorno2_comune);
  placeBoxesOnPage(4, "soggiorno2_indirizzo", data.soggiorno2_indirizzo);

  // 6. Sayfa 5
  placeBoxesOnPage(5, "conviventi_numero", data.conviventi_numero);
  placeBoxesOnPage(5, "parentela_figli_num", data.parentela_figli_num);

  // 7. Sayfa 6
  placeBoxesOnPage(6, "coniuge_cognome", data.coniuge_cognome);
  placeBoxesOnPage(6, "coniuge_nome", data.coniuge_nome);
  placeBoxesOnPage(6, "coniuge_sesso", data.coniuge_sesso);
  placeBoxesOnPage(6, "coniuge_data_nascita", data.coniuge_data_nascita);
  placeBoxesOnPage(6, "coniuge_cod_cittadinanza", data.coniuge_cod_cittadinanza);
  placeBoxesOnPage(6, "coniuge_citta_nascita", data.coniuge_citta_nascita);

  placeBoxesOnPage(6, "figlio1_cognome", data.figlio1_cognome);
  placeBoxesOnPage(6, "figlio1_nome", data.figlio1_nome);
  placeBoxesOnPage(6, "figlio1_data_nascita", data.figlio1_data_nascita);
  placeBoxesOnPage(6, "figlio1_cod_cittadinanza", data.figlio1_cod_cittadinanza);
  placeBoxesOnPage(6, "figlio1_citta_nascita", data.figlio1_citta_nascita);

  // 8. Sayfa 7
  placeBoxesOnPage(7, "figlio2_cognome", data.figlio2_cognome);
  placeBoxesOnPage(7, "figlio2_nome", data.figlio2_nome);
  placeBoxesOnPage(7, "figlio2_data_nascita", data.figlio2_data_nascita);
  placeBoxesOnPage(7, "figlio2_cod_cittadinanza", data.figlio2_cod_cittadinanza);
  placeBoxesOnPage(7, "figlio2_citta_nascita", data.figlio2_citta_nascita);

  placeBoxesOnPage(7, "figlio3_cognome", data.figlio3_cognome);
  placeBoxesOnPage(7, "figlio3_nome", data.figlio3_nome);
  placeBoxesOnPage(7, "figlio3_data_nascita", data.figlio3_data_nascita);
  placeBoxesOnPage(7, "figlio3_cod_cittadinanza", data.figlio3_cod_cittadinanza);
  placeBoxesOnPage(7, "figlio3_citta_nascita", data.figlio3_citta_nascita);

  // 9. Sayfa 8
  placeBoxesOnPage(8, "figlio4_cognome", data.figlio4_cognome);
  placeBoxesOnPage(8, "figlio4_nome", data.figlio4_nome);
  placeBoxesOnPage(8, "figlio4_data_nascita", data.figlio4_data_nascita);
  placeBoxesOnPage(8, "figlio4_cod_cittadinanza", data.figlio4_cod_cittadinanza);
  placeBoxesOnPage(8, "figlio4_citta_nascita", data.figlio4_citta_nascita);

  placeBoxesOnPage(8, "figlio5_cognome", data.figlio5_cognome);
  placeBoxesOnPage(8, "figlio5_nome", data.figlio5_nome);
  placeBoxesOnPage(8, "figlio5_data_nascita", data.figlio5_data_nascita);
  placeBoxesOnPage(8, "figlio5_cod_cittadinanza", data.figlio5_cod_cittadinanza);
  placeBoxesOnPage(8, "figlio5_citta_nascita", data.figlio5_citta_nascita);

  highlightActiveBoxes();
}

// Örnek Veri Doldurma
function loadDemoData() {
  const s = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  // Sayfa 1 Demo (Torino & HALUK YILMAZ)
  s("inp_sigla_questura", "TO");
  s("inp_cognome", "YILMAZ");
  s("inp_nome", "HALUK");
  s("inp_provincia_domicilio", "TO");
  s("inp_comune_domicilio", "TORINO");
  s("inp_tipo_richiesta", "rilascio");
  s("inp_del_della", "permesso");
  s("inp_codice_tipologia", "24");
  s("inp_moduli_compilati", "1");
  s("inp_totale_fogli", "16");
  s("inp_figli_carico", "0");
  s("inp_data_presentazione", "15/10/2026");

  // Sayfa 2 Demo
  s("inp_codice_fiscale", "YLMHLK00E15Z104C");
  s("inp_stato_civile", "A");
  s("inp_sesso", "M");
  s("inp_data_nascita", "15/05/2000");
  s("inp_stato_nascita", "TUR");
  s("inp_stato_cittadinanza", "TUR");
  s("inp_rifugiato", "NO");
  s("inp_citta_nascita", "KADIKOY");
  s("inp_tipo_documento", "passaporto");
  s("inp_num_passaporto", "U12345678");
  s("inp_pass_scadenza", "20/08/2032");
  s("inp_rilasciato_da", "01");
  s("inp_data_ingresso", "01/10/2026");
  s("inp_frontiera", "TORINO CASELLE");
  s("inp_num_visto", "1234567");
  s("inp_tipo_visto", "D");
  s("inp_tipo_ingresso", "multiplo");
  s("inp_motivo_visto", "STUDIO");
  s("inp_durata_visto", "365");
  s("inp_visto_valido_dal", "01/09/2026");
  s("inp_visto_valido_al", "31/08/2027");

  // Sayfa 3 Demo (Torino İkamet)
  s("inp_recapito_provincia", "TO");
  s("inp_recapito_comune", "TORINO");
  s("inp_recapito_indirizzo", "VIA ROMA");
  s("inp_recapito_civico_num", "10");
  s("inp_recapito_scala", "2");
  s("inp_recapito_interno", "5");
  s("inp_recapito_cap", "10121");
  s("inp_recapito_email", "HALUK.YILMAZ@GMAIL.COM");
  s("inp_phone_prefix", "0039");
  s("inp_phone_number", "3519871234");

  renderOverlay();
}

function clearForm() {
  document.querySelectorAll(".form-control").forEach(inp => {
    if (inp.tagName === "SELECT") {
      inp.selectedIndex = 0;
    } else {
      inp.value = "";
    }
  });
  document.getElementById("inp_phone_prefix").value = "0039";
  document.getElementById("inp_tipo_visto").value = "D";
  document.getElementById("inp_motivo_visto").value = "STUDIO";
  document.getElementById("inp_totale_fogli").value = "16";
  document.getElementById("inp_figli_carico").value = "0";
  renderOverlay();
}

// Resmi PDF Çıktısı Üretme (pdf-lib - 10 Sayfa Master Paket)
async function downloadOfficialPdf() {
  const btn = document.getElementById("btn-download");
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span>10 Sayfa Paket Hazırlanıyor...</span>`;

  try {
    let pdfBytes = null;
    try {
      if (window.location.protocol !== 'file:') {
        const res = await fetch("clean_official_10pages.pdf");
        if (res.ok) {
          pdfBytes = await res.arrayBuffer();
        }
      }
    } catch (e) {
      console.warn("Fetch failed, falling back to embedded template:", e);
    }

    if (!pdfBytes && window.EMBEDDED_PDF_BASE64) {
      const binaryString = atob(window.EMBEDDED_PDF_BASE64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      pdfBytes = bytes.buffer;
    }

    if (!pdfBytes) {
      throw new Error("Şablon PDF dosyası yüklenemedi!");
    }

    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const data = getFormValues();

    const writeBoxes = (page, boxes, text, isCheckbox = false) => {
      if (!boxes || !boxes.length || !text) return;
      
      boxes.forEach((b, i) => {
        const char = isCheckbox ? (text ? "X" : "") : (text[i] || "");
        if (!char) return;

        const fontSize = isCheckbox ? 11 : 10;
        const charWidth = font.widthOfTextAtSize(char, fontSize);
        
        const pdfX = b.x + (b.w - charWidth) / 2;
        const pdfY = 842.0 - b.y - b.h + (b.h - fontSize) / 2 + 1.2;

        page.drawText(char, {
          x: pdfX,
          y: pdfY,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0)
        });
      });
    };

    const pages = pdfDoc.getPages();
    // 10 Sayfalık Belge:
    // pages[0]: Busta Rehberi
    // pages[1]: Bollettino Rehberi
    // pages[2]: Modulo 1 Sayfa 1
    // ...
    // pages[9]: Modulo 1 Sayfa 8

    const p1 = pages[2];
    const p2 = pages[3];
    const p3 = pages[4];
    const p4 = pages[5];
    const p5 = pages[6];
    const p6 = pages[7];
    const p7 = pages[8];
    const p8 = pages[9];

    const p1F = FIELD_MAPPINGS.page_1 || {};
    const p2F = FIELD_MAPPINGS.page_2 || {};
    const p3F = FIELD_MAPPINGS.page_3 || {};

    // 1. Modulo 1 Sayfa 1 (Belge Sayfa 3)
    if (p1) {
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
    }

    // 2. Modulo 1 Sayfa 2 (Belge Sayfa 4)
    if (p2) {
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
    }

    // 3. Modulo 1 Sayfa 3 (Belge Sayfa 5)
    if (p3 && p3F) {
      writeBoxes(p3, p3F.recapito_provincia, data.recapito_provincia);
      writeBoxes(p3, p3F.recapito_comune, data.recapito_comune);
      writeBoxes(p3, p3F.recapito_indirizzo, data.recapito_indirizzo);
      writeBoxes(p3, p3F.recapito_civico_num, data.recapito_civico_num);
      writeBoxes(p3, p3F.recapito_scala, data.recapito_scala);
      writeBoxes(p3, p3F.recapito_interno, data.recapito_interno);
      writeBoxes(p3, p3F.recapito_cap, data.recapito_cap);
      writeBoxes(p3, p3F.recapito_email, data.recapito_email);

      const phoneBoxes = p3F.recapito_cellulare;
      if (phoneBoxes) {
        writeBoxes(p3, phoneBoxes.slice(0, 4), data.phone_prefix);
        writeBoxes(p3, phoneBoxes.slice(4), data.phone_number);
      }
    }

    // 4. Modulo 1 Sayfa 4 (Belge Sayfa 6)
    if (p4 && FIELD_MAPPINGS.page_4) {
      const p4F = FIELD_MAPPINGS.page_4;
      writeBoxes(p4, p4F.data_idoneita, data.data_idoneita);
      writeBoxes(p4, p4F.comune_rilascio, data.comune_rilascio);
      writeBoxes(p4, p4F.soggiorno1_provincia, data.soggiorno1_provincia);
      writeBoxes(p4, p4F.soggiorno1_comune, data.soggiorno1_comune);
      writeBoxes(p4, p4F.soggiorno1_indirizzo, data.soggiorno1_indirizzo);
      writeBoxes(p4, p4F.soggiorno2_provincia, data.soggiorno2_provincia);
      writeBoxes(p4, p4F.soggiorno2_comune, data.soggiorno2_comune);
      writeBoxes(p4, p4F.soggiorno2_indirizzo, data.soggiorno2_indirizzo);
    }

    // 5. Modulo 1 Sayfa 5 (Belge Sayfa 7)
    if (p5 && FIELD_MAPPINGS.page_5) {
      const p5F = FIELD_MAPPINGS.page_5;
      writeBoxes(p5, p5F.conviventi_numero, data.conviventi_numero);
      writeBoxes(p5, p5F.parentela_figli_num, data.parentela_figli_num);
    }

    // 6. Modulo 1 Sayfa 6 (Belge Sayfa 8)
    if (p6 && FIELD_MAPPINGS.page_6) {
      const p6F = FIELD_MAPPINGS.page_6;
      writeBoxes(p6, p6F.coniuge_cognome, data.coniuge_cognome);
      writeBoxes(p6, p6F.coniuge_nome, data.coniuge_nome);
      writeBoxes(p6, p6F.coniuge_sesso, data.coniuge_sesso);
      writeBoxes(p6, p6F.coniuge_data_nascita, data.coniuge_data_nascita);
      writeBoxes(p6, p6F.coniuge_cod_cittadinanza, data.coniuge_cod_cittadinanza);
      writeBoxes(p6, p6F.coniuge_citta_nascita, data.coniuge_citta_nascita);

      writeBoxes(p6, p6F.figlio1_cognome, data.figlio1_cognome);
      writeBoxes(p6, p6F.figlio1_nome, data.figlio1_nome);
      writeBoxes(p6, p6F.figlio1_data_nascita, data.figlio1_data_nascita);
      writeBoxes(p6, p6F.figlio1_cod_cittadinanza, data.figlio1_cod_cittadinanza);
      writeBoxes(p6, p6F.figlio1_citta_nascita, data.figlio1_citta_nascita);
    }

    // 7. Modulo 1 Sayfa 7 (Belge Sayfa 9)
    if (p7 && FIELD_MAPPINGS.page_7) {
      const p7F = FIELD_MAPPINGS.page_7;
      writeBoxes(p7, p7F.figlio2_cognome, data.figlio2_cognome);
      writeBoxes(p7, p7F.figlio2_nome, data.figlio2_nome);
      writeBoxes(p7, p7F.figlio2_data_nascita, data.figlio2_data_nascita);
      writeBoxes(p7, p7F.figlio2_cod_cittadinanza, data.figlio2_cod_cittadinanza);
      writeBoxes(p7, p7F.figlio2_citta_nascita, data.figlio2_citta_nascita);

      writeBoxes(p7, p7F.figlio3_cognome, data.figlio3_cognome);
      writeBoxes(p7, p7F.figlio3_nome, data.figlio3_nome);
      writeBoxes(p7, p7F.figlio3_data_nascita, data.figlio3_data_nascita);
      writeBoxes(p7, p7F.figlio3_cod_cittadinanza, data.figlio3_cod_cittadinanza);
      writeBoxes(p7, p7F.figlio3_citta_nascita, data.figlio3_citta_nascita);
    }

    // 8. Modulo 1 Sayfa 8 (Belge Sayfa 10)
    if (p8 && FIELD_MAPPINGS.page_8) {
      const p8F = FIELD_MAPPINGS.page_8;
      writeBoxes(p8, p8F.figlio4_cognome, data.figlio4_cognome);
      writeBoxes(p8, p8F.figlio4_nome, data.figlio4_nome);
      writeBoxes(p8, p8F.figlio4_data_nascita, data.figlio4_data_nascita);
      writeBoxes(p8, p8F.figlio4_cod_cittadinanza, data.figlio4_cod_cittadinanza);
      writeBoxes(p8, p8F.figlio4_citta_nascita, data.figlio4_citta_nascita);

      writeBoxes(p8, p8F.figlio5_cognome, data.figlio5_cognome);
      writeBoxes(p8, p8F.figlio5_nome, data.figlio5_nome);
      writeBoxes(p8, p8F.figlio5_data_nascita, data.figlio5_data_nascita);
      writeBoxes(p8, p8F.figlio5_cod_cittadinanza, data.figlio5_cod_cittadinanza);
      writeBoxes(p8, p8F.figlio5_citta_nascita, data.figlio5_citta_nascita);
    }

    // Dışa aktar (10 Sayfa Master Paket)
    const outBytes = await pdfDoc.save();
    const blob = new Blob([outBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Modulo_209_Basvuru_Paketi_${data.cognome || "Doldurulmus"}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    alert("PDF oluşturulurken hata oluştu: " + err.message);
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}
