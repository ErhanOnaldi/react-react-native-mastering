## Durum
Sanal liste DOM'u küçülttü ama filtre değişince eski indeksler yeni filmlerle karışabiliyor.

## Yap
- `query` değerine göre Türkçe duyarlı başlık filtresi uygula.
- Virtualizer `count` değerini **filtrelenmiş** listeye bağla.
- Satır `key` değerini film id'sinden üret.
- 500 filmde 30'dan az gerçek DOM satırı, tek sonuçta tek satır olsun.

Bu görevde `query` prop'u zaten arama sayfasında deferred olabilir.
