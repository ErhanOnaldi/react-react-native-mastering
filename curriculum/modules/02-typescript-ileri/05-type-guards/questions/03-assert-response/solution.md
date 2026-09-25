## Neden böyle?

- **Alternatif:** Boolean guard da kullanılabilir; assertion geçersiz cevabı anında hata olarak durdurur.
- **Tuzak:** `asserts` yazıp gövdede kontrol yapmamak TypeScript’e yanlış söz vermektir.
- **Sektörde:** API sınırlarında açıklayıcı hata, sonradan gelen `map is not a function` hatasından daha yararlıdır.
- **Sonraki adım:** Bu uzun elle kontrol, Zod şemalarının neden yararlı olduğunu gösterecek.
