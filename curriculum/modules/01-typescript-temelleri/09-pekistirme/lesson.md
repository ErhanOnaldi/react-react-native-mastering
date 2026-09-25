---
title: Liste cevabını birleştir
minutes: 9
kind: practice
---

# Liste cevabını birleştir

:::pain[Problem]
Tek bir `Movie` güvenli olsa da API cevabının `results` ve sayfa sayıları yanlış modellenirse Sinema listesi yine bozulur.
:::

## Birkaç fikri birlikte kullan
Bu derste `MovieListResponse` ile sayfalama bilgisini tarif edeceksin; sonra eksik poster ve boş tarihi normalize edeceksin. `map` sonucu yeni bir dizi üretir; kaynak filmi değiştirmez.

```ts check
type Movie = { id: number; poster_path: string | null; release_date: string }
const movies: Movie[] = [{ id: 550, poster_path: null, release_date: '' }]
const labels = movies.map((movie) => movie.release_date || 'Tarih yok')
void labels
```

## Sınırlar
Tipli cevap, sunucunun sözleşmeye uyduğunu varsayar. Bu aşamada `Movie` alanlarını doğru modellemek ve null/boş değerleri işlemek yeterli; ağdan gelen ham veriyi doğrulamayı ileride ekleyeceğiz.

:::sector
Liste tipi birden çok endpoint'te tekrarlanmaya başlarsa generic bir `Paginated<T>` ihtiyacı doğacak. Bu Module 2'nin konusu.
:::

## Dış sözleşme ve iç görünüm
`MovieListResponse` TMDB'nin gönderdiği kabı anlatır: sayfa, sonuçlar ve toplamlar. `normalizeMovie` ise her ham filmden ekranda kullanacağın başka bir nesne üretir. Kaynak `release_date: ''` olarak kalabilir; görünüm `year: 'Tarih yok'` gösterebilir. Böylece API'nin gerçeğini saklamadan kullanıcıya anlamlı metin verirsin.

`results.map(normalizeMovie)` ile bütün sayfayı dönüştürmek mümkün olur. Burada `map` hem önceki dizi dersini tekrarlar hem de tipli fonksiyonla birleşir: `Movie[]` içindeki her öğe, parametrenin istediği şekle uyarsa sonuç `DisplayMovie[]` olur. Fonksiyonlar arasındaki tip uyumunu derleyici takip eder.

## Kontrol noktası
Bir filmde poster null ve tarih boşsa iki kararı birbirinden bağımsız ver. Posteri null bırakmak kartın fallback görselini seçmesine izin verir. Yılı görünüm metnine çevirmek kartın boş görünmesini önler. Aynı fonksiyonda kaynak nesneyi değiştirme; yeni bir nesne döndür. Bu alışkanlık sonraki React state dersinde önem kazanacak.

:::mistake
Liste cevabını `Movie[]` diye adlandırmak sayfa bilgisini kaybettirir. `results` yalnızca cevabın bir alanıdır.
:::
