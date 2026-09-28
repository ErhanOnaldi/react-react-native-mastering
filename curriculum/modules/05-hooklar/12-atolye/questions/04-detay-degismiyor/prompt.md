Önizlemede önce 550 numaralı `Dövüş Kulübü` açılıyor. `Başlangıç'a geç` düğmesine basınca aynı sayfa açık kalıyor; film kimliği değiştiği halde detay eski filmde takılı kalıyor. `MovieDetail` her kimlik için doğru detayı göstermeli.

## Gereksinimler

- İlk `id={550}` render'ında `Dövüş Kulübü` heading olarak görünür.
- Aynı bileşen `id={27205}` ile yeniden render edilince `/movie/27205` isteği atılır.
- Yeni detay beklenirken eski film başlığı görünmez; yüklenme metni gösterilir.
- Yeni cevap gelince `Başlangıç` heading olarak görünür.
- 550'ye geri dönüldüğünde tekrar 550 isteği atılır ve `Dövüş Kulübü` görünür.

## Örnek

550 → `Dövüş Kulübü`; 27205'e geç → `Yükleniyor`; cevap sonrası → `Başlangıç`; 550'ye dön → `Dövüş Kulübü`.

## Sözleşme

- Dosya ve export: `MovieDetail.tsx` → `MovieDetail`
- Prop: `{ id: number }`
- Testler heading rolünü film adlarıyla, yüklenme metnini `Yükleniyor` olarak arar.

## Kısıtlar

- TMDB yetkilendirme başlığını koru.
