Sekiz state'li formun ilk iki alanını React Hook Form ile yeniden kur. `WatchlistValues`, domain tipindeki sunucu alanları çıkarılarak `Omit<Watchlist, 'id' | 'createdAt'>` ile türetilmiş durumda.

- “Liste adı” ve “Açıklama” input'larını `register` ile bağla.
- Submit'i `handleSubmit` üzerinden `onSave`'e geçir.
- Input'lar etiketli kalsın; `onSave` `{ name, description }` alsın.

Örnek: `Akşam`, `Kısa filmler` → `{ name: 'Akşam', description: 'Kısa filmler' }`.
