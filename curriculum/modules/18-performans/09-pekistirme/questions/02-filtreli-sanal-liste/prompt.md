## Durum
Sanal liste DOM'u küçülttü ama filtre değişince eski indeksler yeni filmlerle karışabiliyor.

## Yap
- `query` değerine göre Türkçe duyarlı başlık filtresi uygula.
- Görünen satırlar yalnız filtrelenmiş filmlerden gelsin; sorgu değişince eski satırlar kalmasın.
- Satır kimliği film id'si olsun.
- 500 filmde 30'dan az gerçek DOM satırı, tek sonuçta tek satır olsun.

Bu görevde `query` prop'u zaten arama sayfasında deferred olabilir.
