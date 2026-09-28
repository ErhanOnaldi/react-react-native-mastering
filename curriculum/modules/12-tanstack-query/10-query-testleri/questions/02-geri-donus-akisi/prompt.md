Arama → detay → geri akışında aynı taze aramayı yeniden kullan; arama değişince yeni sonucu göster.

## Gereksinimler

- `query` prop’una ait film başlıklarını göster.
- `Detay` düğmesiyle `Detay sayfası` görünümünü, `Geri` düğmesiyle arama görünümünü aç.
- Aynı aramaya 60 saniye içinde geri dönünce ikinci arama GET’i gönderme.
- Prop’taki arama ifadesi değişince yeni sonuçları ve ayrı isteği göster.

## Örnek

`Dövüş` → `Dövüş Kulübü`; Detay → Geri → aynı başlık, toplam bir arama isteği. Prop `Matrix` olunca `Matrix` sonucu gelir.

## Sözleşme

- `SearchAgain.tsx` dosyasından `SearchAgain({ query }: { query: string })` named export edilir.
- Düğmelerin adları `Detay` ve `Geri`; detay görünümünde `Detay sayfası` metni bulunur.

## Kısıtlar

- Arama isteği TMDB `/3/search/movie` endpoint’ine `query` ve `language=tr-TR` parametrelerini, ayrıca `Authorization: Bearer test-token` başlığını gönderir.
