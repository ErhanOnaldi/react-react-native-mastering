---
title: "HTTP işini tek kapıda topla"
minutes: 18
kind: concept
---

# HTTP işini tek kapıda topla

Sinema'da bir film ararken tarayıcı TMDB'ye istek gönderir. `fetch` bu isteği yapar ve sunucudan gelen cevabı verir. İlk örnekte yalnızca cevabın başarılı olup olmadığını kontrol edelim:

```ts check
export async function isMovieAvailable(path: string): Promise<boolean> {
  const response = await fetch(`https://api.themoviedb.org/3${path}`)
  return response.ok
}
```

Bu fonksiyon 200 gibi başarılı cevaplarda `true`, 404 gibi başarısız HTTP cevaplarında `false` döndürür. `fetch` burada 404 için hata fırlatmaz; yalnızca ağ bağlantısı kurulamazsa Promise reddedilebilir. Bu ayrımı en başta görmek önemli, çünkü `try/catch` tek başına HTTP hatalarını yakalamaz.

## Önce aynı isteği bir kez daha kur

TMDB'nin film türlerini almak için de bir GET isteği gönderelim. `endpoint`, API'nin belirli bir kaynağa açtığı yoldur; burada `/genre/movie/list` tür listesinin yoludur. Bu istek de aynı TMDB kök adresini kullanır:

```ts check
export async function loadGenres(): Promise<unknown> {
  const response = await fetch('https://api.themoviedb.org/3/genre/movie/list')
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}
```

İlk örneğe göre yeni olan şey, başarısız cevabı hata olarak bildirmek ve başarılı gövdeyi okumaktır. Yine de her yeni kaynakta kök adresi, yetkilendirmeyi ve hata kontrolünü tekrar yazarsak bu satırlar farklılaşabilir. Ortak HTTP işini tek yerde toplayan fonksiyona **API client** denir; client, isteklerin tekrar eden teknik kurallarının sahibidir.

## Ortak kuralı bir kapıda tut

Bir sonraki örnekte yalnız kök adresi sabitliyoruz. `Bearer` yetkilendirme başlığının türüdür: token adı verilen erişim bilgisini istek başlığına koyar ve sunucuya isteği kimin yaptığını bildirir. Token'ı URL'ye yazmıyoruz; URL geçmişe ve sunucu kayıtlarına girebilir.

```ts check
function createCinemaClient(token: string) {
  return {
    async get<T>(path: string): Promise<T> {
      const response = await fetch(`https://api.themoviedb.org/3${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return (await response.json()) as T
    },
  }
}

const cinemaClient = createCinemaClient('yerel-token')
```

Şimdi film türü de, popüler filmler de aynı kökten ve aynı yetkilendirme başlığıyla istek gönderebilir. `createCinemaClient` ise yalnız ortak HTTP işini bilir; türlerin veya filmlerin Sinema'da ne anlama geldiğine karar vermez.

Bir **feature API**, ürün alanındaki bir işi adıyla sunan fonksiyondur. Örneğin `getMovieGenres()` tür endpoint'ini bilir; sayfa ise bu fonksiyonu çağırıp sonucu çizer. Böylece sayfa HTTP ayrıntılarıyla, client da ürün anlamıyla dolmaz:

```ts check
type Genre = { id: number; name: string }
type GenreResponse = { genres: Genre[] }
type CinemaClient = { get<T>(path: string): Promise<T> }

export function getMovieGenres(client: CinemaClient) {
  return client.get<GenreResponse>('/genre/movie/list')
}
```

Burada feature fonksiyonu tür listesinin endpoint'ini seçti; client kök adresi, header'ı ve HTTP başarı kontrolünü yaptı. Çağıran sayfanın bilmesi gereken şey `getMovieGenres` sonucudur, TMDB'nin URL biçimi değil. Client'a “her endpoint'te aynı mı?” diye sor: token başlığı ve dil parametresi ortak olabilir; yalnız film detayına ait `append_to_response` gibi seçimler feature API'de kalır.

![Sayfadan feature API ve ortak HTTP client üzerinden fetch'e giden çağrı](diagrams/api-client-akisi.svg "Endpoint anlamı ile HTTP protokolü ayrı katmandadır.")

## Bir 404 cevabını adım adım izle

Sinema `getMovieDetails(999999)` ile olmayan bir filmi istediğinde şu sıra oluşur. `status`, sunucunun HTTP cevabındaki sayısal sonuç kodudur; örneğin bulunamayan kaynak için 404'tür.

| Adım | Olan | Sonuç |
| --- | --- | --- |
| 1 | Sayfa film kimliğiyle feature fonksiyonunu çağırır | Sayfa ürün akışını yönetir |
| 2 | Feature API `/movie/999999` yolunu seçer | Film kaynağının anlamı burada bilinir |
| 3 | Client kök adresi ve `Authorization` başlığını ekler | Her istek aynı HTTP politikasını alır |
| 4 | `fetch` 404 cevabıyla tamamlanır | Promise reject olmaz; bir HTTP cevabı geldi |
| 5 | Client `response.ok === false` görür | Hata yolu seçilir, gövde en fazla bir kez okunur |
| 6 | Feature veya sayfa hatayı ele alır | Kullanıcıya “Film bulunamadı” gösterilebilir |

**HTTP hatası**, sunucudan gelen 404/500 gibi cevap; **ağ hatası** ise cevap hiç alınamadığında oluşur. HTTP hatasında status bilgisi vardır, ağ hatasında olmayabilir. Bu yüzden hata nesnesi HTTP ayrıntılarını saklayabilir; sayfa da kullanıcıya uygun mesajı seçer.

## Hata gövdesini güvenli oku

TMDB hata cevabında bazen açıklama bulunur, bazen gövde boş ya da geçersiz JSON'dur. Bu örnek HTTP cevabını kontrol eder, hata mesajını okumayı dener ve gövde okunamasa bile anlamlı bir varsayılanla hata fırlatır:

```ts check
type Movie = { id: number; title: string }

export async function loadMovie(path: string): Promise<Movie> {
  const response = await fetch(`https://api.themoviedb.org/3${path}`)
  if (!response.ok) {
    let message = `Film isteği başarısız (${response.status})`
    try {
      const body = (await response.json()) as { status_message?: string }
      if (body.status_message) message = body.status_message
    } catch {
      // Hata gövdesi JSON olmayabilir.
    }
    throw new Error(message)
  }
  return (await response.json()) as Movie
}
```

Kod gövdeyi yalnız seçilen dalda okur. HTTP hatasında önce hata mesajı okunur; başarıda ise film JSON'u okunur. Bir `Response` gövdesi akıştan gelir ve bir kez tüketilir; aynı cevapta hata gövdesini okuyup ardından başarı gövdesini okumaya çalışamazsın. Hata gövdesi bozuksa dar `try/catch` varsayılan mesajı korur.

:::mistake[Belirti: 404'te `catch` çalışmıyor]
**Belirti →** Olmayan filmin cevabı hata dalına uğramadan veri gibi işleniyor. **Neden →** `fetch`, HTTP 404 cevabıyla resolve oldu. **Düzeltme →** JSON'u başarı saymadan önce `response.ok` değerini kontrol et ve başarısızsa hata yoluna geç.
:::

:::mistake[Belirti: Türkçe arama `&` işaretinde bölünüyor]
**Belirti →** `Dövüş & suç` araması iki ayrı query parametresine dönüşüyor. **Neden →** Değer URL metnine elle birleştirilmiş. **Düzeltme →** `URL` ve `URLSearchParams` ile anahtar/değer ekle; bu API'ler boşluk, `&` ve Türkçe karakterleri doğru kodlar.
:::

TypeScript'te `get<Movie>()` gibi generic dönüş tipi, kodun beklediği veri biçimini derleme sırasında anlatır. **Runtime validation**, gelen JSON'u program çalışırken kurallarla kontrol edip güvenli tipe dönüştürmektir. Generic tek başına bunu yapmaz: sunucu yanlış biçimde `{ name: 3 }` gönderse bile cast edilmiş `Movie` türü çalışma anında kontrol yapmaz.

:::info[Derinlemesine (isteğe bağlı)]
Tarayıcıya derleme sırasında eklenen token, bundle adı verilen indirilebilir JavaScript dosyasında görülebilir; gizli kalması gereken bir sır tarayıcıya konmamalıdır. İstek için sunucu tarafında bir ara katman kullanabilirsin: **BFF** (Backend for Frontend), tarayıcı ile dış API arasında uygulamanın ihtiyacına göre istek yapan backend katmanıdır. Bu, token'ı sunucuda tutmaya yarar; fakat küçük Sinema client örneğinin kapsamı dışındadır.
:::

## Özet

- Sayfa kullanıcı akışını, feature API kaynak anlamını, API client ortak HTTP kurallarını taşır.
- `fetch` 4xx/5xx cevabında reject olmak zorunda değildir; `response.ok` ile açıkça dallan.
- HTTP ve ağ hatalarını ayır; hata gövdesi boş veya geçersiz olabilir.
- URL query değerlerini `URLSearchParams` ile ekle; token'ı URL'ye koyma.
- `get<Movie>()` TypeScript beklentisidir; sunucudan gelen JSON'u doğrulamaz.

**Yeni terimler**

- **API client:** Ortak HTTP istek kurallarını tek yerde yürüten yardımcı.
- **Endpoint:** API'de belirli bir kaynağa açılan yol.
- **Feature API:** Ürün alanındaki işi anlamlı adla çağırmaya yarayan fonksiyon.
- **Bearer:** Erişim token'ını `Authorization` başlığında gönderen yetkilendirme biçimi.
- **Runtime validation:** Gelen veriyi program çalışırken kurallarla denetleme.

**Kendini yokla:** `fetch` 500 cevabı aldığında neden `catch` çalışmayabilir?  
*Cevap:* 500 bir HTTP cevabıdır; `fetch` cevapla resolve olur. `response.ok` kontrolünü kendin yapmalısın.

**Kendini yokla:** `get<Movie>()` TMDB'nin doğru `Movie` JSON'u gönderdiğini kanıtlar mı?  
*Cevap:* Hayır. Generic yalnız TypeScript'e beklentiyi söyler; runtime validation ayrıca gerekir.
