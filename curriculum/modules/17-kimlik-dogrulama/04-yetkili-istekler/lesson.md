---
title: "Bearer başlığıyla profil isteği"
minutes: 14
kind: concept
---

# Bearer başlığıyla profil isteği

Giriş yaptıktan sonra Sinema'da kullanıcının izleme listesi gibi özel verileri isteyebilirsin. İstek, tarayıcıdan API sunucusuna giden mesajdır. Sunucuya "hangi kullanıcı adına konuştuğunu" göstermek için giriş sırasında aldığın access token'ı o mesaja eklemen gerekir.

## Token olmadan gelen yanıt

Önce herkese açık film listesini düşün. Bu adrese token olmadan istek atabilirsin:

```ts
const response = await fetch('https://sinema.example/api/movies')
const movies = await response.json()
```

Sunucu herkese açık listeyi döndürür. Profil gibi özel verilerdeyse sunucu kullanıcının kim olduğunu bilmeden yanıt veremez; eksik kimlik bilgisi için `401 Unauthorized` ("kimlik bilgisi yok ya da kabul edilmedi" durum kodu) döndürür.

## İsteğe kimlik bilgisini ekle

Bir API isteğinin başlığı, adresin yanında taşınan küçük ek bilgiler bölümüdür. `Authorization` başlığı, sunucuya isteğin hangi kimlik bilgisiyle yapıldığını söyler. Access token'ı bu başlıkta `Bearer` sözcüğünden sonra göndeririz:

```ts
const response = await fetch('https://sinema.example/api/watchlist', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
```

`Bearer`, "bu token'ı taşıyan kişi" anlamındaki HTTP kimlik şemasıdır. Arada bir boşluk olmalı: sunucu `Bearer eyJ...` biçimini bekler. Burada token'ı URL'ye, örneğin `?token=...` biçiminde eklemiyoruz; URL tarayıcı geçmişine ve sunucu kayıtlarına girebilir.

Bu örnekte istek artık oturum bilgisini taşıyor. Ama bu, sunucunun isteği kabul ettiğini henüz göstermez: token süresi dolmuş olabilir.

Token'ı eklemek, kimlik bilgisini sunucuya ulaştırma işidir; kullanıcının yetkili olduğunu istemci kendi başına kanıtlamaz. Sunucu token'ı kontrol eder ve kendi kararını yanıt koduyla bildirir. Bu ayrım yüzünden “başlık eklendi” ile “istek başarılı oldu” aynı şey değildir.

## Yanıtın başarılı olup olmadığını kontrol et

`fetch` ağ bağlantısı kurulamadığında hata fırlatır; HTTP `401` gibi bir yanıt aldığında ise normal bir `Response` döndürür. `response.ok`, durum kodunun başarı aralığında olup olmadığını belirtir. Başarısız yanıtı veri gibi kullanmak yerine açıkça hata olarak yukarıya iletelim:

```ts
const response = await fetch('https://sinema.example/api/watchlist', {
  headers: { Authorization: `Bearer ${accessToken}` },
})

if (!response.ok) {
  throw new Error(`İstek başarısız: ${response.status}`)
}

const watchlist = await response.json()
```

Böylece geçerli token ile listeyi okuruz; süresi dolmuş token'da `response.status` değeri `401` olur ve fonksiyon hata fırlatır. Arayüz bu hatayı yakalayıp uygun mesajı gösterebilir. Hatalı yanıtı boş listeye çevirmek doğru olmaz: kullanıcı oturumunun bittiğini anlayamaz ve boş listeyi kendi verisi sanabilir.

Örneğin ekranda izleme listesi boş görünüyorsa iki ayrı durumu ayırt etmen gerekir: sunucu başarılı biçimde boş bir liste döndürmüş olabilir veya isteği `401` ile reddetmiş olabilir. `response.ok` kontrolü bu farkı korur. Başarı yanıtının JSON gövdesi veri olarak okunur; hata yanıtı ise `throw` ile çağırana gider.

### Belirtiyi satır satır izle

| Sıra | İstemcide olan | Sunucunun yanıtı | Sonuç |
| --- | --- | --- | --- |
| 1 | `fetch` isteği `Authorization: Bearer ...` ile gönderir | İsteği alır | Henüz sonuç belli değil |
| 2 | `await fetch(...)` yanıtı verir | Token geçerliyse `200`, değilse `401` | Her iki durumda da `Response` vardır |
| 3 | `if (!response.ok)` çalışır | `200` için `ok` doğru, `401` için yanlış | `401` durumunda hata fırlatılır |
| 4 | Yalnızca başarı dalında `response.json()` çalışır | Profil ya da liste gövdesi döner | Hata gövdesi yanlışlıkla profil sanılmaz |

![Bearer başlığıyla korumalı kaynak isteği ve 401 kontrolü](diagrams/bearer-istek-akisi.svg "Bearer token istek akışı ve 401 hata kontrolü.")

### Gerçek bir hata: boşluk eksik

Şunu yazarsan:

```ts
const authorization = `Bearer${accessToken}`
```

Sunucu `Bearer` ile token arasında ayraç bulamaz ve çoğunlukla isteği `401` ile reddeder. Başlığı şablon dizgisiyle kurarken `Bearer ` sonundaki boşluğu da yaz: `` `Bearer ${accessToken}` ``. İki belirteç farklı amaçlar taşıyorsa onları da karıştırma: Sinema'nın kimlik API'sine kullanıcı access token'ı, film sağlayıcısına ise onun istediği ayrı kimlik bilgisi gider.

Network panelinde isteği incelerken önce URL'nin beklediğin servis olduğunu, sonra `Authorization` başlığının `Bearer ` ile başladığını kontrol et. Yanıt `401` ise bu, başlığın kesin yanlış olduğunu ispatlamaz; token süresi dolmuş veya sunucu tarafından geçersiz kılınmış da olabilir. Durum kodunu ve sunucunun hata mesajını birlikte okuyarak nerede sorun arayacağını daraltırsın.

## Tekrarlanan başlığı tek yerde tut

Her profil ya da izleme listesi isteğinde aynı başlığı elle yazmak, bir yerde boşluğu unutmana veya yanlış token göndermene yol açabilir. Sinema'da API çağrılarını tek bir `fetch` yardımcısında toplarsan başlık biçimi ve hata kontrolü tek yerde kalır. Bu yardımcıyı bu derste kurmuyoruz; önemli fikir, her isteğin `Authorization` bilgisini bilinçli biçimde almasıdır.

:::info[Derinlemesine (isteğe bağlı)]
OAuth 2.0, farklı uygulamaların kullanıcı adına erişim iznini sınırlamak ve taşımak için kullanılan yetkilendirme çerçevesidir. RFC 6750, OAuth access token'ını `Authorization: Bearer ...` başlığında taşıma biçimini tanımlar. Bu adlar protokolün kaynağını açıklar; burada uyguladığın temel iş yine bir HTTP başlığı eklemek ve yanıtı kontrol etmektir.
:::

## Özet

- Özel API verisi için istemci access token'ı `Authorization: Bearer <token>` başlığında yollar.
- `Bearer` ile token arasında bir boşluk bulunur; token URL'ye eklenmez.
- `fetch`, HTTP `401` yanıtında kendi başına hata fırlatmaz; `response.ok` ve gerekirse `response.status` kontrol edilir.
- Başarısız yanıttan sahte boş veri üretmek yerine hatayı çağırana ilet.

**Yeni terimler**

- **Access token:** Oturum açmış kullanıcı adına istekte bulunmayı sağlayan kısa ömürlü belirteç.
- **Authorization başlığı:** HTTP isteğinde kimlik bilgisini taşıyan başlık alanı.
- **Bearer:** Token'ı taşıyan kişinin onu kullandığını belirten kimlik şeması.
- **401 Unauthorized:** Sunucunun kimlik bilgisini eksik ya da geçersiz bulduğunu bildiren durum kodu.
- **`response.ok`:** HTTP yanıtının başarı durumunda olup olmadığını gösteren boolean özellik.

**Kendini yokla:** `fetch` yanıtında `status` 401 ise neden `.catch()` otomatik çalışmaz?  
*Cevap:* Çünkü HTTP hata durumu da bir yanıttır; `fetch` yalnızca ağ hatası gibi durumlarda reddedilir. `response.ok` kontrolünü kendin yapmalısın.

**Kendini yokla:** `Authorization: Bearer${token}` neden sorun çıkarır?  
*Cevap:* `Bearer` ile token arasındaki boşluk yoktur; sunucu beklediği başlık biçimini okuyamaz.
