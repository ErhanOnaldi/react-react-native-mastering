Sinema'da sekiz alanlı “İzleme listesi oluştur” formunu önce bildiğin controlled input yöntemiyle tamamla. Önizlemede **Render sayısı** başlangıcını gör, “Liste adı”na harf yaz ve sayının arttığını gözle.

- Sekiz alanın tamamı controlled input olarak kalsın.
- Boş ad için “Liste adı gerekli”, 3 karakterden kısa ad için “Liste adı en az 3 karakter olmalı”, boş ilk film için “İlk film gerekli” göster.
- Geçerli submit'te `onSave` fonksiyonuna sekiz alanı içeren `WatchlistDraft` ver; hata varsa çağırma.
- Render sayacı önizlemede görünür kalsın. Test başlangıç sayısını sabitlemez; yazmadan sonraki artışı ölçer.

Örnek: ad `Akşam`, ilk film `Dövüş Kulübü` → kaydet; boş ad → hata.
