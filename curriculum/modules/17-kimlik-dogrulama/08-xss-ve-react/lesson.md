---
title: "XSS ve React’in güvenli çıkış noktaları"
minutes: 16
kind: concept
---

# XSS ve React’in güvenli çıkış noktaları

Sinema'daki film yorumunu kullanıcı yazıyor, o yorumu ise başka kişiler görüyor. Bu yüzden yorum, uygulamanın kendi kodundan değil dışarıdan gelen veridir; biçimi ne olursa olsun onu güvenilir HTML sayamayız.

## JSX metni HTML değildir

**XSS** (Cross-Site Scripting), saldırganın sayfada kendi JavaScript kodunu çalıştırıp o sayfayı ziyaret eden kişinin yetkilerini kullanmasıdır. Bir yorumdaki metin çalıştırılabilir koda dönüşebiliyorsa, o yorumu okuyan kişinin hesabı da risk altındadır.

En basit örnekte React'e sabit bir metin verelim:

```tsx
const title = 'Kayıp Şehir'
return <h2>{title}</h2>
```

Tarayıcı ekranda “Kayıp Şehir” başlığını gösterir. JSX içindeki `{title}` bir metin değeri olarak gösterilir; React bunu yeni bir HTML etiketi gibi yorumlamaz.

Şimdi aynı yere yorum alanından gelmiş bir değer koyalım:

```tsx
const review = '<img src=x onerror=alert(1)>'
return <p>{review}</p>
```

Burada da tarayıcı bir `<img>` elementi üretmez; ekranda `<img src=x onerror=alert(1)>` karakterleri görünür. React, JSX içindeki metin değerlerini güvenli metin çıkışına dönüştürür; HTML'e ait özel karakterler kod gibi çalışmaz. Bu davranış bazen **escaping** (kaçışlama) olarak adlandırılır.

## Metin ile HTML arasındaki sınırı gör

React'in korumasının nerede bittiğini iki farklı film yorumu görünümüyle karşılaştıralım:

```tsx
const comment = '<img src=x onerror=alert(1)>'

function PlainComment() {
  return <p>{comment}</p>
}

function RawComment() {
  return <p dangerouslySetInnerHTML={{ __html: comment }} />
}
```

`PlainComment` içeriği yazı olarak gösterir. `RawComment` ise `dangerouslySetInnerHTML` ile tarayıcıya “bu string'i HTML olarak ayrıştır” der; bozuk görsel yüklenince `onerror` çalışabilir. İkinci bileşende React'in metin korumasını kendimiz kapattığımız için kullanıcı yorumunu ham HTML olarak basmamalıyız.

Bu sınırı adım adım kaydedelim:

| Girdi | Kodun çıkış noktası | Tarayıcının yorumu | Sonuç |
| --- | --- | --- | --- |
| `<img src=x onerror=alert(1)>` | `<p>{comment}</p>` | Metin | Etiket yazısı görünür; olay çalışmaz |
| Aynı yorum | `dangerouslySetInnerHTML` | HTML elementi ve olay özniteliği | XSS riski oluşur |
| `https://themoviedb.org` | `<a href={url}>` | Web adresi | Bağlantı TMDB'ye gider |
| `javascript:alert(1)` | `<a href={url}>` | Çalıştırılabilir URL şeması | Tıklanınca kod çalışabilir |

![XSS akışı ve güvenli çıkış noktaları](diagram:xss-akisi)

Tablo iki ayrı veriyi gösteriyor: Metin içeriğini JSX güvenli metin olarak ele alır; `href` değerini ise adres olarak kullanır. Dolayısıyla bir metnin güvenli gösterilmesi, aynı string'in her HTML özelliğinde de güvenli olduğu anlamına gelmez.

## Bağlantı metninden adresi ayır

Bir film yorumuna yazarın web sitesi bağlantısını ekleyelim. `href`'e verilen değer **URL**'dir (web adresi); URL'nin başlangıcındaki `https:` ya da `javascript:` gibi bölüm ise **protocol** (protokol) olarak adlandırılır.

```tsx
const website = 'https://themoviedb.org'
return <a href={website}>Yazarın sitesi</a>
```

Tıklayınca tarayıcı TMDB adresine gider. Fakat JSX burada protokolün güvenli olup olmadığını denetlemez; string'i `href` değerine koyar. Bu nedenle `javascript:alert(1)` gibi bir değer de doğrudan kullanılırsa tehlike yaratabilir.

Güvenli web bağlantısı gereken bir yerde adresi önce ayrıştırıp yalnızca beklediğimiz protokollere izin veririz:

```ts
function safeMovieWebsite(value: string): string {
  try {
    const url = new URL(value.trim())
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      return url.href
    }
  } catch {
    // Geçersiz ya da mutlak olmayan adres güvenli kabul edilmez.
  }
  return '#'
}
```

`new URL()` adresi parçalar; `url.protocol` hangi protokolün kullanıldığını söyler. Yalnız `http:` ve `https:` kabul edildiğinden `javascript:` ve geçersiz adresler `#` değerine düşer. `#` burada güvenli bir yedek hedeftir; uygulama gerçek üründe bağlantıyı göstermemeyi de seçebilir.

## Sinema yorumuna uygula

Gerçekçi bir film ayrıntı ekranında yazar adı, yorum ve isteğe bağlı web sitesi birlikte gösterilebilir. Örnekte bileşen adı ve yapı görevdeki `SafeComment` bileşeninden farklıdır; önemli olan iki çıkış türü için ayrı kontrol yapmaktır.

```tsx
interface ReviewCardProps {
  reviewer: string
  text: string
  site?: string
}

function ReviewCard({ reviewer, text, site }: ReviewCardProps) {
  const safeSite = site ? safeMovieWebsite(site) : null

  return (
    <article>
      <h3>{reviewer}</h3>
      <p>{text}</p>
      {safeSite && <a href={safeSite}>Film yorumları</a>}
    </article>
  )
}
```

`reviewer` ve `text` JSX metin alanlarına gider; `site` ise önce protokol kontrolünden geçip sonra `href` olur. Örneğin `text` değeri `<script>...</script>` ise etiket yazı olarak görünür; `site` değeri `javascript:...` ise `#` olur. Her girdiye aynı işlemi uygulamak yerine, verinin gideceği yere göre güvenli davranışı seçiyoruz.

## Gerçek bir yanlış: satır sonunu HTML'e çevirmek

Yorumda satır sonları görünmediğinde `dangerouslySetInnerHTML` kullanmak cazip gelebilir. Bu, görünümü düzeltmek için tüm yorum metnini HTML'e açar; kullanıcı etiketi de o HTML'in parçası olur. Satır sonlarını CSS ile göstermek (`white-space: pre-line`) veya metni React elementleriyle parçalara ayırmak güvenli seçenektir.

:::mistake[Metin düzeltmek için ham HTML kullanmak]
**Belirti:** Yoruma eklenen HTML etiketi sayfada elemente dönüşür veya olay kodu çalışır.  
**Neden:** `dangerouslySetInnerHTML`, React'in JSX metin çıkışını atlayıp string'i HTML olarak yorumlatır.  
**Düzeltme:** Düz metni `{text}` ile göster; biçimlendirme gerekiyorsa metni React elementleriyle kur. Gerçekten zengin HTML gerekiyorsa güvenilir bir arındırma çözümü kullan.
:::

:::mistake[URL'yi metin kaçışlamasıyla güvenli sanmak]
**Belirti:** JSX'te `<a href={site}>` var ama `javascript:` şeması hâlâ bağlantıda kalıyor.  
**Neden:** React metni HTML olarak çalıştırmaz; ancak URL'nin protokolünün uygulama için uygun olduğuna karar vermez.  
**Düzeltme:** `new URL()` ile ayrıştır, kullanımına uygun protokolleri izin listesiyle sınırla ve geçersiz girişte güvenli yedek kullan.
:::

:::info[Derinlemesine (isteğe bağlı)]
XSS, verinin kaynağına göre stored (veritabanında saklanan), reflected (istek içinde gelip sayfaya dönen) veya DOM-based (istemci JavaScript'inin DOM'a taşıdığı) diye sınıflandırılabilir. Kendi `replace(/<script>/...)` regex'inle HTML temizleme: HTML'in tüm biçimlerini güvenle ayrıştıramazsın. Zengin HTML kaçınılmazsa `DOMPurify` gibi sınanmış bir sanitizer (zararlı içeriği temizleyen kütüphane) gerekir. Token saklama ve `HttpOnly` çerez konusuna çerezler dersinde dönüyoruz.
:::

## Özet

- XSS, saldırganın tarayıcıda senin uygulamanın yetkileriyle JavaScript çalıştırmasıdır.
- `{value}` ile JSX'e verilen metin HTML etiketi olarak çalışmaz; React metin içeriğini kaçışlar.
- `dangerouslySetInnerHTML` metni ham HTML'e çevirir; güvenilmeyen yorumlarda kullanma.
- `href` ve benzeri URL alanlarında protokolü ayrıca doğrula; JSX metin koruması URL doğrulaması değildir.
- Her çıkış noktasını ayrı değerlendir: yorum metni metin olarak, bağlantı adresi izin verilen protokolle gösterilir.

**Yeni terimler**

- `XSS`: Kullanıcı girdisinin sayfada saldırgan JavaScript olarak çalışması açığı.
- `escaping`: Özel karakterleri kod yerine güvenli metin olarak göstermeye dönüştürme.
- `URL`: Tarayıcının bir kaynağa gitmek için kullandığı web adresi.
- `protocol`: URL'nin `https:` gibi, bağlantının türünü belirten başlangıç bölümü.
- `sanitizer`: Zengin HTML içindeki tehlikeli etiket ve özellikleri temizleyen kütüphane.

**Kendini yokla**

1. `<p>{'<img src=x onerror=alert(1)>'}</p>` ne gösterir?  
   *Etiket karakterlerini düz metin olarak gösterir; bir `<img>` elementi oluşturmaz ve `onerror` çalışmaz.*
2. `href` içinde `javascript:alert(1)` varsa JSX bunu neden tek başına engellemez?  
   *React metin içeriğini güvenli gösterir; URL protokolünün uygulama tarafından kabul edilip edilmediğini ayrıca denetlemez.*
