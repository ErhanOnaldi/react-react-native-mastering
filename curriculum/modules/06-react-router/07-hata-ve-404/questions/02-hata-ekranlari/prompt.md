Tanınmayan adres ve geçerli sayfa çalışırken oluşan hata kullanıcıya ayrı, anlaşılır ekranlar göstermeli.

## Gereksinimler

- Bilinmeyen adres için `Sayfa bulunamadı` başlığı ve `/` adresine giden `Ana sayfaya dön` linki göster.
- Route hatasında ekran `role="alert"` taşısın ve dönüş linki içersin.
- Router response status'u 404 ise `Sayfa bulunamadı` başlığını göster.
- Diğer hata türlerinde `Bir şeyler ters gitti` başlığını göster; teknik hata metnini kullanıcıya yazma.

## Örnek

Tanımsız `/hic-yok` → 404 başlığı; hata veren `/broken` → genel hata başlığı ve dönüş linki.

## Sözleşme

- `RouteScreens.tsx` içinden `NotFoundPage` ve `RouteError` named export edilir.
- Ekranlar sırasıyla wildcard route'un normal içeriği ve route hata ekranı olarak kullanılır.
