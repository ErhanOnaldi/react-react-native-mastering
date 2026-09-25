Refactor sırasında ikinci sayfa ilk sayfayı tekrar gösterdi. `@impl/pageSlice` doğru sayfalama yardımcısı; `pageSlice(items, page, pageSize)` için test yaz.

- 1–41 arası film id’lerinden liste kur.
- 20’lik sayfalarda ikinci sayfanın **ilk id’sini** ölç.
- Kısmi son sayfanın **içeriğini ve uzunluğunu** ölç.
- İstersen `it.each` ile iki sayfayı ayrı satırlar olarak göster.

| Sayfa | Beklenen id’ler |
| --- | --- |
| 2 | 21–40 |
| 3 | 41 |

Sadece “liste boş değil” demek yanlış offset’i yakalamaz.
