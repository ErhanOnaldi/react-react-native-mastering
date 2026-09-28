Kullanıcıların gerçek Open Library verileri üzerinden kitap arayabildiği, seçilen eserin detayını inceleyebildiği ve kişisel bir okuma listesi oluşturup tarayıcıda kalıcı olarak saklayabildiği bağımsız bir kitap keşif ekranı kurman gerekiyor.

## Gereksinimler

`projects/atolye/src/okuma-listesi-tasarla/` dizini altında şu işlevleri içeren bir ekran inşa et:

- **Kitap Arama:** Gerçek Open Library `/search.json` uç noktası üzerinden arama yapabilmeli ve sonuçlar kitap başlıklarıyla listelenmelidir.
- **Eser Detayı:** Listeden bir kitaba tıklandığında `/works/{id}.json` üzerinden eserin gerçek detayları ve açıklaması görüntülenmelidir.
- **Kişisel Okuma Listesi:** Kullanıcı bir kitabı okuma listesine ekleyebilmeli ve listeden çıkarabilmelidir.
- **Yerel Kalıcılık:** Sayfa yenilendiğinde kullanıcının okuma listesi korunmalıdır.
- **Paylaşılabilir Adres:** Arama sorgusu ve seçili açık eser adres çubuğunda paylaşılabilir bağlantı olarak tutulmalıdır.
- **Durum Bildirimleri:** Arama sonucu bulunamadığında veya ağ isteği hata verdiğinde kullanıcıya anlaşılır bir durum mesajı gösterilmelidir.
- **Mimari Sorumluluk:** Sunucu verisi, kalıcı okuma listesi ve geçici ekran etkileşimleri ayrı katmanlarda yönetilmelidir.

## Örnek

Kullanıcı "Frank Herbert" arar → Sonuç listesinden "Dune" seçer → Eser detayları açılır → "Okuma listeme ekle" butonuna tıklar → Sayfayı yeniler → Okuma listesinde "Dune" kaydının yerinde durduğunu görür.

## Sözleşme

- Proje çalışma konumu: `projects/atolye/src/okuma-listesi-tasarla/`
- Uygulama rotası: `projects/atolye` ana navigasyonundan bu ekrana erişilebilmelidir.
- Değerlendirme yöntemi: Görev sayfasındaki **“AI review prompt'unu kopyala”** düğmesiyle rubric kriterleri üzerinden denetim yapılır.

## Kısıtlar

- Okuma listesi geçici state'te unutulmamalı; tarayıcı depolamasıyla senkronize edilmelidir.
