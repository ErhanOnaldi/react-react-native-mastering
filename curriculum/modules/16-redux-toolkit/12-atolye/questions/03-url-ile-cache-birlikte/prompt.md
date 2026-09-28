Film aramasında adres bağlantısı arama metni ve sayfayı yeniden açmalı; geçmişteki aramaya dönünce daha önce yüklenen sonuç hızlıca görünmeli.

## Gereksinimler

- Arama metni ve sayfa numarası URL’de tutulur; metin değişince sayfa 1’e döner.
- Sonuçlar TMDB'den gelir; yükleme ve hata durumları okunabilir olmalı.
- Geri/ileri ile daha önce görülmüş arama sonucu hemen görünür; kısa süre içinde aynı arama yeniden ağdan istenmez.

## Örnek

`?q=Matrix&page=1` → `?q=Dövüş&page=1` → geri: Matrix sonucu yeniden görünür ve ikinci Matrix isteği atılmaz.

## Sözleşme

- Dosya ve export: `MovieSearchPage.tsx` → `MovieSearchPage`
- Sayfa arasında gezinmek için `Sonraki sayfa` ve `Önceki sayfa` düğmeleri bulunsun.
