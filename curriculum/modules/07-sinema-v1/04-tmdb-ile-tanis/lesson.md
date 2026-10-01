---
title: "TMDB ile tanış: Canlı API sözleşmesi"
minutes: 18
kind: concept
---

# TMDB ile tanış: Canlı API sözleşmesi

Şimdiye kadar Sinema'daki filmleri `sampleMovies` gibi uygulamanın içindeki bir diziden okuyordun. Gerçek film kataloğunda binlerce kayıt ve sürekli güncellenen bilgiler var; bunları TMDB adlı film veritabanı sunucusundan isteyeceğiz. Bir sunucunun hangi adresi, bilgileri ve yetkiyi beklediğini anlatan kurallara **API sözleşmesi** denir. Bu sözleşmeye uymamız önemlidir: doğru istek doğru filmi getirir, yanlış istek ise anlaşılır bir hata verir.

![TMDB API İstek ve Görsel Akışı](diagrams/tmdb-istek-anatomisi.svg "İstemci, TMDB REST API ve Görsel CDN arasındaki veri akışı")

## Önce arama metnini güvenle taşıyalım

Kullanıcı `Kara Şövalye & Matrix` aradığında bu metni URL'ye doğrudan eklemek cazip gelir. Fakat URL'deki `&` işareti yeni bir parametre başlatır; sunucu metni iki parçaya ayırabilir. URL'nin `?` işaretinden sonraki anahtar-değer bölümüne **query string** denir. `URLSearchParams`, bu bölümdeki özel karakterleri senin için kodlayan tarayıcı aracıdır.

Önce yalnızca arama metnini kodlayalım:

```ts check
const params = new URLSearchParams()
params.set('query', 'Kara Şövalye & Matrix')

console.log(params.toString())
// query=Kara+%C5%9E%C3%B6valye+%26+Matrix
```

`&` karakteri `%26` olarak taşınır; böylece metnin içindeki işaret parametre ayıracı gibi davranmaz. Türkçe harfler ve boşluklar da URL'nin taşıyabileceği biçime çevrilir. Bu kod yalnızca parametre bölümünü kurdu; istek adresinin geri kalanını henüz eklemedik.

Bir filmin ayrıntı sayfasına istek atarken bilinen adresi `URL` nesnesiyle kurabiliriz. `URL`, adresin sunucu ve yol gibi bölümlerini birlikte yönetir:

```ts check
const url = new URL('/3/movie/550', 'https://api.themoviedb.org')
url.searchParams.set('language', 'tr-TR')

console.log(url.toString())
// https://api.themoviedb.org/3/movie/550?language=tr-TR
```

Burada `/3/movie/550` TMDB'nin tek bir filmin ayrıntısını veren yoludur. `language=tr-TR` isteğin Türkçe başlık ve özet tercih ettiğini söyler; dil seçimi erişim izni vermez. URL nesnesini kullanınca adresin parçalarını elle `?` ve `&` ile birleştirmen gerekmez.

Şimdi aynı fikri tür keşfinde kullanalım. `URLSearchParams` üzerinde `set` ile aynı anahtarı yeniden yazarsan önceki değer güncellenir. `undefined` ise seçilmemiş bir filtreyi temsil eder; onu adrese koymamak için parametreleri eklemeden önce kontrol ederiz.

```ts check
const discoverUrl = new URL(
  '/3/discover/movie',
  'https://api.themoviedb.org',
)
const filters: Record<string, string | number | undefined> = {
  language: 'tr-TR',
  with_genres: 18,
  page: undefined,
}

for (const [key, value] of Object.entries(filters)) {
  if (value !== undefined) {
    discoverUrl.searchParams.set(key, String(value))
  }
}

console.log(discoverUrl.searchParams.toString())
// language=tr-TR&with_genres=18
```

Tür filtresi adrese eklendi, ama sayfa numarası `undefined` olduğu için eklenmedi. `undefined` değerini önce metne çevirseydik istek `page=undefined` içerirdi; sunucu geçerli bir sayfa numarası beklediğinden bu, hatalı bir istek olurdu. Bu küçük kontrol, isteğe bağlı filtreleri kullanışlı kılar.

## TMDB isteği için yetki ve dil

İstek adresini kurduk, ama TMDB'ye film arşivini okuyabileceğimizi de bildirmeliyiz. **Token**, sunucunun isteği yapan uygulamayı tanıması için verilen erişim bilgisidir. TMDB bu bilgiyi `Authorization` başlığında `Bearer` sözcüğüyle birlikte bekler. `language=tr-TR` çeviri tercihi, Bearer token ise erişim iznidir; ikisi ayrı amaç taşır.

En küçük istek, bilinen bir TMDB adresine yetki başlığını ekler:

```ts check
const token = 'ornek-okuma-tokeni'
const response = await fetch(
  'https://api.themoviedb.org/3/trending/movie/week?language=tr-TR',
  {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  },
)
```

Bu istek haftanın trend filmlerini ister. `Authorization` başlığı olmadan ya da geçersiz token ile sunucu `401 Unauthorized` döndürebilir. `Accept` başlığı, cevabı JSON biçiminde beklediğimizi belirtir.

Bir ağ cevabı gelmiş olması, isteğin başarılı olduğu anlamına gelmez. `fetch` ağ kesintisinde reddedilir; `401` veya `404` gibi HTTP cevaplarında ise yine bir `Response` verir. Bu yüzden cevabı JSON'a çevirmeden önce `response.ok` değerini kontrol etmeliyiz:

```ts check
async function loadTrending(token: string) {
  const response = await fetch(
    'https://api.themoviedb.org/3/trending/movie/week?language=tr-TR',
    { headers: { Authorization: `Bearer ${token}` } },
  )

  if (!response.ok) {
    throw new Error(`TMDB isteği başarısız: ${response.status}`)
  }

  return response.json()
}
```

Başarılı cevapta `response.json()` gövdeyi JavaScript verisine dönüştürür. Hata cevabında ise önce HTTP durumunu hata olarak fırlatıyoruz; böylece bileşen başarısız cevabı film listesiymiş gibi işlemeye çalışmaz. `response.ok` kontrolünün nedeni budur.

Arama isteğinin kullanıcıdan ekrana uzanan sırasını birlikte izleyelim. `Dövüş Kulübü` araması için URL'de `q` ve sayfa bilgisi bulunur; tarayıcı bu bilgiyle TMDB isteğini hazırlar.

| Adım | Ne olur? | Örnek değer | Arayüzde ne görürsün? |
| --- | --- | --- | --- |
| 1 | Kullanıcı arama yapar; arama ve sayfa URL'de güncellenir. | `?q=Dövüş Kulübü&page=1` | Arama alanında yazdığı metin |
| 2 | İstek adresi ve query string hazırlanır. | `/3/search/movie?language=tr-TR&query=D%C3%B6v%C3%BC%C5%9F+Kul%C3%BCb%C3%BC&page=1` | Yükleniyor durumu |
| 3 | Tarayıcı yetki başlığıyla TMDB'ye isteği yollar. | `Authorization: Bearer …` | Yükleniyor durumu sürer |
| 4 | TMDB yetkiyi ve arama metnini işler, JSON cevaplar. | `200 OK`, `results`, `total_pages` | İstek cevabı beklenir |
| 5 | Kod önce `response.ok` değerini, sonra JSON gövdesini okur. | `results: [{ id: 550, title: "Dövüş Kulübü" }]` | Film verisi ekrana aktarılır |
| 6 | Kart, varsa afiş yolunu tam görsel adresine çevirir. | `https://image.tmdb.org/t/p/w342/…jpg` | Afiş ve film kartı görünür |

Tabloda sıra önemlidir: istek hazırlanıp yollanmadan cevap gelemez; `response.ok` kontrol edilmeden de başarılı JSON varsayamayız. Arama metni URL'de durduğu için yenileme ve paylaşma sonrasında aynı sorguyu yeniden kurmak da mümkün olur.

## Gerçek hatayı tanı: 401 ve boş afiş

Öğrencinin sık göreceği hata şu: arayüz boş kalır ve Console'da `Invalid API key` görünür. Bunu tanımak için iki bilgiyi ayır: `401` yetki sorunudur, `language` ise yalnızca cevap dilini seçer.

```ts
// Yanlış varsayım:
// ?language=tr-TR ekledim, demek ki TMDB isteğine izin verildi.

// Düzeltme:
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/json',
}
```

Belirti `401` ise dil parametresini kaldırmak çözmez; isteğe doğru Bearer token eklemelisin. Dil ve yetkiyi tek bir ayar sanmak bu hataya götürür.

Bir diğer tuzak afiş adresidir. TMDB cevabındaki `poster_path` tam adres değil, örneğin `/abc123.jpg` gibi yalnızca dosya yoludur. Bu yolu doğrudan `<img src>` içine koyarsan tarayıcı resmi Sinema uygulamasının kendi adresinde arar ve `404` alırsın. `CDN` (içeriği kullanıcılara yakın sunuculardan ulaştıran dağıtım ağı), TMDB'de görselleri sunan ayrı adrestir; yolun başına görsel tabanını ve bir boyut ekle:

```ts check
function posterUrl(path: string | null): string | undefined {
  return path
    ? `https://image.tmdb.org/t/p/w342${path}`
    : undefined
}
```

`path` yoksa `undefined` döndürürüz; olmayan bir görsele istek atmaktansa kartta yer tutucu gösterebilirsin. Örnek olarak `/abc123.jpg` yolu `https://image.tmdb.org/t/p/w342/abc123.jpg` olur.

## Aynı sunucuda farklı film yolları

**API (Application Programming Interface)**, bir programın başka bir programdan hangi yollarla veri isteyebileceğini tanımlar. TMDB'de her yolun işi ayrıdır; arama metnini film ayrıntısı isteyen yola gönderemezsin. Sinema ekranlarında kullanacağımız başlıca yollar şöyle:

| Ekrandaki iş | TMDB yolu | Önemli parametre |
| --- | --- | --- |
| Haftanın trendleri | `/trending/movie/week` | `language=tr-TR`, `page=1` |
| Arama sonuçları | `/search/movie` | `query`, `language=tr-TR`, `page` |
| Türe göre keşif | `/discover/movie` | `with_genres`, `language=tr-TR`, `page` |
| Film ayrıntısı | `/movie/:id` | Film kimliği ve `language=tr-TR` |
| Tür seçimi | `/genre/movie/list` | `language=tr-TR` |

Örneğin `with_genres` tür filtresinin kimliğini, `page` ise sonuçların hangi bölümünü istediğini taşır. Yolu ve parametreleri seçerken önce ekranda hangi bilgiyi göstereceğini düşün; sonra ona karşılık gelen TMDB yolunu kullan.

## Token'ı nerede tutmalı?

Sinema bir Vite uygulaması. **Vite environment variable**, geliştirme ve derleme sırasında uygulamaya verilen ayardır; `.env` dosyasında `VITE_TMDB_TOKEN=...` adıyla tutulur ve kodda `import.meta.env.VITE_TMDB_TOKEN` ile okunabilir. Vite istemci koduna yalnızca `VITE_` ile başlayan ayarları açar. Bu kullanışlıdır, ama bu token'ı gizli yapmaz: tarayıcıya gönderilen JavaScript'i inceleyen kişi değerini görebilir.

TMDB'nin okuma token'ı tarayıcı uygulamalarında kullanılabilen bir erişim bilgisidir; yine de kota ve kötüye kullanım riski vardır. Veritabanı parolası veya ödeme anahtarı gibi gizli bir **secret** (gizli anahtar) istemciye konmamalı. Böyle bir sır gerekirse React uygulaması kendi sunucusuna istek yollar, sunucu dış servise gizli anahtarıyla bağlanır.

:::info[Derinlemesine (isteğe bağlı)]
Bu sunucu düzenine **BFF (Backend for Frontend)** denir: ön yüz için ayrı bir arka uç katmanı istekleri karşılar ve dış servislerle konuşur. TMDB'nin `/movie/:id` adresi yanında `append_to_response=credits,videos` kullanmak da ayrıntı, oyuncu kadrosu ve videoları tek cevapta toplayabilir; böylece bu örnek için üç ayrı istek yerine bir istek yeter. Uygulamada bu optimizasyona ihtiyaç çıkarsa kullan.
:::

## Özet

- TMDB adresi `https://api.themoviedb.org/3` tabanını kullanır; `URL` ve `URLSearchParams` adres ve parametreleri güvenle kurar.
- `language=tr-TR` cevap dilini seçer; `Authorization: Bearer <token>` erişim iznini taşır.
- `undefined` filtreyi URL'ye ekleme. Arama metnindeki `&`, boşluk ve Türkçe harfleri elle kodlamak yerine tarayıcı araçlarını kullan.
- `fetch` için `response.ok` kontrol et; hata cevabını başarılı JSON gibi kullanma.
- `poster_path` tam adres değildir; TMDB görsel tabanına ekle ve yol boşsa yer tutucu göster.

### Yeni terimler

- **API sözleşmesi:** İstemci ile sunucunun adres, veri ve yetki konusunda anlaştığı kurallar.
- **Query string:** URL'deki `?` sonrasında yer alan parametreler bölümü.
- **Token:** Sunucunun isteği tanıması ve yetkilendirmesi için kullanılan erişim bilgisi.
- **CDN:** İçeriği kullanıcılara yakın sunuculardan ulaştıran dağıtım ağı.
- **Vite environment variable:** Derlemede uygulamaya verilen ayar; `VITE_` ile başlayanlar istemciye görünür.
- **BFF:** Ön yüz adına dış servislerle konuşan arka uç katmanı.

### Kendini yokla

**1.** TMDB `401` döndürdüğünde `language=tr-TR` parametresi yetki sağlar mı?

*Cevap: Hayır. Dil parametresi çeviri tercihini belirtir; `Authorization: Bearer <token>` başlığı erişim bilgisini taşır.*

**2.** `poster_path` değeri `/abc123.jpg` ise neden bunu doğrudan `src` olarak kullanmak yetmez?

*Cevap: Bu yalnızca yol parçasıdır. TMDB görsel tabanını ve boyutunu ekleyerek tam URL kurmalıyız.*
