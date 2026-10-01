Liste adı zorunlu olsun; açıklama boş bırakılabilsin ama 120 karakteri aşmasın.

## Gereksinimler

- “Liste adı” ve “Açıklama” etiketli alanlarını göster.
- Boş adda “Ad gerekli” mesajı göster ve kayıt yapma.
- Boş açıklamayı kabul et; submit değerinde boş string olarak ilet.
- 120 karakterlik açıklamayı kabul et; 121 karakterlik açıklamada “Açıklama en çok 120 karakter” mesajı göster ve kayıt yapma.
- Ad ve açıklama hatalarını kendi alanlarının mesajı olarak göster; her input geçersizliğini belirtip kendi hata mesajına bağlansın. Mesajlar `role="alert"` ile bulunabilsin.
- Geçerli submit'te `{ name, description }` gönder.

## Örnek

`name: Akşam`, açıklama boş → `{ name: 'Akşam', description: '' }`; 121 karakter açıklama → hata, callback çağrılmaz.

## Sözleşme

- Dosya ve export: `DescriptionForm.tsx` → named export `DescriptionForm`.
- Prop: `onSave(values: { name: string; description: string }): void`.
- Arayüz: iki alanın label'ı yukarıdaki adlarla olsun; her hata id'si ilgili input'un `aria-describedby` değerinde, hata durumunda input'ta `aria-invalid="true"` olsun.
