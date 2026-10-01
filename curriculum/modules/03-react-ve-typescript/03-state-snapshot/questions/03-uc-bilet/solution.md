## Neden böyle?

Setter'a verilen updater fonksiyonları sırayla önceki sonuca eklenir: `0 → 1 → 2 → 3`. Handler'ın `count` değeri ise tıklama boyunca eski snapshot'tır; `setCount(count + 1)` satırlarını tekrarlamak tek artış üretirdi.
