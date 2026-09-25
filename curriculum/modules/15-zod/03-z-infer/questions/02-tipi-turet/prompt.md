İzleme listesi adı ve görünürlüğü tek kaynaktan gelsin. `watchlistSchema`, `WatchlistValues` tipi ve `createWatchlist(raw: unknown): WatchlistValues` export et.

- `name`: trim sonrası en az 1 karakter.
- `isPublic`: boolean.
- Tipi `z.infer<typeof watchlistSchema>` ile üret.
- Eksik veya geçersiz değer parse sırasında kalsın.
