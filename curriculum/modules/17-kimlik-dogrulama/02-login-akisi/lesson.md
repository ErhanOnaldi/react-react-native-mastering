---
title: "Giriş: formdan token çiftine"
minutes: 15
kind: concept
---

# Giriş: formdan token çiftine

:::pain[Sinema'da sahte giriş ve 401 şoku]
Kullanıcı giriş kutusuna herhangi bir metin, hatta tamamen yanlış bir parola yazıyor ve "Giriş yap" düğmesine basıyor. Bileşen hemen yerel state'i `setIsAuthenticated(true)` yapıyor ve kullanıcıyı profil sayfasına yönlendiriyor. Kullanıcı kendini oturum açmış sanıyor; ancak profil detaylarını getirecek `/auth/me` isteği atıldığı anda konsol kırmızıya boyanıyor: `401 Unauthorized`. Sahte bir arayüz durumuna güvenilmiş, sunucunun gerçek kimlik onayı beklenmemiştir.
:::

## Doğrulama nerede biter, kimlik nerede başlar?

React uygulamalarında kullanıcı girişi basit bir form gönderme işleminden çok daha fazlasıdır. İstemci tarafı ile kimlik sunucusu arasında iki aşamalı, hassas bir güvenlik ve kullanıcı deneyimi sözleşmesi kurulur:

1. **İstemci Form Doğrulaması (Validation):** Formun biçimsel doğruluğunu (boş bırakılmama, minimum uzunluk, e-posta formatı) denetler. Amacı kullanıcıya anında geri bildirim vermek ve sunucuya gereksiz, baştan reddedileceği kesin olan geçersiz ağ istekleri göndermemektir.
2. **Sunucu Kimlik Doğrulaması (Authentication):** Gönderilen bilgilerin veritabanındaki kayıtlarla ve parola hash'iyle eşleşip eşleşmediğini kontrol eder. Başarılı ise istemciye kriptografik olarak imzalanmış oturum belirteçlerini (access ve refresh token) teslim eder.

İstemci doğrulaması bir güvenlik kalkanı değildir; yalnızca kullanıcı deneyimini iyileştiren bir filtredir. Gerçek kimlik kapısı her zaman sunucudur.

![Login akışı: istemci doğrulaması, sunucu isteği ve oturum durumu](diagrams/login-akis-semasi.svg "Login akışı istemci kontrolü, sunucu isteği ve hata yönetimini gösterir.")

Login akışının kesin ve bağlayıcı kuralları:

1. **Ağ isteği öncesi istemci denetimi:** Boş bırakılmış kullanıcı adı veya parola için ağa istek atılmamalıdır. React Hook Form ve Zod gibi araçlarla alan bazlı hatalar (`username`, `password`) anında ekrana yansıtılmalıdır.
2. **`fetch`'in durum kodu sözleşmesi:** Web platformunun yerleşik `fetch` API'si HTTP 400 (Bad Request), 401 (Unauthorized) veya 500 (Internal Server Error) yanıtlarında Promise'i **reddetmez (reject etmez)**. `fetch` yalnızca fiziksel ağ kopması, DNS çözülememesi veya CORS engellerinde hata fırlatır. Sunucunun yanıtı reddettiğini anlamak için `response.ok` (durum kodunun 200–299 aralığında olması) açıkça denetlenmelidir.
3. **Hataların semantik ayrımı:** İstemci tarafında iki farklı hata kategorisi vardır:
   - *Alan Hataları (Field Errors):* "Kullanıcı adı zorunludur" gibi doğrudan bir girdinin altında gösterilen ve o girdiye odaklanan hatalar.
   - *Kök / API Hataları (Root Errors):* "Geçersiz kimlik bilgileri" veya "Sunucuya ulaşılamıyor" gibi belirli bir alana değil formun geneline ait olan, `role="alert"` ile erişilebilir duyurulan hatalar.
4. **Parola gizliliği ve sızıntı engelleme:** Kullanıcının girdiği parola hiçbir koşulda `console.log` ile yazdırılmamalı, hata mesajlarına iliştirilmemeli ve Sentry/Datadog gibi hata izleme servislerine gönderilen hata nesnelerinin gövdesinde taşınmamalıdır.
5. **Atomik oturum güncellemesi:** Sunucudan başarılı bir 200 yanıtı ve token çifti geldiğinde, hem `accessToken` hem `refreshToken` oturum durumuna birlikte işlenmelidir. Token'lardan birinin eksik gelmesi durumunda kısmi oturum açılmamalı, işlem başarısız sayılmalıdır.

## HTTP yanıtını güvenle işlemek

Bir kimlik doğrulama uç noktasına istek atarken izlenmesi gereken standart bir akış vardır. İstek adımlarını zaman sırasıyla izleyelim:

| Adım | Eylem | Olası Durum | Davranış |
| --- | --- | --- | --- |
| 1 | Gönderim Tetiklendi | Form submit | Gönderme düğmesi kilitlenir (`isSubmitting: true`), çift tıklama önlenir. |
| 2 | İstemci Şeması | Geçersiz girdi | İstek iptal edilir, ilgili alanın altına hata metni çizilir. |
| 3 | Sunucu İsteği | `POST /auth/token` | JSON gövdesiyle istek gönderilir. |
| 4 | Ağ Kesintisi | Bağlantı yok | `fetch` reject olur (`TypeError`). Genel hata: "Ağ bağlantınızı kontrol edin". |
| 5 | HTTP 400 / 401 | Hatalı şifre | `response.ok === false`. Yanıt gövdesinden `message` okunur ve genel hata alanına yazılır. |
| 6 | HTTP 200 OK | Başarılı | Yanıt JSON'ı ayrıştırılır, token çifti oturum durumuna aktarılır. |

## Önce kırık, sonra doğru: Kimlik doğrulama servis çağrısı

Örnek olarak bir kurumsal konsol giriş API'sini ele alalım (`/api/portal/authorize`).

### Kırık örnek

Aşağıdaki fonksiyon `fetch`'in hata modelini yanlış anlamakta ve sunucu hatalarını başarı gibi yutmaktadır:

```ts
// TEHLİKELİ VE KIRIK İMPLEMENTASYON
export async function authenticatePortalBroken(identity: string, secretKey: string) {
  // HATA 1: Parola boş olsa bile gereksiz ağ isteği atıyor
  const res = await fetch('/api/portal/authorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity, secretKey }),
  })

  // HATA 2: response.ok kontrolü YOK!
  // Sunucu 400 { error: "Invalid password" } dönse bile res.json() çalışır!
  const data = await res.json()

  // HATA 3: Hata yanıtı olsa dahi sanki token gelmiş gibi döndürür,
  // çağıran kod data.token undefined olduğu halde oturumu açık sanır!
  return data
}
```

Bu fonksiyon kullanıldığında, kullanıcı yanlış şifre girdiğinde bile fonksiyon bir hata fırlatmaz. Çağıran React bileşeni `undefined` token ile oturum açmaya çalışır ve sayfa tutarsız bir ara duruma sıkışır.

### Doğru örnek

`response.ok` kontrolünü yapan, hata mesajını güvenle çıkaran ve tipli sonuç döndüren sağlam servis fonksiyonu:

```ts check
export interface PortalAuthCredentials {
  accountName: string
  accessCode: string
}

export interface PortalAuthSuccess {
  token: string
  renewalToken: string
  expiresInSeconds: number
}

export async function requestPortalSession(
  credentials: PortalAuthCredentials,
): Promise<PortalAuthSuccess> {
  const response = await fetch('https://api.example.com/portal/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: credentials.accountName,
      password: credentials.accessCode,
    }),
  })

  // Sunucu 4xx veya 5xx döndüğünde fetch reject olmaz; ok bayrağı false olur
  if (!response.ok) {
    let failureDetail = 'Giriş işlemi gerçekleştirilemedi.'
    try {
      const errorJson = (await response.json()) as { message?: string }
      if (errorJson.message) {
        failureDetail = errorJson.message
      }
    } catch {
      // Yanıt JSON formatında değilse durum kodunu açıkla
      failureDetail = `Sunucu hatası: ${response.status}`
    }
    throw new Error(failureDetail)
  }

  const payload = (await response.json()) as PortalAuthSuccess
  return {
    token: payload.token,
    renewalToken: payload.renewalToken,
    expiresInSeconds: payload.expiresInSeconds,
  }
}
```

## Form katmanı: React Hook Form ve Zod ile uyum

Servis fonksiyonumuz hazır olduğunda, bunu bir React bileşeni içinde nasıl tüketmeliyiz?

Bileşen katmanında React Hook Form ve Zod kalkanını kurarız:
- Zod şeması boş bırakılan alanları anında yakalar (`zodResolver`).
- Form `handleSubmit` ile yalnızca girdi geçerli olduğunda tetiklenir.
- Servis çağrısı bir `try/catch` bloğuna alınır. API'den gelen `Error` mesajı, formun genel durumuna (`setError('root', ...)`) yazılır.

```tsx check
import { useState } from 'react'

interface ServiceCredentials {
  identifier: string
  passcode: string
}

export function ServiceSignInCard({
  onSubmitCredentials,
}: {
  onSubmitCredentials: (creds: ServiceCredentials) => Promise<void>
}) {
  const [identifier, setIdentifier] = useState('')
  const [passcode, setPasscode] = useState('')
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGeneralError(null)

    // 1. İstemci ön kontrolü
    if (!identifier.trim() || !passcode.trim()) {
      setGeneralError('Lütfen tüm alanları doldurun.')
      return
    }

    // 2. İstek süreci
    setIsBusy(true)
    try {
      await onSubmitCredentials({
        identifier: identifier.trim(),
        passcode,
      })
    } catch (err) {
      // 3. Sunucu hata yanıtı genel uyarı olarak yansıtılır
      const message = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu'
      setGeneralError(message)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <form onSubmit={handleFormSubmit}>
      {generalError && (
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          {generalError}
        </div>
      )}

      <div>
        <label htmlFor="portal-identifier">Hesap Adı</label>
        <input
          id="portal-identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          disabled={isBusy}
        />
      </div>

      <div>
        <label htmlFor="portal-passcode">Parola</label>
        <input
          id="portal-passcode"
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          disabled={isBusy}
        />
      </div>

      <button type="submit" disabled={isBusy}>
        {isBusy ? 'Doğrulanıyor...' : 'Oturum Aç'}
      </button>
    </form>
  )
}
```

Bu kurguda:
- Düğme işlem sürerken pasifleşir (`disabled={isBusy}`), mükerrer istekler engellenir.
- Hata mesajı `role="alert"` ile işaretlenir; ekran okuyucu kullanıcıya hatayı anında seslendirir.
- Parola metni hatanın içinde asla tekrar edilmez.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: fetch'in 400 ve 401 yanıtlarında catch bloğuna düşeceğini sanmak]
Belirti → Kullanıcı yanlış şifre girdiğinde form başarı adımlarını çalıştırmaya devam ediyor; hata mesajı hiçbir zaman görünmüyor.  
Neden → `fetch` yalnızca ağ koptuğunda reject olur; 400 ve 401 yanıtlarında Promise `resolve` olur.  
Düzeltme → `await response.json()` demeden önce mutlaka `if (!response.ok)` denetimi yap ve hata gövdesini okuyarak bir `Error` fırlat.
:::

:::mistake[Sık hata: Yanlış parola denemesinde kullanıcı adını da silmek]
Belirti → Kullanıcı şifreyi yanlış girdiğinde form sıfırlanıyor ve uzun kullanıcı adını yeniden yazmak zorunda kalıyor.  
Neden → Hata anında tüm form state'ini `reset()` ile temizlemek.  
Düzeltme → Hata durumunda yalnızca parola alanını temizle veya odakla; kullanıcının yazdığı kullanıcı adı alanını koru.
:::

:::mistake[Sık hata: Çift tıklamayla mükerrer istek patlaması yaratmak]
Belirti → Kullanıcı sabırsızca "Giriş yap" butonuna ardı ardına 3 kez tıklıyor ve ağ sekmesinde 3 ayrı login isteği peş peşe gidiyor.  
Neden → İstek başladığı andan yanıt dönene kadar butonun veya formun devre dışı (`disabled`) bırakılmaması.  
Düzeltme → İstek başlatılırken bir yüklenme durumu (`isSubmitting`) aktifleştirilmeli ve buton `disabled={isSubmitting}` yapılmalıdır.
:::

:::mistake[Sık hata: Parolayı loglarda ve konsolda açık metin olarak bırakmak]
Belirti → `console.log('Login denemesi:', { username, password })` gibi satırların canlı koda veya merkezi log sunucularına sızması.  
Neden → Geliştirme anında hata aramak için yazılan debug log'larının temizlenmemesi.  
Düzeltme → Parola ve token gibi hassas veriler hiçbir koşulda konsola veya analitik araçlarına yazdırılmamalıdır.
:::

:::sector
Güvenlik odaklı kurumsal sistemlerde (OWASP yönergeleri uyarınca) giriş formlarında **kullanıcı numaralandırma (user enumeration)** saldırılarına karşı önlem alınır. Örneğin bir saldırgan rastgele kullanıcı adları deneyerek sistemde hangi hesapların kayıtlı olduğunu keşfetmeye çalışabilir.

Eğer sistem kayıtlı olmayan bir kullanıcı için "Böyle bir kullanıcı bulunamadı", yanlış şifre için ise "Şifre hatalı" derse, saldırgan hangi kullanıcı adlarının sistemde var olduğunu anlar. Bu nedenle modern ekipler her iki durumda da farksız ve nötr bir hata mesajı döndürür: **"Kullanıcı adı veya parola hatalı"**.

Ayrıca sunucu tarafında kaba kuvvet (brute-force) saldırılarını yavaşlatmak için hız sınırlama (rate limiting) uygulanır; art arda 5 hatalı denemeden sonra IP veya hesap geçici olarak kilitlenir.
:::

## Özet

- Giriş süreci iki aşamalıdır: istemci şema doğrulaması gereksiz trafiği önler; gerçek kimlik denetimi sunucudadır.
- `fetch` 400 ve 401 yanıtlarında hata fırlatmaz; `response.ok` kontrolü ile durum kodu açıkça incelenmelidir.
- İstemci hataları alan bazında gösterilirken, sunucudan dönen kimlik reddi genel bir kök hata (`role="alert"`) olarak sunulmalıdır.
- İstek esnasında form butonu kilitlenmeli, mükerrer istek gönderilmesi engellenmelidir.
- Parolalar asla loglanmamalı, URL parametrelerine eklenmemeli ve hata metinlerinde gösterilmemelidir.

**Kendini yokla:** `fetch('/api/login')` çağrısı HTTP 401 durum koduyla sonuçlandı. Kod bir `try/catch` bloğunun içindeyse akış `catch` bloğuna geçer mi?  
*Cevap:* Hayır, geçmez! `fetch` HTTP 401 yanıtını başarıyla tamamlanan bir Promise olarak çözer (`resolve`). Akışın `catch`'e geçmesi için geliştiricinin `if (!response.ok)` kontrolü yapıp elle bir `Error` fırlatması gerekir.

**Kendini yokla:** Giriş formunda kullanıcıya "Böyle bir e-posta kayıtlı değil" demek neden bir güvenlik zaafı oluşturabilir?  
*Cevap:* Saldırganın e-posta listesi deneyerek sistemde hangi kullanıcıların kayıtlı olduğunu tespit etmesine (user enumeration) imkan tanır. Güvenli yaklaşım, kullanıcı var olsa da olmasa da "E-posta veya şifre hatalı" şeklinde genel bir yanıt vermektir.
