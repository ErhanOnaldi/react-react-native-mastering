---
title: "HTTP anatomisi: İstek, cevap ve fetch"
minutes: 17
kind: concept
---

# HTTP anatomisi: İstek, cevap ve fetch

Sinema ana sayfasında film listesini göstermek için zaten `fetch()` kullanabilirsin. `fetch`, tarayıcının bir adrese istek göndermesini sağlar; bu istek ve sunucunun cevabı **HTTP** adı verilen web iletişim biçimini kullanır. İletişim iki parçalıdır: istemci bir **request** (istek) yollar, sunucu bir **response** (cevap) döner.

En küçük istek şöyle görünür:

```ts
fetch('/api/films')
```

Tarayıcı bu satırda sunucuyla konuşmaya başlar. Satırın kendisi henüz film listesini vermez; `fetch()` daha sonra gelecek cevabı temsil eden bir `Promise` döndürür.

## Önce bir cevabı oku

`fetch()` tamamlandığında sana JSON nesnesi değil, bir `Response` nesnesi verir. `Response` içinde sunucunun durumunu ve cevabın gövdesini okuma yollarını bulursun. Bu örnekte önce cevabı alıp JSON gövdesini okuyoruz:

```ts
async function loadFeaturedFilms() {
  const response = await fetch('/api/films/featured')
  const films = await response.json()
  return films
}
```

İlk `await`, ağ cevabı gelene kadar bekler; ikincisi cevap gövdesini okur. `response.json()` JSON metnini JavaScript değerine çevirir. Bu örnek yalnızca başarılı cevap varsayıyor; sunucu bir sorun bildirse de `fetch()` çoğu zaman cevap nesnesi verecektir.

### Örnek 2: Cevabın sonucunu kontrol et

Sunucu isteğin sonucunu **status code** (durum kodu) adı verilen sayıyla özetler. Örneğin `200` başarılı cevaptır, `404` kaynak bulunamadı demektir. `response.ok`, durum kodu `200` ile `299` arasındaysa `true` olur.

```ts
async function loadFeaturedFilmsSafely() {
  const response = await fetch('/api/films/featured')

  if (!response.ok) {
    throw new Error(`Film listesi alınamadı: HTTP ${response.status}`)
  }

  const films = await response.json()
  return films
}
```

Bu kez uygulama cevabın başarılı olup olmadığını gövdeyi okumadan denetliyor. Başarısızsa hata fırlatıp JSON gibi işlemiyor; başarılıysa gövdeyi okuyor. Böylece sunucunun hata cevabındaki farklı bir yapıyı film listesi sanma ihtimali azalıyor.

![HTTP istek ve cevap anatomisi ile fetch davranış modeli](diagram:http-istek-cevap)

## 404 neden `catch`'e kendi kendine düşmez?

Burada sık görülen bir yanılgı var: `fetch()` başarısız HTTP durumlarını otomatik hata saymaz. HTTP cevabı sunucudan geldiyse `404` veya `500` olsa bile `fetch()` Promise'i tamamlanır; `response.ok` ise `false` olur. Promise, ağ bağlantısı kurulamadığında veya tarayıcı cevabı güvenlik nedeniyle JavaScript'ten sakladığında reddedilebilir.

Şu kırık örnekte geliştirici `404` durumunun `catch`'e gideceğini sanıyor:

```ts
async function loadFilmTitle(id: string) {
  try {
    const response = await fetch(`/api/films/${id}`)
    const film = (await response.json()) as { title: string }
    return film.title
  } catch {
    return 'Film yüklenemedi'
  }
}
```

Sunucu `404` ile `{ "message": "Film bulunamadı" }` döndürürse `response.json()` yine başarılı olabilir. `catch` çalışmaz; `film.title` ise `undefined` olur. Belirti, ekranda boş başlık veya anlamsız bir değer görmendir. Çözüm, gövdeyi okumadan önce `response.ok` kontrol edip başarısız HTTP cevabını açıkça hataya çevirmektir.

Bu ayrımı küçük bir zaman çizelgesinde izleyelim:

| Sıra | Olan | Kodun gördüğü |
| --- | --- | --- |
| 1 | `fetch('/api/films/999')` gönderilir | Bekleyen bir Promise |
| 2 | Sunucu `404` ve hata gövdesi yollar | HTTP cevabı geldi |
| 3 | `await fetch(...)` devam eder | `Response`, `status: 404`, `ok: false` |
| 4 | `if (!response.ok)` çalışır | Uygulamanın fırlattığı hata |
| 5 | Üstteki `try/catch` bu hatayı yakalar | Hata mesajı gösterilebilir |

Yani `fetch()` ağ konuşmasının tamamlandığını bildirir; HTTP başarısını sen ayrıca kontrol edersin. İkisini ayırmak gerekir, çünkü sunucudan gelen her cevap uygulamanın istediği veriyi içermez.

## Büyütme: bazı başarılı cevaplarda gövde yoktur

Bir filmi favorilerden kaldırdığını düşün. Sunucu işlem başarılı olsa bile yeni bir JSON nesnesi göndermek zorunda değildir. `204 No Content`, “işlem başarılı, cevap gövdesi yok” anlamına gelir.

```ts
async function removeFilmFromFavorites(id: string): Promise<void> {
  const response = await fetch(`/api/favorites/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error(`Favori kaldırılamadı: HTTP ${response.status}`)
  }

  if (response.status === 204) return

  await response.json()
}
```

Burada `204` kontrolü JSON okumadan önce gelir. Boş cevaba `response.json()` uygularsan JSON ayrıştırıcısının okuyacağı metin yoktur ve hata alırsın. Her başarılı cevapta gövde bulunduğunu varsaymamak, API ile çalışırken seni bu hatadan korur.

## Gövdeyi tek sefer oku

Bir **response body** (cevap gövdesi), sunucunun veri taşıdığı kısımdır. Tarayıcı bu veriyi parça parça gelebilen bir **stream** (akış) olarak alır. `response.json()` akışı okuyup bitirir; aynı `Response` üzerinde sonra `response.text()` çağırmak ikinci okuma olacağından hata verir.

| Çağrı | Sonuç |
| --- | --- |
| `await response.json()` | Gövde okunur ve JavaScript değerine çevrilir |
| `await response.text()` | Gövde okunur ve metin olarak döner |
| Aynı cevapta ikinci bir okuma | Gövde tüketildiği için hata verir |

Örneğin bir hata gövdesini loglamak için önce `text()` çağırıp sonra `json()` çağırma. Hangi biçimde kullanacağına karar ver ve tek bir okuma yap. Bu davranışın nedeni, tarayıcının aynı ağ verisini sınırsız kez yeniden oynatmamasıdır.

HTTP isteği yöntem (örneğin `GET` veya `DELETE`), URL, başlıklar ve bazen bir gövdeden oluşur. Cevapta durum kodu, başlıklar ve varsa gövde bulunur. Bu yapıyı bilmek, Network panelinde bir isteğin ne gönderdiğini ve ne aldığını okumana da yardım eder.

:::info[Derinlemesine (isteğe bağlı)]
HTTP iletişimine “durumsuz” denmesi, her isteğin kendi başına anlaşılabilmesi gerektiği anlamına gelir; sunucu önceki isteği hatırlıyor varsayılmaz. İsim çözümleme (DNS), tarayıcının alan adını ağ adresine bulma adımıdır. `ReadableStream` ve `AbortController` ile akışı yönetmek ya da isteği iptal etmek mümkündür; bu ayrıntılar burada gereken cevap işleme akışını değiştirmez. Özel bir `HttpError` sınıfı, uygulamada durum kodu ve mesajı aynı hata nesnesinde taşımak için tercih edilebilir; temel akış için `Error` yeterlidir.
:::

## Özet

- `fetch()` bir `Response` verir; JSON verisi için cevap gövdesini ayrıca okursun.
- HTTP başarısını `response.ok` ile kontrol et; 4xx ve 5xx cevapları kendiliğinden `catch`'e düşmez.
- `204 No Content` başarılıdır ama gövdesi yoktur; JSON okumayı atla.
- Bir cevap gövdesini bir kez oku; `json()` ve `text()` aynı gövdeyi tüketir.

**Yeni terimler:** HTTP: tarayıcı ile sunucunun istek/cevap iletişim biçimi. Request: istemcinin gönderdiği istek. Response: sunucunun döndürdüğü cevap. Status code: cevabın sonucunu belirten sayı. Response body: varsa cevabın veri taşıyan kısmı. Stream: verinin akış halinde okunması.

**Kendini yokla:** Sunucu `500` döndürdüğünde `await fetch()` otomatik olarak hata verir mi?

*Cevap:* Hayır. Bir `Response` gelir ve `response.ok` false olur; hata davranışını uygulama kurar.

**Kendini yokla:** `204` cevabında neden `response.json()` çağırmamalısın?

*Cevap:* Çünkü 204 gövdesiz başarıdır; JSON olarak ayrıştırılacak veri yoktur.
