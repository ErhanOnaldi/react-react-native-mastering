Liste kaydı asenkron. Kullanıcı aynı listeyi yanlışlıkla iki kez göndermesin.

- Form temizken “Kaydet” devre dışı olsun.
- Yazınca etkinleşsin; istek sürerken “Kaydediliyor…” görünsün ve düğme kapansın.
- Başarılı kayıttan sonra input boşalsın, düğme tekrar kapansın.
- İstek hata verirse yazılan ad kalsın.

`save` prop'u Promise döndürür. Submit callback'inde onu `await` et.
