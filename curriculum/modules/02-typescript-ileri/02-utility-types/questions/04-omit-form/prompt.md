Yeni film taslağında sunucunun atadığı alanlar bulunmuyor. Kısmi güncelleme, gönderilmeyen alanları korumalı ve yeni bir nesne üretmeli.

## Gereksinimler

- Taslakta `id`, `vote_average` ve `vote_count` bulunmamalı.
- Patch içindeki her taslak alanı isteğe bağlı olmalı.
- Patch yalnız verilen alanları değiştirmeli; `null` kapak yolu geçerli bir değerdir.
- Girdi nesnesi değiştirilmemeli.

## Örnek

`draft.poster_path = '/old.jpg'` ve patch `{ overview: 'Yeni özet', poster_path: null }` ise yeni nesnede bu iki güncelleme bulunur; diğer alanlar korunur, `draft` aynı kalır.

## Sözleşme

- Dosya: `task.ts`
- Export tipleri: `Movie`, `MovieDraft`, `MovieDraftPatch`.
- Export fonksiyon: `applyDraftPatch(draft: MovieDraft, patch: MovieDraftPatch): MovieDraft`.
