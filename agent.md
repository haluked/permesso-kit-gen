# Permesso Kit Gen - Proje Dokümantasyonu (Agent.md)

## 📌 Projenin Amacı
Bu proje, İtalya'ya eğitim amacıyla giden veya mevcut oturumunu yenilemek isteyen uluslararası öğrencilerin (öncelikli olarak Türk öğrencilerin) İtalyan Oturum İzni (**Permesso di Soggiorno**) başvuru formu olan karmaşık **Modulo 1 (Mod 209)** belgesini hatasız ve kolayca doldurmasını sağlamak amacıyla geliştirilmiştir.

İtalyan bürokrasisinde form doldurma süreçleri karmaşıktır ve küçük bir hata bile başvuru sürecinin uzamasına neden olabilir. Bu sistem;
- Anlaşılmaz İtalyanca terimleri açıklar.
- Hangi alanın nasıl doldurulması gerektiğine dair ipuçları (tooltipler) sunar.
- Yanlış veya eksik bilgi girilmesini engeller.
- Girilen verileri saniyeler içinde **resmi PDF formatına (Postane Kiti)** işleyerek çıktı almaya hazır hale getirir.

## 🏗️ Mimari ve Gizlilik Yaklaşımı (Privacy-First)
Bu projenin en büyük ve en kritik mimari kararı **"İstemci Tarafında Çalışma" (Client-Side Rendering & Processing)** prensibidir.

Öğrenciler forma pasaport numarası, vize detayları, adres gibi son derece hassas kişisel veriler girmektedir. Bu nedenle mimari şu şekilde tasarlanmıştır:
- **Sunucusuz (Serverless) Yapı:** Hiçbir kullanıcı verisi, hiçbir sunucuya gönderilmez veya kaydedilmez.
- **Yerel İşleme (Local Execution):** PDF oluşturma işlemi tamamen kullanıcının kendi tarayıcısında (cihazında) gerçekleşir.
- **Teknoloji Yığını:** Saf HTML, CSS ve Vanilla JavaScript (Bağımlılıkları minimize edilmiş, hafif ve hızlı).
- **PDF İşleme:** İstemci tarafında çalışan PDF kütüphaneleri (örneğin `pdf-lib`) ile resmi doküman üzerine koordinat bazlı veri işleme yapılır.
- **Responsive Tasarım:** Masaüstünde ve tablette rahat okunabilmesi için Çiftli Görünüm (Form ve PDF yan yana), mobil telefonlarda ise dar ekranlar için Alt-Alta (Stacked) görünüm kullanılır.

## 🎯 Hedef Kitle (Kime Göre?)
- İtalya'ya Erasmus, Lisans veya Yüksek Lisans gibi eğitim programlarıyla ilk kez giden uluslararası öğrenciler.
- Oturum iznini yenilemesi (Rinnovo) gereken mevcut öğrenciler.
- Öğrencilere form doldurma sürecinde rehberlik etmek isteyen öğrenci kulüpleri veya danışmanlık kurumları.

## 🚀 Gelecek Planları ve Vizyon
Bu projenin gelecekte daha da kapsamlı bir "İtalya Öğrenci Hayatı Asistanı"na dönüşmesi hedeflenmektedir:
1. **PWA (Progressive Web App) Desteği:** Öğrenciler siteyi bir kez açtıktan sonra internet bağlantısı olmasa bile (örneğin postanede sırada beklerken) formu doldurup PDF üretebilmeli.
2. **Çoklu Dil Desteği (i18n):** Şu an Türkçe-İngilizce olan yapının, daha çok uluslararası öğrenciye hitap edebilmesi için İspanyolca, Fransızca, Arapça gibi dillere genişletilmesi.
3. **Diğer Bürokratik Formlar:** İlerleyen aşamalarda **Codice Fiscale** (Vergi Numarası) başvuru formu, ev kiralama sözleşmeleri kayıt formları veya burs başvuru dilekçeleri gibi diğer resmi evrakların entegre edilmesi.
4. **Akıllı Optik Karakter Tanıma (OCR):** Kullanıcının pasaportunun fotoğrafını çekip sisteme yüklediğinde (yine sadece tarayıcı içinde çalışarak), ad-soyad-pasaport no gibi bilgilerin forma otomatik çekilmesi.
5. **Dinamik Postane Fiyat Güncellemeleri:** Pul (Marca da Bollo) ve posta masrafları İtalyan devleti tarafından değiştirildiğinde güncel maliyetleri gösteren entegre bir hesaplayıcı sunulması.
