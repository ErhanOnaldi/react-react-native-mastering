## Neden böyle?

`rejects.toMatchObject` async hatanın dışarıya verdiği alanları denetler. Senkron fonksiyonda `toThrow` kullanılır; Promise reddinde `await expect(promise).rejects.toThrow(...)` da geçerlidir. Burada hata alanlarını birlikte ölçmek için `toMatchObject` daha uygundur. HTTP status ile TMDB’nin `status_code` değeri ayrı şeylerdir. Bu ayrım sonraki modülde hata UI’sini test ederken gerekir.
