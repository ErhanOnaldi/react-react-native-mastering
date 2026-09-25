Sinema izleme listesi kaydında `id` ve `createdAt` sistem tarafından eklenir. `watchlistSchema` ile `newWatchlistSchema` export et.

- Tam şema: `id` ve `createdAt` string; `name` boş olmayan string; `isPublic` boolean.
- Yeni liste şeması tam şemadan `.omit({ id: true, createdAt: true })` ile türesin.
- `publicWatchlistSchema` tam şemaya `.extend({ shareUrl: z.url() })` uygulasın.
- `watchlistTitleSchema` tam şemadan `.pick({ name: true })` ile türesin.
