Liste adı hatası oluştuğunda, hata mesajını alanla programatik olarak ilişkilendir ve geçerli değerlerin gönderilmesini sağla.

## Gereksinimler

- “Liste adı” için görünür, textbox'a bağlı label göster.
- Boş submit'te input `aria-invalid="true"` taşısın.
- “Ad gerekli” mesajını görünür göster; mesajın `id` değeri input'un `aria-describedby` değeriyle aynı olsun.
- Geçerli bir adla callback çağrılsın.

## Örnek

Boş submit → input geçersiz ve “Ad gerekli” açıklamasına bağlı. `Akşam` yazıp submit → callback'e `{ name: 'Akşam' }` gider.

## Sözleşme

- Dosya ve export: `AccessibleNameForm.tsx` → named export `AccessibleNameForm`.
- Prop: `onSave(values: { name: string }): void`.
- Arayüz: textbox erişilebilir adı “Liste adı”, hata `role="alert"` ile bulunabilir.
