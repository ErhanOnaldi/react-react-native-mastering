Önizlemede 550 numaralı film açılınca istek sayacı hızla artıyor ve güvenlik sınırında duruyor. `MovieTitle` aynı film için başlığı göstermeli, fakat tek mount sırasında tekrar tekrar ağ isteği başlatmamalı.

## Gereksinimler

- 550 filmi için `Dövüş Kulübü` başlığı bir heading olarak görünür.
- Bir mount sırasında `/movie/550` adresine yalnızca 1 istek atılır.
- TMDB isteği `Authorization: Bearer ${import.meta.env.VITE_TMDB_TOKEN}` başlığıyla gider.
- Veri gelmeden önce kullanıcıya yüklenme metni gösterilebilir.

## Örnek

Önizlemeyi açtığında önce yüklenme durumu, cevap gelince `Dövüş Kulübü` başlığı görünür. Test sonucu `Beklenen: 1 istek` diyorsa aynı veri için fazladan istek atılmıştır.

## Sözleşme

- Dosya ve export: `MovieTitle.tsx` → `MovieTitle`
- Prop: `{ id: number }`
- Testlerin aradığı arayüz: `heading` rolünde `Dövüş Kulübü`

## Kısıtlar

- Gerçek ağ kullanılmaz; testlerde TMDB cevabı hazır MSW handler'larından gelir.
