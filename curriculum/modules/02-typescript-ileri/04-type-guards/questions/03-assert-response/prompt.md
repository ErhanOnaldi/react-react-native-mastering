Liste cevabını kullanmadan önce sayfa numarasını ve her film öğesinin kimlik/başlık alanlarını doğrula.

## Gereksinimler

- Sayfa nesnesinde sayısal `page` ve dizi `results` olmalı.
- Her sonuç nesnesi sayısal `id` ve metinsel `title` taşımalı.
- Doğru biçimli giriş için fonksiyon `true`, diğer girişler için `false` dönmeli.

## Örnek

`{ page: 1, results: [{ id: 550, title: 'Dövüş Kulübü' }] }` için `true`; `results` yoksa `false` dön.

## Sözleşme

- Dosya: `task.ts`
- Export tipi: `MoviePage = { page: number; results: { id: number; title: string }[] }`.
- Export fonksiyon: `isMoviePage(value: unknown): value is MoviePage`.
