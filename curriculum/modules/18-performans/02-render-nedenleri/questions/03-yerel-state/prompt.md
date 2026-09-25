## Durum
Arama alanındaki yazı değişiyor; sonuç paneli henüz sorguya bağlı değil. Buna rağmen onun render sayacı artıyor.

## Yap
- `SearchShell` içindeki controlled inputu koru.
- `onResultsRender` yalnız sonuç paneli gerçekten render edildiğinde çağrılsın.
- Arama yazısı değiştiğinde sonuç panelinin render sayısı değişmesin.

Bu ilk daraltma örneği. Sonraki derste sonuçlar gerçekten sorguya bağlı olunca memo sınırını yeniden değerlendireceğiz.
