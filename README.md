# Öğrenciler İçin İtalyan Oturum İzni Form Doldurma Sistemi (Modulo 1)

İtalya'da üniversite eğitimi gören uluslararası öğrenciler için resmi **Permesso di Soggiorno (Mod. 209 - Modulo 1)** başvuru formunu hatasız, hızlı ve interaktif bir şekilde doldurmayı sağlayan modern web uygulaması.

Tamamen **istemci tarafında (Client-Side / HTML5 & Vanilla JavaScript)** çalışır. Kullanıcının girdiği hiçbir kişisel veri herhangi bir sunucuya iletilmez, kaydedilmez veya saklanmaz.

##  Özellikler

- **10 Sayfalık Kesintisiz Akış:**
  - **Sayfa 1 (Sarı Zarf / Busta Kılavuzu):** Poste Italiane *Sportello Amico* zarfının boş ve açık bırakılması gerektiğine dair görsel rehber.
  - **Sayfa 2 (Bollettino Postale Kılavuzu):** Öğrenciler için 70,46 € basım harcı, 30 € posta ücreti ve 16 € Marca da Bollo (damga pulu) olmak üzere toplam 116,46 € harç detaylarını gösteren makbuz rehberi.
  - **Sayfa 3–10 (Modulo 1 - 8 Sayfa):** Resmi İtalyan İçişleri Bakanlığı formunun kutucuklarına anlık eşleşen canlı form önizlemesi.
- **Resmi PDF Çıktısı (pdf-lib):** Tek tıkla tarayıcı içinde derlenen ve resmi kutulara milimetrik oturan 10 sayfalık hazır başvuru paketi PDF'i.
- **Akıllı Form Alanları:**
  - İtalyanca karakter ve büyük harf otomatik düzeltmesi (Ç, Ğ, İ, Ö, Ş, Ü -> C, G, I, O, S, U).
  - GG/AA/YYYY otomatik tarih maskeleme.
  - Resmi İtalyan il kodları (Sigle Province) ve ülke kodları (Codici Stato) otomatik tamamlama.
  - Çift yönlü kaydırma: Form alanına tıklandığında sağdaki ilgili resmi belge sayfasına otomatik ve pürüzsüz kaydırma.
- **Öğrenci Odaklı Sadeleştirme:** Sayfa 5–8 arasındaki aile ve çocuk bölümleri öğrenciler için varsayılan olarak kapalı tutulan akordeon yapısındadır.

##  Kurulum ve Çalıştırma

Herhangi bir backend veya veritabanı gerektirmez. Statik bir web sunucusuyla veya doğrudan GitHub Pages üzerinden yayınlanabilir:

`ash
# Yerel test için:
python -m http.server 8000
`
Tarayıcınızda http://localhost:8000 adresini açmanız yeterlidir.

## 📄 Lisans

Bu proje [GNU General Public License v3.0 (GPL-3.0)](LICENSE) ile lisanslanmıştır.
