---
title: "Yenilemede oturum neden kaybolur?"
minutes: 14
kind: concept
---

# Yenilemede oturum neden kaybolur?

Sinema'ya giriş yaptın ve access token'ı Redux store'da tuttun. Profil ekranı çalışıyor; sonra tarayıcıda F5'e bastın. Uygulama yeniden açıldığında store başlangıç değerleriyle kuruldu ve token ortada yok. Bu beklenen bir sonuç: Redux store JavaScript belleğindedir, tarayıcı depolaması değildir.

Buradaki karar, token'ın sayfa yenilendikten sonra da bulunmasını isteyip istemediğindir. Önce token'ı nerede tuttuğumuzu ve her seçimin ne kadar yaşayacağını küçük örneklerle izleyelim.

## Bellekte tutulan değer

Basit bir React state'i düşün:

```tsx check
import { useState } from 'react'

export function SessionLabel() {
  const [token, setToken] = useState<string | null>(null)

  return <p>{token ? 'Oturum açık' : 'Giriş gerekli'}</p>
}
```

Bu bileşen ilk açıldığında `token` null'dır. Token'ı state'e koyarsan ekranda oturum açılmış görünür; fakat sayfa yenilemesi JavaScript programını baştan başlatır. State yeniden başlangıç değerini alır. React state'i ve Redux store'u bu anlamda **bellek içi** saklamadır: uygulama çalıştığı sürece durur, sayfanın yeniden başlamasını tek başına aşamaz.

Şimdi aynı token'ı `localStorage` adlı tarayıcı depolamasına yazalım. `localStorage`, sayfa yenilense de aynı site için değerleri saklar:

```ts check
const sessionKey = 'sinema-access-token'

function saveAccessToken(token: string) {
  localStorage.setItem(sessionKey, token)
}

function readAccessToken(): string | null {
  return localStorage.getItem(sessionKey)
}
```

`saveAccessToken` çağrısından sonra F5 yapsan bile `readAccessToken()` aynı site açıldığında kayıtlı dizgiyi bulabilir. Tarayıcı bunu Redux'a kendiliğinden kopyalamaz; uygulama açılırken depodan okuyup state'e aktaran kodu sen yazmalısın. JWT olması bu davranışı değiştirmez: JWT token'ın biçimini anlatır, nerede tutulacağını değil.

### Açılışta geri okuma

Üçüncü örnekte depodaki token'ı okuyup uygulama state'inin başlangıç değeri olarak kullanalım:

```tsx check
import { useState } from 'react'

const sessionKey = 'sinema-access-token'

export function SessionLabel() {
  const [token] = useState(() => localStorage.getItem(sessionKey))

  return <p>{token ? 'Kayıtlı oturum bulundu' : 'Giriş gerekli'}</p>
}
```

Fark şu: önceki örnekte değer yalnızca bellekteydi; şimdi ilk render sırasında uygulama `localStorage`'ı okuyup başlangıç değerini oradan alıyor. Bu açık geri yükleme adımı olmadan kalıcı kayıt ekranda otomatik olarak görünmez. Ayrıca depoda bir dizginin bulunması, sunucunun token'ı hâlâ kabul edeceğini kanıtlamaz; gerçek API isteği başarısız olabilir.

Tarayıcı yenilendiğinde olanları sırayla inceleyelim:

| Sıra | Olay | Redux / React state | `localStorage` |
| --- | --- | --- | --- |
| 1 | Giriş başarılı, token belleğe ve depoya yazıldı | Token var | Token var |
| 2 | F5 ile sayfa kapanıp yeniden açılır | Eski store yok olur | Kayıt durur |
| 3 | Uygulama başlangıçta açılır | Yeni başlangıç state'i kurulur | Eski token okunabilir |
| 4 | Uygulama token'ı başlangıç state'ine aktarır | Token tekrar bellekte | Kayıt durur |
| 5 | Profil API isteği yapılır | Token istek için kullanılabilir | Hâlâ kayıtlı |

Bu tablo, iki saklama yerinin farklı iş yaptığını gösteriyor. Depo yenilemeler arasında kaydı korur; store uygulama çalışırken arayüzün kullandığı durumu taşır. İkisini eşitlemek uygulama kodunun sorumluluğudur.

## Kalıcılığın bir güvenlik bedeli var

`localStorage`'a aynı sitede çalışan JavaScript erişebilir. Bu yüzden bir saldırgan sayfaya kötü amaçlı script çalıştırmayı başarırsa, token'ı okuyabilir. Bu tür script çalıştırma açığına XSS denir; ayrıntısını bu modülün sonraki XSS dersinde göreceksin. Bu tek cümleyi şimdilik hatırla: F5 sonrası rahatlık, tarayıcı kodunun token'a erişebilmesi pahasına gelir.

Sunucunun `HttpOnly` ayarıyla oluşturduğu cookie farklı davranır. Cookie, tarayıcı tarafından saklanıp isteklere eklenebilir; `HttpOnly` ise JavaScript'in cookie değerini okumasını engeller. Bu, XSS sırasında token metninin çalınmasını zorlaştırır. Cookie'nin otomatik istekle gönderilmesi başka bir risk doğurur; CSRF savunmasını ilgili derste ele alacağız.

Sinema bu modülde harici DummyJSON API'siyle çalışıyor; uygulama bu sunucuda kendi alan adı için `HttpOnly` cookie ayarlayamıyor. Bu nedenle örnek projede `localStorage` ile kalıcılık seçilebilir. Bu seçim “en güvenlisi budur” demek değildir; kullanıcının yenilemede oturumunu kaybetmemesi ile token'ın tarayıcı JavaScript'ine açık olması arasındaki ödünleşimdir.

![Token saklama seçenekleri: bellek, localStorage ve HttpOnly cookie](diagrams/token-saklama-karsilastirma.svg "Token saklama seçenekleri arasındaki kalıcılık, XSS ve CSRF ödünleşimleri.")

Kalıcı depoya yazma işlemi de her koşulda başarılı olmayabilir: tarayıcı depolamayı engellemiş veya alanı doldurmuş olabilir. Böyle bir durumda arayüz bellekte açık oturumla devam edebilir, ama F5 sonrasında token geri gelmeyecektir. Bu yüzden uygulama “kaydetme başarılı oldu” diye varsaymamalı; depolama işleminin başarısız olabileceğini hesaba katmalıdır. Depo erişimi hata verse de kullanıcıya anlaşılır bir durum göstermek, oturumun beklenmedik biçimde kaybolmasını şaşırtıcı olmaktan çıkarır.

### Gerçek hata: token var diye oturumu doğrulanmış sanmak

Bir geliştirici açılışta `localStorage.getItem(...)` null değil diye kullanıcıyı doğrudan özel profile gönderebilir. Belirti, profil isteğinin 401 ile başarısız olması veya korumalı ekranın geçersiz token'la görünmesidir. Depodaki dizgi yalnızca daha önce bir token kaydedildiğini söyler; token'ın süresi dolmuş, iptal edilmiş ya da bozuk olup olmadığını sunucu belirler. Token'ı bulunca uygulama bunu istekte kullanır ve sunucunun cevabına göre oturum durumunu netleştirir.

Başka bir kolay yanılgı JWT'nin tarayıcı tarafından kendiliğinden saklandığını sanmaktır. JWT yalnızca noktalı metin biçimidir. Onu state, `localStorage` veya cookie içinde tutma kararını uygulama ve sunucu kodu verir.

## Aklında kalsın

- React state'i ve Redux store'u bellektedir; F5 eski belleği yok eder.
- `localStorage` kaydı yenilemeden sonra kalır, ama store'u kendi başına geri yüklemez.
- Depodan okunan token'ın varlığı, sunucunun onu kabul edeceğinin kanıtı değildir.
- `localStorage` kalıcılık sağlar; JavaScript erişebildiği için güvenlik ödünleşimi vardır.
- `HttpOnly` cookie JavaScript'ten gizlenir; cookie güvenliği ve CSRF daha sonra ayrıntılanır.

**Yeni terimler**

- **Bellek içi state:** Uygulama çalışırken yaşayan, sayfa yeniden başlayınca sıfırlanan değer.
- **`localStorage`:** Aynı site için değerleri sayfa yenilemeleri arasında saklayan tarayıcı deposu.
- **Cookie / `HttpOnly`:** Tarayıcının isteklerle taşıyabildiği küçük kayıt / JavaScript'in okuyamadığı cookie ayarı.
- **XSS / CSRF:** Sayfada saldırgan script çalışması / tarayıcının kullanıcı adına istenmeyen istek göndermesiyle ilgili riskler.

**Kendini yokla:** Token yalnız Redux store'daysa F5'ten sonra profil ekranı onu nereden alır?  
**Cevap:** Hiçbir yerden; store yeniden kurulur ve eski bellek değeri kaybolur. Kalıcılık ayrıca kurulmalıdır.

**Kendini yokla:** Token `localStorage`'da duruyorsa Redux store F5'ten sonra aynı değeri kendiliğinden içerir mi?  
**Cevap:** Hayır. Uygulama açılırken depodan okuyup store'a aktarmalıdır.
