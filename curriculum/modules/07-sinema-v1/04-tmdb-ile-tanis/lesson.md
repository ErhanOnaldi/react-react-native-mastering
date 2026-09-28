---
title: "TMDB ile tanış: Canlı API sözleşmesi"
minutes: 15
kind: concept
---

# TMDB ile tanış: Canlı API sözleşmesi

:::pain[Problem]
Sinema uygulamasında arama kutusuna "Oppenheimer" ya da "Yıldızlararası" yazıyorsun; arayüz tepkisiz kalıyor veya ekranda hiçbir sonuç belirmiyor. Çünkü bugüne kadar yazdığın tüm bileşenler projenin içine gömülmüş sabit `sampleMovies` dizisinden besleniyordu. Gerçek dünyada filmler sürekli güncellenir, binlerce başlık arasından aranır ve harici bir sunucudan çekilir. Doğrudan tarayıcıdan `fetch('https://api.themoviedb.org/3/search/movie?query=Matrix')` çağrısı yaptığında ise sunucu `401 Unauthorized` yanıtı veriyor ve konsolda `Invalid API key` uyarısı beliriyor. Üstelik filmler gelse bile başlıklar İngilizce dönüyor ve afiş yolları tek başına bir görsel üretmiyor!
:::

## Harici bir REST API ile iletişim kurmak

Modern web uygulamaları tek başlarına izole sistemler değildir. Bir e-ticaret sitesi ödeme sağlayıcısına, bir hava durumu uygulaması meteoroloji uydusuna, bir sinema platformu ise küresel film veritabanlarına bağlanır. Bu iletişim, sunucunun istemcilere sunduğu kurallar bütünü olan **API sözleşmesi** (API contract) üzerinden yürütülür.

API sözleşmesi sana üç temel konuyu kesin kurallarla bildirir:
1. **İstek adresi ve yöntemi:** Hangi veriyi almak için hangi HTTP yöntemini (`GET`, `POST` vb.) ve hangi URL patikasını kullanmalısın?
2. **Kimlik ve parametre kuralları:** Sunucu seni nasıl tanıyacak (başlıklar, token'lar) ve filtreleme seçeneklerini (arama terimi, sayfa numarası, dil) adrese nasıl iliştireceksin?
3. **Cevap ve hata şekli:** Başarılı bir istekte JSON gövdesi hangi nesne yapısıyla dönecek; istek hatalıysa durum kodu ve hata açıklaması nasıl raporlanacak?

Sinema uygulamasında dünyanın en popüler açık film arşivi olan **TMDB (The Movie Database)** API'sini kullanıyoruz. Şimdiye kadar öğrendiğin React bileşen yapısı, URL state yönetimi ve `useEffect` asenkron veri çekme modelleri geçerliliğini koruyor; değişen tek şey, verinin bellekteki statik bir diziden değil, okyanusun ötesindeki bir sunucudan canlı olarak akmasıdır.

![TMDB API İstek ve Görsel Akışı](diagrams/tmdb-istek-anatomisi.svg "İstemci, TMDB REST API ve Görsel CDN arasındaki veri akışı")

:::model[HTTP istek ve cevap anatomisi]
Modül 7.1'de öğrendiğin temel kuralı hatırla: Her HTTP isteği yöntem, adres, başlıklar ve gövdeden oluşur. `fetch` yalnızca ağ koptuğunda reddedilir; sunucunun döndüğü `401` veya `404` yanıtları başarılı bir Promise olarak çözülür. Bu yüzden harici bir servisle konuşurken ilk işin her zaman `response.ok` kontrolü yapmak ve gerekirse özel bir hata fırlatmaktır.
:::

## TMDB istek anatomisinin kesin kuralları

TMDB REST API ile güvenli ve doğru haberleşmek için şu numaralı kuralları tavizsiz uygulamalısın:

1. **Taban adres kuralı:** Tüm REST uç noktaları `https://api.themoviedb.org/3` taban URL'si ile başlar. Sürüm numarası (`/3`) adresin ayrılmaz bir parçasıdır.
2. **Kimlik doğrulama başlığı:** TMDB, v3 kimlik doğrulaması için modern **Bearer Token** standardını destekler. Her isteğin başlıklarında `Authorization: Bearer <Read_Access_Token>` bulunmalıdır. Token olmadan atılan her istek anında `401 Unauthorized` ile sonuçlanır.
3. **Çeviri ve dil parametresi:** TMDB içerikleri çok dillidir. Türkçe film başlıkları, özetler ve etiketler almak için her sorguya mutlaka `language=tr-TR` parametresi eklenmelidir. Dil parametresi unutulursa TMDB varsayılan olarak `en-US` içerik döndürür.
4. **Sorgu parametrelerinin kodlanması:** Arama metinleri (`query`), sayfa numaraları (`page`) veya tür filtreleri (`with_genres`) URL sorgu dizesine (query string) eklenmelidir. Boşluklar ve özel karakterler elle birleştirilmemeli; standart kodlama araçlarıyla güvenli hale getirilmelidir.
5. **Görseller ayrı bir CDN üzerindedir:** TMDB JSON cevaplarında gelen `poster_path` veya `backdrop_path` değerleri tam bir URL değildir (örneğin yalnızca `"/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"` döner). Bu yolu tam bir görsele dönüştürmek için TMDB görsel sunucu tabanı (`https://image.tmdb.org/t/p/`) ve istenen genişlik (`w185`, `w342`, `w500`, `original`) ile birleştirmen gerekir.

## Sık kullanılan TMDB uç noktaları

Uygulamanın farklı ekranları için TMDB sözleşmesinde tanımlanmış temel yollar şunlardır:

| İşlev | HTTP Yolu | Zorunlu / Önemli Parametreler | Örnek Amaç |
| --- | --- | --- | --- |
| Haftalık Trendler | `/trending/movie/week` | `language=tr-TR`, `page=1` | Ana sayfa vitrini |
| Film Arama | `/search/movie` | `query=<aranan>`, `language=tr-TR`, `page=1` | Arama sayfası |
| Tür Bazlı Keşif | `/discover/movie` | `with_genres=<id>`, `language=tr-TR`, `page=1` | Kategori filtreleme |
| Film Detayı | `/movie/:id` | `language=tr-TR`, `append_to_response=credits,videos` | Film sayfası ve kadro |
| Tür Listesi | `/genre/movie/list` | `language=tr-TR` | Filtre açılır kutusu |

Detay isteğindeki `append_to_response=credits,videos` parametresi, HTTP istek sayısını düşürmek için harika bir optimizasyondur. Normalde filmin detayını, oyuncu kadrosunu ve tanıtım fragmanlarını almak için 3 ayrı istek atman gerekirken, bu parametre sayesinde TMDB tüm bu verileri tek bir JSON gövdesinde birleştirip gönderir.

:::model[URL tek doğru kaynaktır]
Modül 6'da kurduğumuz zihinsel modeli anımsa: Arayüzdeki filtreler ve arama terimleri yerel bir `useState` içinde hapsedilmemelidir. Kullanıcının aradığı metin ve seçtiği sayfa tarayıcının URL'sinde (`?q=Matrix&page=2`) yaşamalıdır. Sayfa yenilendiğinde veya bağlantı paylaşıldığında bu parametreler okunur ve doğrudan TMDB istek URL'sine aktarılır.
:::

## Adım adım iz sürme: Bir arama isteğinin yolculuğu

Kullanıcı arama kutusuna "Dövüş Kulübü" yazıp arama yaptığında tarayıcı ile TMDB arasında saniyeler içinde gerçekleşen adımları izleyelim:

| Adım | İşlem Noktası | Yapılan İşlem | Oluşan Veri / Başlık | Arayüz Durumu |
| --- | --- | --- | --- | --- |
| 1 | Router / URL | Kullanıcı etkileşimi URL parametresini günceller | `?q=Dövüş Kulübü&page=1` | Arama input'u güncel |
| 2 | İstek Hazırlığı | Taban, yol ve parametreler güvenle birleştirilir | `https://api.themoviedb.org/3/search/movie?language=tr-TR&query=D%C3%B6v%C3%BC%C5%9F+Kul%C3%BCb%C3%BC&page=1` | Yükleniyor durumu aktif |
| 3 | Ağ Gönderimi | Tarayıcı `fetch` ile yetki başlığını ekleyip isteği yollar | `Authorization: Bearer eyJhbGciOi...` | Yükleniyor animasyonu |
| 4 | TMDB Sunucusu | Token doğrulanır, arama yapılır, Türkçe kayıtlar çekilir | HTTP 200 OK + JSON Gövdesi (`results`, `total_pages`) | Beklemede |
| 5 | Yanıt İnceleme | `response.ok` kontrol edilir, gövde JSON olarak çözülür | `{ page: 1, results: [{ id: 550, title: "Dövüş Kulübü", ... }] }` | Veri state'e yazılır |
| 6 | Görsel Çözümü | Her filmin `poster_path` değeri CDN tabanıyla birleştirilir | `https://image.tmdb.org/t/p/w342/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg` | Film kartları ekranda |

## Kod örnekleri: Önce kırık, sonra doğru

### Kırık yaklaşım: Elle string birleştirmek ve yetkiyi unutmak

Aşağıdaki örnekte sıkça yapılan üç vahim hata bir aradadır:

```tsx
// ❌ KIRIK: Elle URL birleştirme, eksik header ve gövde kontrolü yok
export function BadMovieSearch({ query }: { query: string }) {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    // 1. HATA: Boşluklar veya & işaretleri URL'yi bozar!
    // 2. HATA: Authorization başlığı unutulmuş, TMDB 401 dönecek!
    fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&language=tr-TR`)
      .then((res) => {
        // 3. HATA: res.ok kontrolü yok! 401 hatası gelse bile json() çalışıp çöker!
        return res.json()
      })
      .then((data) => setMovies(data.results))
  }, [query])

  return <div>{/* ... */}</div>
}
```

Eğer kullanıcı `Matrix & Reloaded` ararsa, `&` karakteri query ayracı sanılır ve TMDB isteği yanlış parametrelerle işler. Üstelik yetki başlığı olmadığı için sunucu 401 döner, `data.results` alanı `undefined` gelir ve bileşen ekranda patlar.

### Doğru yaklaşım: URLSearchParams ve yetkili istemci

İstek adresini standart `URL` ve `URLSearchParams` nesneleriyle kurup, yetkilendirmeyi ve hata kontrolünü eksiksiz ele alalım:

```ts check
// Derlenebilir bağımsız yardımcı modül
export interface ApiUrlOptions {
  path: string
  params?: Record<string, string | number | undefined>
  defaultLanguage?: string
}

export function createApiEndpoint({
  path,
  params = {},
  defaultLanguage = 'tr-TR',
}: ApiUrlOptions): string {
  const baseUrl = 'https://api.themoviedb.org/3'
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const fullUrl = new URL(normalizedPath, `${baseUrl}/`)

  fullUrl.searchParams.set('language', defaultLanguage)

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      fullUrl.searchParams.set(key, String(value))
    }
  }

  return fullUrl.toString()
}

export async function requestFromTmdb<T>(
  url: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    try {
      const errorPayload = (await response.json()) as { status_message?: string }
      if (errorPayload.status_message) {
        errorMessage = errorPayload.status_message
      }
    } catch {
      // Hata gövdesi geçerli JSON değilse temel HTTP durumunu koru
    }
    throw new Error(errorMessage)
  }

  return (await response.json()) as T
}
```

Bu temiz yapıda:
1. `URLSearchParams`, Türkçe karakterleri (`ğ`, `ı`, `ş`), boşlukları ve `&` gibi ayraçları otomatik olarak RFC standartlarında kodlar.
2. `undefined` değerler filtrelenir; böylece `page=undefined` gibi anlamsız istek parametreleri oluşmaz.
3. `Authorization: Bearer` başlığı her zaman güvenle eklenir.
4. `!response.ok` durumu yakalanır ve TMDB'nin döndüğü anlamlı hata mesajı (`status_message`) okunup `Error` nesnesine dönüştürülür.

## Sınır durumları ve sık yapılan hatalar

:::mistake[Afiş yolunu tek başına `<img src>` içine yazmak]
- **Belirti:** Film kartlarında resimler yüklenmiyor, kırık görsel ikonu görünüyor veya konsolda `GET http://localhost:5173/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg 404 Not Found` hatası çıkıyor.
- **Neden:** TMDB `poster_path` alanında tam adres değil, yalnızca dosya adını (`/xyz.jpg`) verir. Tarayıcı bunu yerel bir göreli yol sanıp uygulamanın çalıştığı Vite portundan istemeye çalışır.
- **Düzeltme:** Bir görsel oluşturucu yardımcı yaz: `path ? `https://image.tmdb.org/t/p/w342${path}` : undefined`. Eğer `path` null ise görsel yerine yer tutucu bir kart veya alternatif metin göster.
:::

:::mistake[Vite ortam değişkenlerini unutmak veya yanlış isimlendirmek]
- **Belirti:** Tüm istekler istisnasız `401 Unauthorized` ile başarısız oluyor. `requests()` kaydında `Authorization: Bearer undefined` görünüyor.
- **Neden:** `.env` dosyasında anahtar adı `VITE_` önekiyle başlamamıştır (örneğin sadece `TMDB_TOKEN=...` yazılmıştır). Vite, güvenlik gereği istemci koduna yalnızca `VITE_` ile başlayan değişkenleri dahil eder.
- **Düzeltme:** Değişken adını `.env` içinde `VITE_TMDB_TOKEN=...` olarak tanımla ve kodda `import.meta.env.VITE_TMDB_TOKEN` ile oku.
:::

:::mistake[Geçersiz veya boş parametreleri `null` olarak URL'ye basmak]
- **Belirti:** Sayfalama veya tür filtrelerinde sunucu `400 Bad Request` veya `Invalid genre id` hatası dönüyor.
- **Neden:** `params.genre` seçilmediğinde nesneye `{ with_genres: null }` verilmiş ve URL'ye `?with_genres=null` olarak yazılmıştır. TMDB bu metni sayıya çeviremeyip isteği reddeder.
- **Düzeltme:** URL parametrelerini oluştururken `null`, `undefined` veya boş metin olan değerleri sorguya hiç ekleme.
:::

:::sector
Sektördeki kurumsal projelerde harici API anahtarları iki kategoriye ayrılır:
1. **Genel istemci token'ları (Public Client Keys):** TMDB okuma token'ı gibi yalnızca veri okumaya yarayan ve kötüye kullanım riski sınırlı olan anahtarlar ön uç ortam değişkenlerinde (`VITE_`) tutulabilir. Ancak unutma: `VITE_` değişkenleri derleme anında JavaScript kodunun içine düz metin olarak gömülür. Sayfa kaynağını inceleyen herhangi biri bu token'ı görebilir!
2. **Hassas özel sırlar (Private Secrets):** Kullanıcı oturum açma sırları, Stripe ödeme anahtarları veya veritabanı şifreleri asla bir React uygulamasının içine konmaz. Sektörde bu çağrılar için React uygulaması ile harici servis arasına bir **BFF (Backend for Frontend)** veya proxy sunucusu (örneğin ASP.NET Core ya da Node.js API) yerleştirilir. React yalnızca kendi güvenli sunucusuyla konuşur; harici API anahtarlarını sunucu arka planda gizler.
:::

## Özet

- TMDB REST API, `https://api.themoviedb.org/3` tabanında çalışır ve `Authorization: Bearer <Token>` başlığı zorunludur.
- Türkçe içerik için her istekte `language=tr-TR` query parametresi gönderilmelidir.
- Sorgu parametreleri asla elle metin olarak birleştirilmemeli; `URLSearchParams` veya standart URL nesneleriyle ayrıştırılmalı ve kodlanmalıdır.
- TMDB hata yanıtlarında `status_code` ve `status_message` alanlarını döner. `fetch` bu hatalarda reddedilmediği için `response.ok` kontrolü ile hata fırlatılmalıdır.
- Görsel yolları (`poster_path`) yalnızca dosya adıdır; `https://image.tmdb.org/t/p/<boyut>` tabanıyla birleştirilmelidir ve `null` durumu mutlaka yönetilmelidir.

---

### Kendini yokla

**1. TMDB'ye attığın istek konsolda `401` döndü ve JSON gövdesinde `status_code: 7` yazıyor. Sorun nedir?**
*(Cevap: İstekte `Authorization: Bearer <token>` başlığı eksiktir veya geçersiz bir API token'ı kullanılmıştır.)*

**2. Kullanıcının arama kutusuna yazdığı "Yıldızlararası & Uzay" ifadesini doğrudan string template ile URL'ye eklersen ne tehlike doğar?**
*(Cevap: `&` karakteri URL sözdiziminde sorgu parametresi ayracıdır. Sunucu bunu tek bir sorgu yerine `query=Yıldızlararası` ve tanımsız bir `Uzay` parametresi olarak algılar. Çözüm, `URLSearchParams` ile güvenli kodlamadır.)*
