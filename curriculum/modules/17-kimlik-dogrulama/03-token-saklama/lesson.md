---
title: "Yenilemede oturum neden kaybolur?"
minutes: 15
kind: concept
---

# Yenilemede oturum neden kaybolur?

:::pain[Sinema'da F5 faciası ve güvensiz depo arayışı]
Kullanıcı başarıyla giriş yaptı, profil bilgileri ekrana geldi ve film listesi yüklendi. Ancak tarayıcıda yenile (F5) tuşuna basıldığı anda sayfa bembeyaz olup tekrar açılıyor ve kullanıcı kendini kapı dışarı edilmiş olarak login ekranında buluyor! Çünkü Redux store ve React state'i yalnızca bellek üzerinde yaşıyordu; sayfa yenilendiğinde tüm bellek sıfırlandı. Bu sorunu aceleyle çözmek isteyen bir geliştirici token'ları hemen `localStorage`'a yazıyor; ancak bu kez de sayfadaki herhangi bir script'in tüm oturumu çalabileceği devasa bir XSS açığı yaratıyor.
:::

## Belleğin sınırları ve kalıcılık ikilemi

Tek sayfa uygulamalarında (SPA) JavaScript çalışma zamanı, tarayıcı sekmesinin yaşam döngüsüne sıkı sıkıya bağlıdır. Redux store'u, React context'i ve bileşen state'leri RAM üzerinde yer tutan geçici değişkenlerdir. Sayfa yenilendiğinde (F5), tarayıcı mevcut DOM ve JavaScript bağlamını tamamen yok eder, `index.html` dosyasını baştan indirir ve uygulamanın tüm JavaScript kodunu sıfırdan yürütür.

Bu durum temel bir mimari ikilem doğurur:
- Oturumu **yalnızca bellekte** tutarsan, en güvenli yaklaşımı seçmiş olursun; ancak kullanıcı her sayfa yenilediğinde oturumu kaybeder ve berbat bir kullanıcı deneyimi yaşar.
- Oturumu **istemci depolama alanlarına (localStorage)** yazarsan, kalıcılığı sağlarsın; ancak tarayıcıda çalışan herhangi bir JavaScript kodunun erişebileceği açık bir hedef bırakırsın.
- Oturumu **sunucu kontrollü çerezlere (HttpOnly cookie)** devredersen, hem kalıcılığı hem XSS korumasını sağlarsın; ancak bu kez de siteler arası istek sahteciliği (CSRF) riskini yönetmek zorunda kalırsın.

Güvenlik mühendisliğinde "mükemmel ve bedelsiz" bir çözüm yoktur; her mimari karar belirli bir **tehdit modeli ve ödünleşim (trade-off)** dengesine dayanır.

![Token saklama seçenekleri: bellek, localStorage ve HttpOnly cookie](diagrams/token-saklama-karsilastirma.svg "Token saklama seçenekleri arasındaki kalıcılık, XSS ve CSRF ödünleşimleri.")

Token saklama mimarisinin kesin ve bağlayıcı kuralları:

1. **Belleğin geçiciliği (In-Memory Ephemerality):** Bellekteki durum (Redux / state) sayfa yenilendiğinde sıfırlanır. Kalıcılık isteniyorsa ya tarayıcı depolama API'lerinden (`localStorage`, `sessionStorage`, `IndexedDB`) ya da sunucu çerezlerinden yararlanılmalıdır.
2. **`localStorage` bir güvenlik kasası değildir:** `localStorage`, aynı kaynak (origin: protokol + domain + port) altındaki tüm JavaScript kodlarına açıktır. Uygulamanıza sızan bir XSS açığı (örneğin filtrelenmemiş bir kullanıcı yorumu veya zararlı bir npm paketi), tek bir `localStorage.getItem('token')` satırıyla tüm oturum anahtarlarını saldırganın sunucusuna sızdırabilir.
3. **`HttpOnly` bayrağı ve JavaScript körlüğü:** Sunucu HTTP yanıt başlığında `Set-Cookie: token=...; HttpOnly; Secure; SameSite=Lax` gönderdiğinde, tarayıcı bu çerezi saklar ancak JavaScript çalışma zamanına (`document.cookie`) tamamen kapatır. Sayfada bir XSS açığı olsa bile saldırgan belirteç dizgisini okuyamaz.
4. **Çerezlerin otomatik gönderimi ve CSRF:** `HttpOnly` çerezler tarayıcı tarafından ilgili etki alanına yapılan tüm isteklere otomatik olarak iliştirilir. Kullanıcı kötü amaçlı bir web sitesini ziyaret ettiğinde, o site kullanıcının tarayıcısına gizlice sizin API'nize bir `POST /transfer` isteği attırabilir. Tarayıcı çerezi otomatik ekleyeceği için sunucu isteği meşru sanabilir. Bu nedenle çerez tabanlı kimlikte `SameSite` politikaları ve anti-forgery token savunması zorunludur.
5. **Veri minimizasyonu:** İstemcide ister bellekte ister yerel depoda olsun, asla ihtiyaçtan fazla veri saklanmamalıdır. Yalnızca kimlik doğrulamayı sürdürecek asgari token çifti tutulmalı; hassas kullanıcı detayları depolanmamalıdır.

## Üç saklama seçeneğinin derinlemesine karşılaştırması

Hangi yöntemi ne zaman seçeceğimizi belirlemek için beş kritik eksende karşılaştırma yapalım:

| Karşılaştırma Ekseni | Bellek (Redux / State) | `localStorage` | `HttpOnly` Çerez (Cookie) |
| --- | --- | --- | --- |
| **F5 Yenileme Sonrası** | Oturum tamamen kaybolur | Oturum korunur | Oturum korunur |
| **Sekmeler Arası Durum** | Sekmeler birbirinden bağımsızdır | Tüm sekmeler aynı oturumu paylaşır | Tüm sekmeler aynı oturumu paylaşır |
| **XSS Riski (Token Hırsızlığı)** | Düşük (Saldırgan çalışan kodla istek atabilir ama token kalıcı depoda yoktur) | **Çok Yüksek** (Saldırgan token'ı anında çalar ve dışarı sızdırır) | **Yok** (JavaScript çerezi okuyamaz) |
| **CSRF Riski** | Yok (Bearer başlığı JavaScript ile elle eklenir) | Yok (Tarayıcı otomatik başlık göndermez) | **Var** (Tarayıcı çerezi otomatik yollar; önlem şarttır) |
| **İstemci Eforu** | Çok kolay | Çok kolay | Backend ile sıkı koordinasyon ve CORS ayarı gerektirir |

## localStorage ödünleşimi ve Sinema bağlamı

Sinema projesinde DummyJSON gibi üçüncü parti, harici bir REST API ile çalışıyoruz. DummyJSON sunucusu bizim alan adımızda `HttpOnly` çerez kuramaz; yanıtı JSON gövdesinde `{ accessToken, refreshToken }` olarak teslim eder.

Bu senaryoda kullanıcı deneyimini korumak (her F5'te kullanıcıyı login'e atmamak) için `localStorage` kullanmak pratik bir mecburiyettir. Ancak bunu yaparken bir mühendis olarak **tehdit modelini bilerek kabul etmek** gerekir:
- "Ben şu an token'ı `localStorage`'da tutuyorum. Bu sebeple uygulamamda XSS zafiyeti oluşmaması için kullanıcı girdilerini titizlikle kaçışlamalı (Modül 17.8), CSP başlıklarını kurmalı (Modül 17.9) ve bağımlılık zincirimi denetlemeliyim (Modül 17.11)."

## Önce kırık, sonra doğru: Yerel depolama adaptörü

`localStorage` doğrudan `getItem` / `setItem` ile kullanıldığında pek çok gizli tuzak barındırır.

### Kırık örnek

Aşağıdaki saklama kodu yanıltıcı bir güvenlik hissi yaratır ve hataları yönetmez:

```ts
// TEHLİKELİ VE KIRIK İMPLEMENTASYON
export const unsafeSessionStorage = {
  save(tokens: { access: string; refresh: string }) {
    // HATA 1: btoa ile Base64 yapmak şifreleme DEĞİLDİR! Saldırgan atob ile anında çözer.
    const fakeEncrypted = btoa(JSON.stringify(tokens))
    // HATA 2: Safari gizli modda veya kota dolduğunda setItem QuotaExceededError fırlatır!
    localStorage.setItem('session_key', fakeEncrypted)
  },
  load() {
    // HATA 3: JSON parse hatası veya bozuk veride uygulama çöker
    const raw = localStorage.getItem('session_key')
    if (!raw) return null
    return JSON.parse(atob(raw))
  },
}
```

Bu kod iki büyük hata barındırır:
1. `btoa` uygulamak güvenlik sağlamaz, yalnızca kodun okunmasını zorlaştırır ("security through obscurity").
2. `localStorage` kotası dolduğunda veya gizli sekme kısıtlamalarında `setItem` çağrısı `DOMException` fırlatır ve yakalanmazsa React uygulamasını tamamen kilitler.

### Doğru örnek

Hataları yakalayan, tip korumalı ve güvenli oturum depolama adaptörü:

```ts check
export interface StoredSessionPayload {
  authToken: string
  renewalToken: string
  storedAtTimestamp: number
}

const STORAGE_IDENTIFIER = 'app_user_session_v1'

export const safeSessionStorage = {
  persistSession(data: StoredSessionPayload): boolean {
    try {
      const serialized = JSON.stringify(data)
      localStorage.setItem(STORAGE_IDENTIFIER, serialized)
      return true
    } catch {
      // Depolama kotası dolu olabilir veya tarayıcı izin vermiyor olabilir
      return false
    }
  },

  retrieveSession(): StoredSessionPayload | null {
    try {
      const raw = localStorage.getItem(STORAGE_IDENTIFIER)
      if (!raw) {
        return null
      }

      const parsed: unknown = JSON.parse(raw)
      if (typeof parsed !== 'object' || parsed === null) {
        return null
      }

      const record = parsed as Record<string, unknown>
      if (
        typeof record.authToken !== 'string' ||
        typeof record.renewalToken !== 'string' ||
        typeof record.storedAtTimestamp !== 'number'
      ) {
        return null
      }

      return {
        authToken: record.authToken,
        renewalToken: record.renewalToken,
        storedAtTimestamp: record.storedAtTimestamp,
      }
    } catch {
      // Bozuk JSON veya okuma engellerinde güvenle boş oturuma dön
      return null
    }
  },

  clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_IDENTIFIER)
    } catch {
      // Hata durumunda sessiz kal
    }
  },
}
```

Bu adaptör:
- Her depolama işlemini `try/catch` içine alarak `QuotaExceededError` veya güvenlik engellerinde uygulamanın çökmesini önler.
- `JSON.parse` sonucunu doğrudan `as StoredSessionPayload` diye zorlamaz; alan tiplerini tek tek doğrulayarak bozuk veya eski sürüme ait depolama artıklarının sistemi bozmasını engeller.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: btoa ile Base64 kodlamayı şifreleme sanmak]
Belirti → Geliştiricinin "Token'ı localStorage'a koydum ama btoa ile şifreledim, o yüzden güvenli" demesi.  
Neden → Base64 bir şifreleme (encryption) değil, veri formatlama (encoding) algoritmasıdır. Gizli anahtarı yoktur.  
Düzeltme → `btoa` XSS saldırganını bir milisaniye bile yavaşlatmaz. XSS'e karşı gerçek koruma ya `HttpOnly` çerez kullanmak ya da sayfada XSS oluşmasını engellemektir.
:::

:::mistake[Sık hata: Depodaki token'ı sorgusuz sualsiz yetkili kabul etmek]
Belirti → Sayfa açılırken depoda bir token dizgisi olduğu için kullanıcı "oturum açık" kabul ediliyor; ancak 2 saniye sonra atılan ilk API isteğinde token süresi dolduğu için sayfa hataya düşüyor.  
Neden → `localStorage`'da bir dizginin bulunması, o belirtecin sunucu nezdinde hâlâ geçerli olduğunu kanıtlamaz.  
Düzeltme → Depodan token okunduğunda arayüz önce bir "doğrulanıyor" ara durumuna alınmalı ve token'ın geçerliliği sunucuya atılan bir profil veya refresh isteğiyle teyit edilmelidir.
:::

:::mistake[Sık hata: Çıkış anında depolamayı temizlemeyi unutmak]
Belirti → Kullanıcı "Çıkış Yap" butonuna bastıktan sonra sayfayı yenilediğinde eski oturumun yeniden açılması.  
Neden → Çıkış fonksiyonunun yalnızca Redux state'ini sıfırlaması, ancak `localStorage.removeItem(...)` adımını atlaması.  
Düzeltme → Çıkış eylemi atomik olmalıdır: hem bellek (store) hem de kalıcı depolama (`localStorage`) aynı anda temizlenmelidir.
:::

:::mistake[Sık hata: Safari özel dolaşma ve kota hatalarını yönetmemek]
Belirti → Kullanıcı Safari Gizli Mod'da (Private Browsing) uygulamayı açtığında sayfanın kilitlenmesi veya kaydetme anında çökmesi.  
Neden → Bazı tarayıcılar gizli modda `localStorage` erişimini tamamen engeller veya kotasını 0 bayt yapar; `setItem` doğrudan hata fırlatır.  
Düzeltme → `localStorage` erişimlerini daima `try/catch` blokları içinde gerçekleştir.
:::

:::sector
Endüstriyel seviyedeki modern SaaS uygulamalarında (örneğin Auth0, Supabase veya kurumsal bankacılık sistemleri) en yaygın kabul gören altın standart mimari şudur:

1. **Access Token:** Yalnızca istemci belleğinde (React state veya Redux store) tutulur. Asla `localStorage`'a yazılmaz. Böylece XSS saldırganı kalıcı depoyu okuyarak token çalamaz.
2. **Refresh Token:** Sunucu tarafından `HttpOnly`, `Secure`, `SameSite=Strict` ve uygun `Path=/auth` kısıtlamasına sahip bir çerez (cookie) olarak verilir. JavaScript bu çereze asla dokunamaz.
3. **Sayfa Yenileme (Silent Refresh):** Kullanıcı F5 yaptığında bellek sıfırlanır. Uygulama açılışta arka planda bir kez `POST /auth/refresh` isteği atar. Tarayıcı `HttpOnly` çerezi otomatik olarak bu isteğe iliştirir. Sunucu yeni bir access token üretip JSON olarak döner; uygulama bu token'ı belleğe alarak oturumu sessizce devam ettirir.

Bu melez mimari, `localStorage`'ın XSS zafiyetini ortadan kaldırırken, `HttpOnly` çerezin güvenlik avantajını ve tek sayfa uygulamalarının esnekliğini bir araya getirir.
:::

## Özet

- Redux ve React state'i bellekte yaşar; F5 yenilemesinde sıfırlanır.
- `localStorage` kalıcıdır ancak XSS saldırılarına karşı tamamen savunmasızdır; aynı origin'deki her kod okuyabilir.
- `HttpOnly` çerezler JavaScript'e kapalıdır, XSS ile çalınamaz; ancak CSRF savunması (`SameSite`) gerektirir.
- Üçüncü parti API'lerde (DummyJSON) `localStorage` pratik bir zorunluluk olabilir; bu durumda XSS savunma hattı güçlendirilmelidir.
- Depolama okuma ve yazma işlemleri daima `try/catch` ve tip denetimiyle güvene alınmalıdır.

**Kendini yokla:** Bir e-ticaret sitesinde token'ı `localStorage`'da saklıyorsun. Sitede kullanılan bir üçüncü parti canlı destek widget'ı hacklendi ve içine kötü amaçlı kod eklendi. Saldırgan kullanıcının oturumunu ele geçirebilir mi?  
*Cevap:* Evet! Üçüncü parti widget aynı sayfa içinde çalıştığı için uygulamanın origin'ini paylaşır. `localStorage.getItem(...)` çağrısıyla kayıtlı tüm token'ları okuyabilir ve kendi uzak sunucusuna gönderebilir.

**Kendini yokla:** `HttpOnly` çerez kullanan bir sitede XSS zafiyeti oluşursa saldırgan ne yapabilir?  
*Cevap:* Saldırgan token dizgisini doğrudan çalıp kendi bilgisayarına kopyalayamaz (çünkü JavaScript çerezi okuyamaz). Ancak sayfada çalışan kötü amaçlı script ile kullanıcının oturumu üzerinden sunucuya sahte işlemler (örneğin arka planda para transferi isteği) yaptırtabilir.
