Statik Sinema ekranında arama sonuçları ve favoriler bir arada çalışmalı. Filtrelenen filmler tekrar göründüğünde seçilmiş favoriler korunmalıdır.

## Gereksinimler

- Sayfa başlığı “Sinema” görünür olmalıdır.
- “Film ara” alanı yazılan sorguyu başlığa göre filtrelemelidir; karşılaştırma büyük/küçük harfe duyarsız olmalı ve sorgunun baş/son boşluklarını yok saymalıdır.
- Favoriye ekleme ve çıkarma düğmenin `aria-pressed` değerini güncellemelidir.
- Bir film arama nedeniyle gizlenip geri geldiğinde favori durumu korunmalıdır.
- Bir filmin favorisini değiştirmek diğer filmlerin durumunu etkilememelidir.
- Arama eşleşmesi yoksa “Film bulunamadı” görünmelidir.
- Bu ekran API isteği yapmamalıdır.

## Örnek

Dövüş Kulübü'nü favorile → “Matrix” ara → aramayı temizle → Dövüş Kulübü hâlâ favoridedir. Aynı düğmeye yeniden basınca favori kalkar.

## Sözleşme

- `src/App.tsx` → default export `App`.
- Önceki görevdeki `sampleMovies`, `MovieGrid` ve `SearchBox` bileşenleri kullanılabilir.
- Arayüz: “Film ara” textbox'ı, başlıkları görünen kartlar ve favori durumunu açıklayan button'lar.
