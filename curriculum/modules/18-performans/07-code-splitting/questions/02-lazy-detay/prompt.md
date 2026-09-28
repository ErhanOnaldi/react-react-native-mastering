Film detay sayfasında yer alan büyük oyuncu paneli ana sayfa yüklemesine dahil edilmemeli; yalnızca detay sayfası açıldığında dinamik olarak indirilmelidir.

## Gereksinimler
- Sayfanın ana başlığı ("Film detayı") anında ekranda görünmelidir.
- Ağır oyuncu bileşeni (`CastPanel.tsx`) ana sayfa açılırken indirilmemeli; film detayına girildiğinde yüklenmelidir.
- Oyuncu paneli yüklenirken ekranda `Oyuncular yükleniyor` metni görünmelidir.
- Yükleme tamamlandığında oyuncu paneli içeriği ("Dövüş Kulübü oyuncuları") ekrana yansımalıdır.

## Örnek
Kullanıcı detay sayfasına girdiğinde "Film detayı" başlığını ve "Oyuncular yükleniyor" mesajını görür; ağdan oyuncu modülü indiğinde ise oyuncu listesi belirir.

## Sözleşme
- Dosya ve export: `MovieDetails.tsx` → `MovieDetails()`
- Yardımcı dosya: `./CastPanel.tsx` (varsayılan export: `CastPanel()`)
- Arayüz: `heading` rolünde "Film detayı", "Oyuncular yükleniyor" bekleme metni, "Dövüş Kulübü oyuncuları" içerik metni.
