---
title: "TMDB ile tanış"
minutes: 9
kind: concept
---

# TMDB ile tanış

:::pain[Problem]
Sinema'da arama kutusuna yeni bir film yazıyorsun; sonuç yok. Çünkü bugüne kadar yalnızca `sampleMovies` dizisinde aradın. Şimdi `/search/movie?query=...` adresinden canlı veri alman gerekiyor. İlk çıplak `fetch` denemesi 401 dönebilir; Türkçe başlıkları da ayrıca istemelisin.
:::

## İstek sözleşmesini oku

TMDB API'nin tabanı `https://api.themoviedb.org/3`. Hesabından aldığın **API Read Access Token** değerini kökteki `.env` dosyasında `VITE_TMDB_TOKEN=...` olarak tut. İstekte `Authorization: Bearer <token>` başlığı gönder. Vite'da `import.meta.env.VITE_TMDB_TOKEN` bunu okur; `VITE_` değerleri tarayıcı paketine girdiğinden üretim uygulamasında gizli kimlik bilgilerini sunucu tarafında korursun.

Liste ve detay isteklerinde `language=tr-TR` gönder. Böylece 550 numaralı film `Dövüş Kulübü` başlığıyla gelir. Dil parametresi çevrilmemiş her alanın mutlaka Türkçe olacağını garanti etmez.

| İhtiyaç | Yol | Ek parametre |
| --- | --- | --- |
| Haftalık trend | `/trending/movie/week` | `page=1` |
| Arama | `/search/movie` | `query=Matrix&page=1` |
| Tür | `/discover/movie` | `with_genres=28&page=1` |
| Detay ve kadro | `/movie/550` | `append_to_response=credits,videos` |
| Tür adları | `/genre/movie/list` | — |

:::tip[URL'yi birleştirme]
`query=Kara Şövalye` gibi boşluklu veya `&` içeren değerleri elle yapıştırma. `URLSearchParams` karakterleri uygun biçimde kodlar. Önce `language` ekle, sonra sayfaya özel parametreleri ekle.
:::

## Cevabın şekli

Liste cevabı `results` dışında `page`, `total_pages`, `total_results` taşır. `total_pages`, Sonraki düğmesini ne zaman durduracağını söyler. Film kartındaki `poster_path` tam URL değildir. Önceden yazdığın `posterUrl(path, 'w342')`, `https://image.tmdb.org/t/p/w342` tabanıyla yolu birleştirir; `null` poster'da görsel yerine alternatif metin gösterirsin. TMDB'nin `/configuration` cevabı uygun poster boyutlarını listeler (`w185`, `w342`, `w500`, `original` gibi).

`fetch` yalnızca ağ hatalarında kendiliğinden reddedilir. 401 ve 404 gibi HTTP cevaplarında `response.ok` kontrol etmelisin. TMDB hata gövdesi genelde `{ status_code, status_message }` biçimindedir: örneğin yetkisiz istekte `status_code: 7`, bulunamayan filmde `34`. Kullanıcıya okunur bir hata göstermek için gövdeyi okuyabilirsin; parse edilemezse HTTP durumuna dön.

## Bildiğin kavramlar burada büyüyor

Modül 5'te bir URL'ye `useFetch` bağladın. Şimdi URL, `q`, `genre`, `page` ve film `id` ile değişiyor: effect bağımlılığı ve cleanup önemli. Modül 6'daki `useSearchParams`, paylaşılabilir URL'yi tek doğru kaynak yapıyor. Favori id'ler Context'te kalıyor; gerçek film ayrıntıları API'den geliyor.

:::sector
Bu sürümde sayfalar veri isteğini ve loading/error durumlarını kendileri yönetecek. Aynı veriye geri dönünce yeni istek göreceksin. Bu gözlemleri sakla: sonraki modüllerde hangi araca gerçekten ihtiyaç duyduğunu gösterecekler.
:::
