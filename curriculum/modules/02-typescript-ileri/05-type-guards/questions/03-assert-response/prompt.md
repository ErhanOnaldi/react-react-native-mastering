Liste cevabı kullanılmadan önce sayfa numarası ve her film öğesinin kimlik/başlık alanları doğrulanmalı. Geçersiz cevap, açıklayıcı bir hata ile durdurulmalı.

## Gereksinimler

- Sayfa nesnesinde sayısal `page` ve dizi `results` olmalı.
- Her sonuç nesnesi sayısal `id` ve metinsel `title` taşımalı.
- Doğru biçimli giriş normal dönmeli ve TypeScript'te `MoviePage` olarak daralmalı.
- Yanlış biçimli giriş `Error('Geçersiz film sayfası')` fırlatmalı.

## Örnek

`{ page: 1, results: [{ id: 550, title: 'Dövüş Kulübü' }] }` geçerlidir. `results` yoksa hata fırlatılır.

## Sözleşme

- Dosya: `task.ts`
- Export tipi: `MoviePage = { page: number; results: { id: number; title: string }[] }`.
- Export fonksiyon: `assertMoviePage(value: unknown): asserts value is MoviePage`.
