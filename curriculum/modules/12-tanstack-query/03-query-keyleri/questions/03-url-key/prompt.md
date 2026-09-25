Arama URL’si paylaşılabilir ama key `q` ve `page` ile aynı veri kimliğini taşımalı.

## İstenen

`searchKey(params)` fonksiyonu `['movies', 'search', query, page]` döndürsün.

- `q` yoksa boş string; varsa baş/son boşluğunu sil.
- `page` pozitif tam sayı değilse 1 kullan.
- URL’deki `q=Dövüş&page=2` için key’in son iki öğesi `'Dövüş'` ve `2` olmalı.
