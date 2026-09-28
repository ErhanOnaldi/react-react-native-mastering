Kullanıcıların oturum açabilmesi için girdileri denetleyen, boş gönderimleri engelleyen ve kimlik doğrulama hatalarını erişilebilir biçimde duyuran bir giriş formu bileşeni oluştur.

## Gereksinimler

- Formda etiketlenmiş kullanıcı adı ve parola giriş alanları ile bir gönderim düğmesi bulunmalıdır.
- Alanlardan herhangi biri boş bırakılarak form gönderildiğinde oturum açma işlemi tetiklenmemeli ve alan bazında en az bir hata uyarısı gösterilmelidir.
- Tüm alanlar doldurulduğunda oturum açma eylemi kullanıcı adı ve parola değerleriyle tetiklenmelidir.
- Oturum açma işlemi başarısız olduğunda veya sunucu hata fırlattığında, dönen hata mesajı form üzerinde genel bir uyarı olarak gösterilmelidir.
- Parola metni hata mesajlarında asla açıkça gösterilmemelidir.

## Örnek

| Eylem | Beklenen Davranış |
| --- | --- |
| Boş formda "Giriş yap" tıklaması | İstek tetiklenmez, ekranda en az bir `alert` görünür. |
| Kullanıcı adı "emilys", parola "emilyspass" | Oturum açma eylemi `{ username: 'emilys', password: 'emilyspass' }` ile çağrılır. |
| Oturum açma "Invalid credentials" hatası döndürür | Formda genel hata uyarısı (`alert`) içinde "Invalid credentials" belirir. |

## Sözleşme

- `LoginForm.tsx` dosyasından `LoginForm` bileşenini named export et.
- Props sözleşmesi:
  - `onLogin: (credentials: { username: string; password: string }) => Promise<void> | void`
- Arayüz öğeleri:
  - Kullanıcı adı alanı: `Kullanıcı adı` erişilebilir adına sahip textbox (`getByRole('textbox', { name: 'Kullanıcı adı' })` veya `getByLabelText('Kullanıcı adı')`)
  - Parola alanı: `Parola` etiketine sahip şifre alanı (`getByLabelText('Parola')`)
  - Gönderim düğmesi: `Giriş yap` adında buton (`getByRole('button', { name: 'Giriş yap' })`)
  - Hata uyarıları: `role="alert"` özniteliğine sahip bildirim kutuları
