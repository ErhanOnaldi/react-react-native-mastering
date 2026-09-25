Bozuk liste yanıtında hangi alanın sorunlu olduğunu göster. `describeListError(raw: unknown): string | null` export et.

- `{ results: [{ title: "Matrix" }] }` için `null`.
- Sonuçların `title` alanı boş veya null ise Zod 4 `z.prettifyError` ile okunur hata döndür.
- Mesajda `results` ve `title` yolu görünsün.
