## Neden böyle?
`memo` kartın sabit props'unu karşılaştırır; `useCallback` callback kimliğini sabit tutar. Callback burada yalnız `setFavorite` kullanır, bu yüzden boş dependency listesi güvenlidir. Film kimliği callback closure'ına gömülseydi her satır için yeni referans üretmek kolay olurdu. Compiler açıkken önce ölç ve otomatik optimizasyonu tercih et.
