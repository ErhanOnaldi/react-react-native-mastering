Film kataloğunda `I` ve `İ` içeren başlıklar aramada yanlış eşleşiyor, başlık sırası da Türk alfabesine uymuyor. İki davranışı düzelten yardımcıyı yaz.

## Gereksinimler
- Verilen başlıkları sorguyla Türkçe büyük/küçük harf kurallarını gözeterek eşleştir.
- Sorgunun başındaki ve sonundaki boşlukları yok say.
- Sonuçları Türk alfabesine göre artan sırada döndür.
- Kaynak diziyi değiştirme.

## Örnek
`['Şule', 'İpek', 'Çetin', 'Işık']` başlıklarını boş sorguyla işlerken sıra `Çetin`, `Işık`, `İpek`, `Şule` olur. `"ipek"` sorgusu `İpek` kaydını bulur.

## Sözleşme
- Dosya ve export: `localizedMovies.ts` içinden `sortAndFilterMovies(movies, query)`.
- Film biçimi: `{ title: string; id: number }`.
- Dönüş değeri aynı biçimdeki yeni bir film dizisidir.
