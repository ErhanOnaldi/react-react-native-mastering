Gerçek Open Library verisiyle kitap arama ve yazar odaklı keşif ekranı kurman, veri sınırına dair iki uygulanabilir seçenek arasından birini seçerek gerekçesini kısa bir mimari karar notunda belgelemen gerekiyor.

## Gereksinimler

`projects/atolye/src/kitaplik-kararlarini-kaydet/` dizini altında şu özellikleri hayata geçir:

- **Kitap Arama ve Yazar Keşfi:** Gerçek Open Library verisiyle arama yapılabilmeli, arama sonucundaki bir yazara tıklandığında o yazarın diğer eserleri listelenebilmelidir.
- **Erişilebilirlik ve Durum Yönetimi:** Arama ve yazar geçişleri klavye ile (Tab, Enter) rahatça kullanılabilmeli; sonuç bulunamadığında veya istek başarısız olduğunda kullanıcıya net bir geri bildirim verilmelidir.
- **Mimari Karar Belgesi:** `src/kitaplik-kararlarini-kaydet/KARAR.md` dosyasında şu iki uygulanabilir mimari seçenek değerlendirilmelidir:
  1. *Arama sonucunda gelen özet yazar verisini doğrudan kullanmak* (minimum ağ isteği, sınırlı yazar bilgisi).
  2. *Yazarın bağımsız API uç noktasına (`/authors/{id}.json`) giderek tam veri çekmek* (zengin yazar görünümü, ek istek ve bakım maliyeti).
- **Gerekçelendirme:** Seçtiğin seçeneğin neden tercih edildiği ve kabul edilen bakım/maliyet ödünleşimi 2–3 cümlede açıkça yazılmalıdır.

## Örnek

Kullanıcı "Dostoyevski" arar → Eser listesinden yazara tıklar → Yazarın diğer kitapları görüntülenir. `KARAR.md` dosyasında: "Yazar detayları için ayrı istek atma kararı alındı; ek ağ gecikmesi kabul edildi çünkü kullanıcıya yazarın tüm bibliyografyasını sunmak temel ürün değeridir." gerekçesi yer alır.

## Sözleşme

- Proje çalışma konumu: `projects/atolye/src/kitaplik-kararlarini-kaydet/`
- Karar dosyası: `projects/atolye/src/kitaplik-kararlarini-kaydet/KARAR.md`
- Değerlendirme yöntemi: Görev sayfasındaki **“AI review prompt'unu kopyala”** düğmesiyle rubric kriterleri üzerinden denetim yapılır.

## Kısıtlar

- Karar notunda yalnızca seçilen yöntem değil, elenen alternatif ve kabul edilen bakım maliyeti de bulunmalıdır.
