Düzenleme penceresi seçili kaydın güncel değerlerini göstersin. Kayıt pencere açıkken değişirse yeni kayda geç; geçersiz bilgiyle kaydetmeye çalışma.

## Gereksinimler
- `record` içindeki ad ve e-posta başlangıç alanlarında görünsün.
- Pencere açıkken farklı kayıt geldiğinde iki alan da yeni kaydın değerlerine güncellensin.
- Ad boşsa ya da e-posta geçersiz biçimdeyse okunabilir hata göster; `onSave` çağrılmasın ve focus sorunlu alana gitsin.
- Geçerli giriş `onSave` callback'ine güncel id, ad ve e-posta ile verilsin.
- Başarılı kayıttan sonra `onOpenChange(false)` çağrılsın.

## Örnek
Ada'nın kaydı açıkken Grace seçilirse, pencere açık kalır ve Grace'in adıyla e-postasını gösterir.

## Sözleşme
- `EditDialog.tsx` → named export `EditDialog`, `EditDialogRecord` tipi.
- Props: `open`, `record`, `onOpenChange`, `onSave`.
- Alan adları `Ad` ve `E-posta`; gönder düğmesi `Kaydet`; hata erişilebilir `alert` rolüyle sunulur.
