---
title: "Tipin susturduğu çökme"
minutes: 8
kind: concept
---

# Tipin susturduğu çökme

:::pain[Problem]
TMDB, Dövüş Kulübü detayında `title: null` döndürdü. `getJson<MovieDetails>` bunu string sandı; başlığı işleyen ekran çöktü.
:::

## Neden bu araç?

TypeScript yalnızca derleme anında çalışır. `as MovieDetails` ya da generic dönüş tipi JSON içeriğini denetlemez. Formun alan kuralları da ayrı yerde tutulunca aynı kopukluk oluşur.

## Sinema'da bir adım ileri

Yanıtı önce `unknown` say. Elle `typeof` kontrolü bir alanı kurtarır; iç içe `credits.cast` ve liste öğeleri eklenince kontroller hızla çoğalır. Bir sonraki derste bu kontrolleri şemada birleştireceğiz.

## Bildiğin yöntemle dene

2. modüldeki generic fonksiyonun şu çağrısını düşün: `getJson<MovieDetails>('/movie/550')`. TypeScript `title` için string otomatik tamamlama sunar. Sunucu aynı alana `null` koyduğunda derleyici bunu göremez. `movie.title.toUpperCase()` ancak tarayıcıda patlar. Bu dersin ilk sorusu tam olarak bu iddiayı sorguluyor.

Nesne olduğunu doğruladıktan sonra elle bir type guard yazabilirsin: `typeof raw.title === 'string'`. Bu, başlık için gerçek kanıttır. Ama detay ekranı `genres[]`, `credits.cast[]` ve videoları da okuyunca her seviyeye yeni kontroller gerekir. Tekrarlı kuralların nerede tutulacağını seçmek artık önemli hale gelir.

Formda da benzer bir kopukluk var: RHF `register` kuralı adı zorunlu tutarken ayrı `WatchlistValues` tipi sadece `string` diyor. Tip, boş stringi geçerli sanır. Şemayı hem kural hem tip kaynağı yaptığımızda iki kopukluk aynı yerde çözülür.

:::mistake[Sık hata]
`as MovieDetails` yazınca TMDB yanıtı değişmez; hatayı yalnızca TypeScript’ten saklarsın.
:::

:::sector
API yanıtını alır almaz kontrol etmek, çöküşü film başlığı render edilmeden yakalar.
:::
