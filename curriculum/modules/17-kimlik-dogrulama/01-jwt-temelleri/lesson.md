---
title: "JWT: üç parçalı oturum bileti"
minutes: 15
kind: concept
---

# JWT: üç parçalı oturum bileti

:::pain[Sinema'da sahte oturum ve kaybolan kimlik]
Sinema uygulamasında kullanıcı girişi yapıldığını sanıyorsun çünkü arayüzde bir state değişkeni `isLoggedIn = true` olarak ayarlanmış. Ancak `/watchlists` adresine doğrudan tarayıcı çubuğundan gidildiğinde ya da sayfa yenilendiğinde (F5) bu boolean değer sıfırlanıyor. Daha da kötüsü, sunucuya atılan film kaydetme isteklerinde kullanıcının kim olduğuna dair hiçbir kanıt bulunmuyor; backend kimi muhatap aldığını bilmediği için ya herkese izin veriyor ya da işlemi reddediyor. Arayüzdeki basit bir değişken, kimlik kanıtı olamaz.
:::

## İstemci ve sunucu arasındaki güven köprüsü

Web uygulamalarında kimlik doğrulama (authentication) "sen kimsin?", yetkilendirme (authorization) ise "bu kaynağa erişmeye iznin var mı?" sorularına yanıt arar. Modern tek sayfa uygulamalarında (SPA), kullanıcı her sayfayı değiştirdiğinde veya API'ye istek attığında sunucunun oturumu tanıması gerekir.

Geçmişte bu ilişki sunucu belleğinde tutulan oturum kimlikleriyle (session ID) yürütülürdü. Ancak dağıtık sunucular, mikroservisler ve üçüncü parti API mimarileri yaygınlaştıkça, her istekte veritabanına oturum sorma zorunluluğu maliyetli hale geldi. İşte JSON Web Token (JWT), bu ihtiyaca yanıt veren durumsuz (stateless) bir kimlik kanıtı standardıdır.

JWT, sunucunun kriptografik olarak imzaladığı ve istemciye teslim ettiği taşınabilir bir bilet gibidir. İstemci bu bileti alır, saklar ve yetki gerektiren her HTTP isteğinde sunucuya geri sunar.

![JSON Web Token anatomisi: Header, Payload ve Signature](diagrams/jwt-yapisi.svg "JWT üç parçadan oluşur; Header, Payload ve Signature.")

JWT mimarisinin kesin ve bağlayıcı kuralları:

1. **Noktalarla ayrılmış üç parça:** Bir JWT dizgisi her zaman iki nokta karakteriyle (`.`) ayrılmış üç temel bileşenden oluşur: `Header.Payload.Signature`. Bu parçalardan herhangi birinin eksikliği veya biçim bozukluğu belirteci geçersiz kılar.
2. **Base64URL kodlaması (Şifreleme DEĞİLDİR):** Header ve Payload bölümleri şifrelenmiş (encrypted) değil, yalnızca Base64URL ile kodlanmış (encoded) açık JSON metinleridir. Tarayıcıda çalışan herhangi bir JavaScript kodu veya ağ trafiğini izleyen biri bu alanları anında metne dönüştürüp okuyabilir. Bu nedenle JWT içine parola, API anahtarı veya kredi kartı gibi sırlar asla yazılamaz.
3. **Standart iddialar (Claims) ve zaman birimi:** Payload içindeki anahtar-değer çiftlerine "claim" (iddia) denir. RFC 7519 standardına göre son kullanma zamanı `exp`, veriliş anı `iat` alanında **Unix Epoch saniyesi** (1 Ocak 1970'ten itibaren geçen saniye) olarak saklanır. JavaScript'in `Date.now()` fonksiyonu ise **milisaniye** üretir. İki zaman kıyaslanırken birim dönüşümü zorunludur.
4. **İstemci çözümlemesi (Decode) doğrulama (Verify) değildir:** İstemci tarafında token'ın payload'ını çözmek, yalnızca sunucunun bildirdiği bilgileri (kullanıcı adı, son kullanma süresi) okumamızı sağlar. İstemci, token'ın sunucunun gizli anahtarıyla imzalanıp imzalanmadığını veya yolda tahrif edilip edilmediğini asla doğrulayamaz. İmzayı yalnız sunucu kontrol edebilir.
5. **Durumsuzluk (Stateless) ödünleşimi:** Sunucu JWT imzaladıktan sonra, belirteç geçerlilik süresi dolana kadar kendi kendine yeten bir belgedir. Sunucu veritabanına bakmadan imzayı doğrular. Bu hız sağlar; ancak süresi dolmamış bir token'ı anında iptal etmek (revocation) merkezi bir kara liste tutulmadıkça zordur. Bu sebeple access token süreleri kısa tutulur.

## Üç parçanın anatomisi

Bir JWT'nin her parçasının üstlendiği görev son derece nettir:

### 1. Header (Başlık)

Token'ın hangi imzalama algoritmasıyla (`alg`) oluşturulduğunu ve belirtecin türünü (`typ`) açıklar:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Yaygın olarak HMAC-SHA256 (`HS256`) simetrik algoritması veya RSA / ECDSA (`RS256`, `ES256`) asimetrik anahtar çiftleri kullanılır.

### 2. Payload (Gövde ve İddialar)

Kullanıcıya ve oturuma dair verileri taşır:

```json
{
  "sub": "user_4821",
  "username": "ahmet_dev",
  "role": "editor",
  "iat": 1727481600,
  "exp": 1727485200
}
```

- `sub` (subject): Belirtecin ait olduğu kullanıcının benzersiz kimliği.
- `exp` (expiration): Token süresinin dolduğu an (Unix saniyesi).
- `iat` (issued at): Token'ın üretildiği an.

### 3. Signature (Kriptografik İmza)

Sunucunun kendi elinde tuttuğu gizli sır (secret) veya özel anahtar (private key) ile Header ve Payload'ın birleşimini imzaladığı kısımdır:

```text
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  sunucuGizliSirri
)
```

Saldırgan payload içindeki `username` değerini değiştirirse, sunucu gelen isteği doğrularken kendi sırrıyla yeni bir imza hesaplar. Hesaplanan imza gelen imza ile eşleşmeyeceği için sunucu isteği 401 Unauthorized ile reddeder.

## İstemcide Base64URL çözümleme adımları

Tarayıcının yerleşik `atob()` fonksiyonu standart Base64 formatını çözer. Ancak URL'lerde güvenle taşınabilmesi için JWT'de Base64URL alfabesi kullanılır. Base64URL alfabesinde `+` yerine `-`, `/` yerine `_` kullanılır ve dizgi sonundaki `=` doldurma (padding) karakterleri atılır.

Bu sebeple istemcide token payload'ını çözerken şu adımlar izlenir:

| Sıra | Adım | İşlem | Örnek |
| --- | --- | --- | --- |
| 1 | Parçalara ayır | `token.split('.')` | `[header, payload, signature]` |
| 2 | İkinci parçayı seç | İndeks 1 kontrolü | `payloadPart` |
| 3 | Karakterleri düzelt | `-` → `+`, `_` → `/` | `payloadPart.replace(/-/g, '+').replace(/_/g, '/')` |
| 4 | Padding tamamla | Uzunluğu 4'ün katı yap | `=` ekleyerek 4'ün katına tamamla |
| 5 | Metne çevir | `atob(duzeltilmis)` | `{"username":"ahmet","exp":1727485200}` |
| 6 | JSON parse et | `JSON.parse(metin)` | JavaScript nesnesi |

## Zaman karşılaştırması: saniye ile milisaniye tuzağı

Payload'dan okunan `exp` değeri doğrudan `Date.now()` ile karşılaştırılamaz. Sayıların büyüklüğüne bakalım:

```text
exp         = 1727485200         (10 basamak - Unix saniyesi)
Date.now()  = 1727485200000      (13 basamak - milisaniye)
```

Eğer `exp <= Date.now()` yazarsan, `1727485200 <= 1727485200000` ifadesi matematiksel olarak her zaman `true` çıkacaktır! Yani oluşturulmuş yepyeni bir token bile daha ilk milisaniyesinde "süresi dolmuş" kabul edilir ve kullanıcı uygulamaya hiç giremez.

Doğru karşılaştırma için `exp` değerini 1000 ile çarparak milisaniyeye genişletmek gerekir:

```text
const sureDolduMu = exp * 1000 <= Date.now()
```

## Önce kırık, sonra doğru: Güvenli payload çözümleyici

Şimdi tipik bir hatalı implementasyonu ve ardından üretim standartlarında tip korumalı çözümünü inceleyelim.

### Kırık örnek

Aşağıdaki kod parçası token'ı doğrudan `atob` ile açmaya çalışır, hata durumlarını yönetmez ve zaman birimini yanlış kıyaslar:

```ts
// TEHLİKELİ VE KIRIK İMPLEMENTASYON
export function parseTokenBroken(rawToken: string) {
  // HATA 1: Parçalara ayırmadan tüm token'a atob uygular (DOMException fırlatır)
  const decoded = atob(rawToken)

  // HATA 2: Bozuk JSON geldiğinde uygulama çöker
  const data = JSON.parse(decoded)

  // HATA 3: Birim dönüşümü yok; token henüz taze olsa bile hemen süresi doldu sayılır
  if (data.exp <= Date.now()) {
    return null
  }

  return data
}
```

Bu kod üç ölümcül arızaya sahiptir:
1. `rawToken` içinde noktalar olduğu için `atob` geçersiz karakter hatası verir.
2. Base64URL karakterleri (`-` ve `_`) standart Base64 olmadığı için tarayıcı kodu patlatır.
3. Hatalı token geldiğinde `try/catch` olmadığı için tüm React ağacı unhandled exception ile beyaz ekrana düşer.

### Doğru örnek

Gereken tüm kontrolleri içeren, tip korumalı ve kendi kendine derlenebilir güvenli yardımcı fonksiyon:

```ts check
export interface TokenClaims {
  userId: string
  role: string
  exp: number
}

export function inspectTokenPayload(token: string): TokenClaims | null {
  try {
    // 1. Üç parçalı yapı kontrolü
    const segments = token.split('.')
    if (segments.length !== 3) {
      return null
    }

    const payloadSegment = segments[1]
    if (!payloadSegment) {
      return null
    }

    // 2. Base64URL -> Base64 karakter dönüşümü
    const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/')

    // 3. Eksik padding karakterlerini tamamlama
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')

    // 4. Decode ve JSON parse
    const rawJson = atob(padded)
    const parsed: unknown = JSON.parse(rawJson)

    // 5. Tip daraltma ve alan geçerliliği kontrolü
    if (typeof parsed !== 'object' || parsed === null) {
      return null
    }

    const record = parsed as Record<string, unknown>
    if (
      typeof record.userId !== 'string' ||
      typeof record.role !== 'string' ||
      typeof record.exp !== 'number'
    ) {
      return null
    }

    return {
      userId: record.userId,
      role: record.role,
      exp: record.exp,
    }
  } catch {
    // Bozuk veri, geçersiz karakter veya parse hatalarında güvenle null dön
    return null
  }
}

export function isTokenExpired(expSeconds: number): boolean {
  // exp saniye cinsindedir; Date.now() milisaniye ile kıyaslamak için 1000 ile çarpılır
  return expSeconds * 1000 <= Date.now()
}
```

Bu fonksiyon bozuk dizgilerde, eksik alanlarda veya parse hatalarında uygulamanın çökmesini engeller; `null` döndürerek çağıran katmana temiz bir sinyal verir.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: atob fonksiyonunu tüm JWT dizgisine uygulamak]
Belirti → `DOMException: Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.` hatası.  
Neden → JWT'nin tamamı (`header.payload.signature`) tek bir Base64 dizgisi değildir. Aradaki nokta (`.`) karakterleri Base64 alfabesinde yer almaz.  
Düzeltme → Önce `token.split('.')` ile dizgiyi parçala, ardından yalnızca 1. indeksteki payload parçasını çöz.
:::

:::mistake[Sık hata: İstemcideki decode sonucunu yetki kanıtı saymak]
Belirti → Kullanıcı tarayıcı konsolunda payload'daki `role: "admin"` alanını değiştirip arayüzde admin panelini açabiliyor.  
Neden → Payload'ı tarayıcıda çözmek imzanın doğrulanması anlamına gelmez. İstemci kendi ürettiği ya da tahrif ettiği payload'ı da çözebilir.  
Düzeltme → İstemci tarafındaki çözümleme yalnızca kullanıcı adı göstermek veya arayüzde süre dolumunu önceden sezmek içindir. Gerçek güvenlik sınırını sunucu uygular; sunucu her istekte imzayı gizli sırrıyla kontrol eder.
:::

:::mistake[Sık hata: exp ve Date.now() birimlerini karıştırmak]
Belirti → Kullanıcı yeni giriş yaptığı anda oturum "süresi doldu" uyarısıyla kapanıyor.  
Neden → `exp` Unix saniyesidir (10 basamak), `Date.now()` ise milisaniyedir (13 basamak). Birim çevrilmeden yapılan `exp <= Date.now()` karşılaştırması her zaman `true` verir.  
Düzeltme → Karşılaştırmadan önce `exp * 1000 <= Date.now()` formülünü kullan.
:::

:::mistake[Sık hata: JWT içine hassas iş sırları koymak]
Belirti → Ağ sekmesini açan herhangi bir kullanıcı firmanın iç API anahtarlarını veya kişisel verilerini görebiliyor.  
Neden → JWT'nin şifrelenmiş (encrypted) olduğu yanılgısına düşmek.  
Düzeltme → JWT şifreli değil, açık kodlanmış bir formattır. İçine yalnızca kimlik numarası, kullanıcı adı ve yetki kapsamı gibi açık bilgiler konulmalıdır.
:::

:::sector
Kurumsal mimarilerde OAuth 2.0 ve OIDC (OpenID Connect) standartları kullanılır. İstemciye iki ayrı belirteç verilir:
1. **Access Token (JWT):** Çok kısa ömürlüdür (5 ila 15 dakika). API isteklerinde `Authorization: Bearer <token>` başlığında taşınır. Kısa ömürlü olması, çalınması durumunda saldırganın elindeki kullanım penceresini sınırlar.
2. **Refresh Token:** Daha uzun ömürlüdür (günler veya haftalar). Yalnızca süresi dolan access token'ı yenilemek üzere auth sunucusuna gönderilir.

Ayrıca kurumsal ekipler JWT kütüphanelerini seçerken "alg: none" zafiyetine karşı kütüphanenin algoritmayı zorunlu kıldığından emin olur. İstemcide ise token çözümleme işi nadiren ham string manipülasyonuyla bırakılır; ortak bir yardımcı fonksiyonda toplanarak Zod gibi şema doğrulayıcılarla tip güvenliğine kavuşturulur.
:::

## Özet

- JWT noktalarla ayrılmış üç bölümden oluşur: Header (algoritma bilgisi), Payload (kullanıcı verisi ve süre), Signature (sunucu imzası).
- Payload şifreli değildir; Base64URL ile kodlanmıştır ve tarayıcıda herkes tarafından okunabilir.
- `exp` değeri Unix Epoch saniyesidir; `Date.now()` milisaniyesi ile kıyaslarken `exp * 1000` yapılmalıdır.
- İstemcide payload'ı çözmek imza doğrulaması değildir; imza kontrolünü yalnız sunucu yapabilir.
- Bozuk token ve geçersiz karakter durumları `try/catch` ile yakalanmalı, uygulama beyaz ekrana düşürülmemelidir.

**Kendini yokla:** Bir JWT'nin payload'ında `exp: 1700000000` yazıyor ve `Date.now()` çağrısı `1700000050000` dönüyor. Bu token geçerli midir?  
*Cevap:* Hayır, süresi dolmuştur. `exp * 1000 = 1700000000000` milisaniyedir. `1700000050000` şimdiki zaman olduğundan `1700000000000 <= 1700000050000` şartı sağlanır; 50 saniye önce geçerliliğini yitirmiştir.

**Kendini yokla:** Bir geliştirici JWT payload'ına kullanıcının kredi kartı numarasını koyabileceğini savunuyor. Bu güvenli midir?  
*Cevap:* Kesinlikle güvenli değildir. JWT şifrelenmiş bir veri değildir; Base64URL kodlu açık bir JSON nesnesidir. Tarayıcıda çalışan herhangi bir betik veya ağı izleyen biri kart numarasını doğrudan okuyabilir.
