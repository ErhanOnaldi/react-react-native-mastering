`MovieTitle`, aldığı film kimliğine ait başlığı göstermeli. Bileşen ekranda kaldığı sırada aynı kimlik için tekrar tekrar istek başlatmamalı.

## Gereksinimler

- 550 filmi için `Dövüş Kulübü` başlığı bir heading olarak görünür.
- Bir mount sırasında `/movie/550` adresine yalnızca 1 istek atılır.
- TMDB isteği `Authorization: Bearer ${import.meta.env.VITE_TMDB_TOKEN}` başlığıyla gider.
- Veri gelmeden önce `Yükleniyor…` metni görünür.

## Örnek

Önce `Yükleniyor…`, cevap geldikten sonra `Dövüş Kulübü` görünür.

## Sözleşme

- Dosya ve export: `MovieTitle.tsx` → `MovieTitle`
- Prop: `{ id: number }`
- İstek: `/3/movie/550`; `Authorization: Bearer ${import.meta.env.VITE_TMDB_TOKEN}` başlığı
- Arayüz: `heading` rolünde `Dövüş Kulübü`, cevap öncesinde `Yükleniyor…`

## Kısıtlar

- İstek TMDB'nin hazır test cevabını kullanır.
