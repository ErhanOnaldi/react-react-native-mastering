Film arama sayfası sabit yerel liste yerine harici API üzerinden canlı arama yapmalı ve arama durumunu URL ile senkronize tutmalıdır. Arama rotasını canlı arama servisine bağla.

## Gereksinimler

- Arama terimi (`q`) ve sayfa numarası (`page`) doğrudan URL adresinden okunmalıdır.
- Arama kutusu (`textbox`, etiketi "ara") URL'deki güncel `q` değerini göstermeli; kullanıcı yazdıkça URL güncellenmelidir.
- Arama kutusuna yeni bir terim yazıldığında veya silindiğinde eski sayfa numarası (`page`) URL'den kaldırılmalı; varsa diğer parametreler (ör. `genre`) korunmalıdır.
- Arama terimi boş veya yalnızca boşluklardan ibaret olduğunda harici API'ye istek atılmamalı; arama yapılmasını öneren bir yönlendirme mesajı ("...aramak için...") gösterilmelidir.
- Kullanıcı yazarken her tuş vuruşunda ağ isteği tetiklenmemeli; belirli bir gecikme (yaklaşık 350 ms) sonrasında canlı film arama isteği gönderilmelidir.
- Arama sonuçları Türkçe başlıklarla film ızgarasında (`MovieGrid`) listelenmeli; yükleme, hata ve sonuç bulunamadı durumları ayrı ele alınmalıdır.

## Örnek

- Kullanıcı `/search?q=Başlangıç` adresini açtığında arama kutusunda `Başlangıç` yazar ve ekranda Türkçe "Başlangıç" filmi listelenir.
- Kullanıcı `/search` adresine girdiğinde API isteği atılmaz ve ekranda "Aramak için bir film adı yazın" yönlendirmesi görünür.
- Kullanıcı arama kutusundaki metni temizlediğinde URL'deki `page` parametresi silinir.

## Sözleşme

- Dosya ve export: `src/pages/SearchPage.tsx` → `SearchPage` (named export)
- Rota: `src/router.tsx` dosyasında `/search` rotasını karşılamalıdır.
- Arama kutusu: `role="textbox"` ve erişilebilir adı `/ara/i` ile eşleşen girdi alanı.
- Boş arama metni: `/aramak için/i` kalıbıyla eşleşen bilgilendirme mesajı.
- İstek: `/search/movie` (Türkçe dil tercihi, `query` ve `page` parametreleriyle).
