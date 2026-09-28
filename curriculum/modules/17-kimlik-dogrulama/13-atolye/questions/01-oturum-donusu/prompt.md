Kullanıcı normal şekilde giriş yaptığında profil doğru görüntüleniyor. Ancak tarayıcıda zaten kayıtlı geçerli bir oturum belirteci varken (örneğin sayfa yenilendiğinde) ekran profile ulaşamıyor ve giriş formunda kalıyor. Ayrıca ağ günlüğü incelendiğinde profil isteğinin mükerrer şekilde **iki kez** atıldığı görülüyor.

## Gereksinimler

- Bileşene başlangıçta geçerli bir oturum belirteci iletildiğinde profil otomatik olarak yüklenmeli ve kullanıcı adı ekranda gösterilmelidir.
- Normal giriş formundan kullanıcı adı ve şifre girildiğinde profil başarıyla açılmalıdır.
- Hem başlangıç belirteciyle yüklemede hem de form üzerinden girişte profil alma isteği sunucuya **yalnızca bir kez** gönderilmelidir.

## Örnek

| Durum | Beklenen Davranış |
| --- | --- |
| `initialToken` ile açılış | Otomatik olarak `"Merhaba, emilys"` metni görünür, ağda tam 1 profil isteği atılır. |
| Form üzerinden giriş (`emilys` / `emilyspass`) | `"Merhaba, emilys"` metni görünür, ağda tam 1 profil isteği atılır. |

## Sözleşme

- `ProfileGate.tsx` dosyasından `ProfileGate` bileşenini named export et.
- Props sözleşmesi:
  - `initialToken?: string | null`
- Arayüz öğeleri:
  - Kullanıcı adı alanı: `Kullanıcı adı` etiketine sahip input
  - Şifre alanı: `Şifre` etiketine sahip input
  - Gönderim düğmesi: `Giriş yap` adında buton
  - Başarılı görünüm: `"Merhaba, <username>"` metni
