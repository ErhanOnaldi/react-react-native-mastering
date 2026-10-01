---
title: "401 sonrası tek refresh"
minutes: 18
kind: concept
---

# 401 sonrası tek refresh

Sinema'da oturum açtıktan sonra filmleri incelerken API'ye istek atıyorsun. Erişim belirtecinin süresi dolarsa sunucu `401 Unauthorized` döndürür. Kullanıcıyı hemen giriş sayfasına göndermek yerine, uygulama elindeki yenileme belirteciyle yeni bir erişim belirteci alabilir.

## Önce belirteç çiftini yenileyelim

`refresh token`, süresi dolan `access token` yerine yenisini istemeye yarayan daha uzun ömürlü belirteçtir. Sunucu her yenilemede hem yeni access token hem yeni refresh token veriyorsa buna **rotation** (döndürme) denir: Eski refresh token artık kullanılamaz. Bu nedenle yeni çifti birlikte saklarız.

Önce sunucunun başarılı yanıtını düşünelim:

```ts
type Tokens = { accessToken: string; refreshToken: string }

const oldTokens: Tokens = {
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
}
const freshTokens: Tokens = {
  accessToken: 'access-2',
  refreshToken: 'refresh-2',
}

storage.setTokens(freshTokens)
```

`setTokens` tek çağrıda iki yeni değeri de yazar. Yalnız `accessToken` değerini değiştirirsen, sonraki yenilemede `refresh-1` tekrar gönderilir. Sunucu onu daha önce tükettiği için isteği reddedebilir. İkiliyi birlikte değiştirmek, depoda birbirine ait olmayan eski ve yeni token'ların kalmasını önler.

Depoda refresh token yoksa istek göndermeyiz; yenileme yapılamadığı için kullanıcı yeniden giriş akışına gider. Yenileme yanıtındaki `response.ok` değeri, durum kodu başarı aralığında (`200`–`299`) ise `true` olur. Yanıt başarısızsa depoya dokunmamak önemlidir: örneğin sunucu `403` döndürürse elimizde yeni bir çift yoktur; eski değeri yeniymiş gibi kaydetmek hatayı gizler. Depodaki oturumu değiştirmeden hatayı üst katmana iletiriz.

## Bir 401 geldiğinde ne olur?

API'den gelen `Response`, durum kodunu `status` alanında taşır. `401`, isteğin geçerli kimlik doğrulama bilgisi olmadığını söyler. Her başarısız yanıtı yenileme sebebi sayamayız: `404` film bulunamadı, `500` sunucu hatası demektir; ikisi de token'ın süresinin dolduğunu göstermez.

Sinema'da bir film detay isteği ve bir favoriler isteği yaptığını düşün. Önce tek isteğin akışını izleyelim:

```text
GET /films/42  →  401
POST /auth/refresh  →  yeni token çifti
GET /films/42  →  200
```

İlk isteğin yanıtı `401` ise yenileme yapılır, ardından aynı veri isteği yeni access token ile bir kez tekrarlanır. İlk isteğin yanıtı `404` ise yenileme adımı yoktur. Bu ayrım gereksiz istekleri önler ve asıl hatayı saklamaz.

### İki istek aynı anda 401 alırsa

Gerçek sayfada film ayrıntısı ve favoriler isteği neredeyse aynı anda başlayabilir. İstekler birbirinden bağımsızdır; bu yüzden ikisi de eski access token'ı taşır.

```ts
let refreshInFlight: Promise<Tokens> | null = null

function getSharedRefresh(): Promise<Tokens> {
  if (!refreshInFlight) {
    refreshInFlight = refreshTokens().finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}
```

Buradaki **Promise**, henüz bitmemiş bir asenkron işlemin sonucunu temsil eder. İlk 401 `refreshTokens()` işlemini başlatır ve Promise'ı değişkende tutar. İkinci 401 geldiğinde yeni bir refresh başlatmak yerine aynı Promise'ı alır; ikisi de aynı sonuca kadar bekler. Bir işi aynı anda isteyenlerin tek ortak işlemi paylaşmasına **single-flight** (tek uçuş) denir. `.finally()` Promise'ın başarıyla ya da hatayla bitişinde çalışan metottur; burada ortak referansı her iki durumda da temizliyoruz.

### Zaman çizelgesinde iz sürelim

Tabloda A film ayrıntısını, B favorileri istiyor. Her ikisi de `access-1` ile başlamış olsun.

| Zaman | İstek A: film | İstek B: favoriler | Ortak yenileme | Depodaki çift |
| --- | --- | --- | --- | --- |
| 0 ms | `GET /films/42` gönderildi | `GET /favorites` gönderildi | Yok | `access-1`, `refresh-1` |
| 40 ms | `401` geldi, yenilemeyi başlatır | Bekliyor | `refresh-1` ile başladı | Eski çift |
| 45 ms | Bekliyor | `401` geldi, mevcut Promise'ı alır | Aynı yenileme sürüyor | Eski çift |
| 120 ms | Yenileme bitti | Yenileme bitti | Yeni çift kaydedildi, Promise temizlendi | `access-2`, `refresh-2` |
| 125 ms | Film isteği bir kez tekrarlandı | Favoriler isteği bir kez tekrarlandı | Yok | Yeni çift |
| 160 ms | `200` yanıtı | `200` yanıtı | Yok | Yeni çift |

![401 sonrası tek refresh ve bekleyen istekler](diagram:token-yenileme)

İki kaynak isteği 401 alsa da yalnızca bir yenileme isteği çıktı. Bunun nedeni, iki isteğin de aynı Promise sonucunu beklemesidir. `finally` bloğu Promise başarıyla ya da hatayla bittiğinde çalışır; referansı temizlediği için ilerideki başka bir süre dolumu yeni bir yenileme başlatabilir.

## Geç gelen 401'i de hesaba katalım

Bir ağ yanıtı yavaş gelebilir. B isteği `access-1` ile daha önce yola çıkmış olsun; A'nın 401 yanıtı önce gelir, token'ı yeniler ve depoya `access-2` yazar. B'nin eski isteği bundan sonra 401 döndürür. Artık yeni bir refresh'e gerek yoktur.

| Kontrol | Değer |
| --- | --- |
| B isteğinin gönderdiği access token | `access-1` |
| Depodaki güncel access token | `access-2` |
| Karar | Token değişmiş; yeni refresh başlatma |
| Devam | B isteğini `access-2` ile bir kez tekrarla |

İstek gönderilirken kullanılan token ile depodaki token'ı karşılaştırmak bu geç yanıtı tanımamızı sağlar. Değerler farklıysa başka bir istek yenilemeyi zaten tamamlamıştır. Değerler aynıysa henüz kimse yenilememiştir; istek ortak yenilemeye katılır.

## Yeniden deneme için bir sınır koy

Yenilenen token ile tekrar gönderilen istek de 401 alabilir; örneğin kullanıcının oturumu sunucuda kapatılmış olabilir. İkinci bir refresh başlatırsak istekler durmadan birbirini tetikleyebilir. Bu yüzden kurtarma akışı bir kez çalışır: refresh başarısızsa ya da tek retry da başarısızsa hata döndürülür ve oturum akışı girişe dönebilir.

:::mistake[Her hatada refresh yapmak]
**Belirti:** Olmayan bir film için `404` gelirken Network panelinde gereksiz `/auth/refresh` isteği de görürsün.  
**Neden:** Kod `response.status === 401` yerine her `!response.ok` durumunda token yeniliyor.  
**Düzeltme:** Yenilemeyi yalnızca ilk yanıtın durumu tam olarak `401` ise başlat; `404` ve `500` yanıtlarını kendi hataları olarak ilet.
:::

:::mistake[Ortak Promise'ı temizlememek]
**Belirti:** İlk refresh başarılı olur ama sonraki süre dolumunda uygulama eski sonuçla kalır ya da hiçbir yenileme isteği çıkmaz.  
**Neden:** `refreshInFlight` dolu kalmıştır; kod gelecekteki isteği hâlâ önceki işe bağlı sanar.  
**Düzeltme:** Promise'ı `.finally(() => { refreshInFlight = null })` ile hem başarı hem hata sonunda temizle.
:::

:::mistake[Retry'ı sınırsız yapmak]
**Belirti:** Sunucu her seferinde 401 döndürürken istekler ve refresh çağrıları durmadan yinelenir.  
**Neden:** Retry'ın 401 yanıtı da ilk istekmiş gibi yeniden kurtarma akışına girer.  
**Düzeltme:** İlk isteğin yanıtından sonra en fazla bir yenileme ve bir retry yap; retry başarısızsa hatayı döndür.
:::

:::info[Derinlemesine (isteğe bağlı)]
OAuth 2.0 ve OpenID Connect (OIDC), token yenileme kuralları tanımlayan kimlik standartlarıdır. Bazı sunucular eski refresh token tekrar kullanıldığında token zincirini çalınma belirtisi sayıp tüm oturumu iptal eder. Bazı istemciler `exp` değerini okuyup süre dolmadan proaktif yenileme de yapar; bu dersin akışı ise 401 yanıtı geldiğinde devreye girer.
:::

## Özet

- Rotation varsa başarılı yenileme yeni bir access ve refresh token çifti verir; ikisini birlikte sakla.
- Yalnız `401` yenileme gerekçesidir. `404` ve `500` kendi hataları olarak kalır.
- Eşzamanlı 401'ler aynı Promise'ı paylaşır; iş bitince referans `.finally` ile temizlenir.
- Kullanılan token depodakinden eskiyse başka istek yenilemiştir; yenilemeyi tekrarlamadan güncel token ile bir kez dene.
- Yenileme ve retry sınırlıdır; tekrar başarısız olursa hata döndürülür.

**Yeni terimler**

- `rotation`: Her yenilemede eski token çiftinin yerine yeni çift verilmesi.
- `Promise`: Asenkron bir işlemin daha sonra elde edilecek sonucunu temsil eden JavaScript nesnesi.
- `single-flight`: Aynı anda istenen işi bir kez başlatıp taleplere ortak sonucunu kullandırma yöntemi.
- `retry`: Başarısız isteği sınırlı sayıda yeniden gönderme.
- `finally`: Promise tamamlandığında, başarı veya hata fark etmeksizin çalışan metot.

**Kendini yokla**

1. İki istek 401 alınca neden iki refresh yerine aynı Promise'ı bekler?  
   *Çünkü refresh token rotation'da eski refresh token bir kez kullanılır. İki ayrı yenileme aynı eski değeri yarışarak gönderir; tek ortak yenileme bu çakışmayı önler.*
2. Token'ı `access-1` olan geç yanıt, depoda `access-2` görünce ne yapar?  
   *Yeni refresh başlatmadan isteği depodaki access token ile bir kez tekrarlar.*
