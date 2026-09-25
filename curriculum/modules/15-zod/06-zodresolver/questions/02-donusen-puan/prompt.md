HTML number input da string üretir. `RatingForm({ onSave }: { onSave: (rating: number) => void })` named export bileşeni yaz.

- `rating` alanını `z.coerce.number().int().min(1).max(5)` ile doğrula.
- `useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>` kullan.
- `Puan` etiketli number input ve `Gönder` butonu göster.
- Geçerli değer `onSave`'e **number** olarak gider; aralık dışı değer için `role="alert"` göster.
