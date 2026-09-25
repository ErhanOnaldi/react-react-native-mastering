## Neden böyle?

- **Alternatif:** İki ayrı sayfa tipi yazmak, ortak alanları her değişiklikte iki kez güncellemeyi gerektirirdi.
- **Tuzak:** `Paginated<any>` öğe tipini siler; boş sayfada ilk öğe de bulunmaz.
- **Sektörde:** Sayfalı API cevaplarında generic kabuk yaygın bir ortak sözleşmedir.
- **Sonraki adım:** Sonraki görevde aynı kabuğu ID kısıtlı aramayla birleştireceksin.
