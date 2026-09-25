Sinema'da ad kuralı `register` içinde tekrar yazılmasın. `WatchlistForm({ onSave }: { onSave: (name: string) => void })` adlı named export bileşeni kur.

- `z.object({ name: z.string().trim().min(1, { error: "Ad gerekli" }) })` şemasını kullan.
- `useForm` için `zodResolver` bağla; input label'ı `Liste adı`, buton `Kaydet` olsun.
- Boş ad gönderilmez, hata `role="alert"` ile gösterilir; geçerli ad trimlenmiş olarak `onSave`'e gider.
