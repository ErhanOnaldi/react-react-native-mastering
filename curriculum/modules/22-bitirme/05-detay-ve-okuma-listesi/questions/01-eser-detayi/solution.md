Referans uygulama: `curriculum/checkpoints/kitaplik/22/src/features/books/`.

## Neden böyle?

- Eser sorgusunun key'i `workId` içerir. Bu, Sinema'da `id`'yi effect bağımlılığına eklemenin Query karşılığıdır. Kimlik değişince başka önbellek girdisi okunur.
- Ham cevap `schemas.ts` içinde doğrulanır. `description` union'ı tek bir açıklama metnine, `covers` dizisi geçerli kapak id'sine dönüştürülür. Bileşen, Open Library'nin iki farklı açıklama biçimini bilmez.
- Yazar ayrı bir kaynaktır; eser geldikten sonra anahtar belli olur. Referans çözümde yazar hatası kendi sınırında yakalanır. Eser 404'ü sayfayı bitirir, yazar 404'ü yalnız adın yerine “Yazar bilinmiyor” koyar.
- 500 için “Tekrar dene” yeni isteği tetikler. Sadece hata metnini gizlemek sorunu çözmez.

Alternatif olarak eser ve yazarı tek `queryFn` içinde sırayla çekebilirsin; yine de yazar hatasını yerel olarak yakalamalısın. İki query kullanırsan key'leri ayrı tut ve ikinciyi eser anahtarı gelene kadar kapalı tut. Sonraki görevde bu eser modeli okuma listesine girecek; tüm API cevabını `localStorage`'a kopyalama.
