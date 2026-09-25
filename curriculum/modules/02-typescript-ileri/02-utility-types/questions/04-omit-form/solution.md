## Neden böyle?

- **Alternatif:** Taslak için tüm alanları yeniden yazmak yerine sunucunun ürettiği alanları `Omit` ile çıkarırsın.
- **Tuzak:** `Partial` yalnız tipi değiştirir; güncelleme için `{ ...draft, ...patch }` ile yeni nesne gerekir.
- **Sektörde:** Yama nesneleri formlarda ve API güncellemelerinde yaygındır.
- **Sonraki adım:** React modülünde aynı immutable güncellemeyi state üzerinde yapacaksın.
