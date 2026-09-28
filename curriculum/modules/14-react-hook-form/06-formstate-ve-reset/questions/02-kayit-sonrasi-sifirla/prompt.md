Asenkron liste kaydında gereksiz submit'i engelle ve formu yalnız kayıt tamamlanınca temizle.

## Gereksinimler

- Form başlangıçta boştur; değişiklik yokken “Kaydet” düğmesi devre dışı olsun.
- Kullanıcı ad yazınca düğme etkinleşsin.
- `save` Promise'i sürerken düğme devre dışı ve adı “Kaydediliyor…” olsun.
- Kayıt başarıyla tamamlanınca alan boşalsın ve düğme yeniden devre dışı kalsın.
- Kayıt reddedilirse yazılan değer formda kalsın.

## Örnek

`Deneme` yaz → Kaydet → Promise beklerken düğme kapanır; hata ile reddedilirse input değeri `Deneme` kalır. Başarılı çözülürse alan boş olur.

## Sözleşme

- Dosya ve export: `ResettableForm.tsx` → named export `ResettableForm`.
- Prop: `save(values: { name: string }): Promise<void>`.
- Arayüz: “Liste adı” label'lı textbox; düğme adı normalde “Kaydet”, istek sürerken “Kaydediliyor…”.
