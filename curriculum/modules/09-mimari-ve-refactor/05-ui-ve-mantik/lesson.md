---
title: "Sayfayı incelt"
minutes: 9
kind: concept
---

# Sayfayı incelt

:::pain[Problem]
SearchPage hem `?q=` okuyor, hem isteği atıyor, hem loading/error gösteriyor, hem kartları çiziyor. Yeni bir sonuç görünümü eklemek 300 satırlık sayfaya dokunmak demek.
:::

## Sayfanın sorumluluğunu incelt

Bir sayfa hem URL okuyor, hem ağ isteğini yönetiyor, hem veriyi biçimlendiriyor, hem de JSX çiziyorsa değişikliklerin etkisi birbirine karışır. Davranışı uygun hook veya API fonksiyonuna, kullanıcıya gösterilen durumu ise component'e bırakmak sorumlulukları ayırır. Her hesaplama için ayrı hook yazmak gerekmez; basit türetilmiş değer render'da kalabilir.

Sinema SearchPage'in büyümesi, önceki custom hook bilgisini mimari düzeyde tekrar kullanma nedenidir. URL ile veri yüklemenin ayrılması, ileride özel fetch hook'undan TanStack Query'ye geçerken sayfa UI'ını daha az etkiler.

## İhtiyaçtan karar

Önce tekrarlanan davranışı custom hook’a taşı: parametreyi al, yükleme/başarı/hata durumunu döndür. Bileşen kullanıcıya ne gösterileceğine karar versin.

## Sinema’da dene

`useMovieDetails(id, load)` egzersizinde id değişince yeni film çekilmeli ve eski istek iptal edilmeli. Ancak sadece `movies.filter(...)` gibi türetilmiş değer için hook içinde effect ve ek state kurma.

## Sayfanın yaptığı işleri say

SearchPage’de üç ayrı sorumluluk var: URL’deki `q` değerini okumak, bu değere göre veri yüklemek ve sonuç durumunu göstermek. Önce yükleme davranışını `useMovieSearch(query)` gibi bir hook’a taşı. Hook `loading`, `success` veya `error` döndürür; sonuç bileşeni bu durumları kullanıcının göreceği metin ve listeye çevirir.

Detay ekranında yeni bir twist var: `id` değiştiğinde önceki istek hâlâ sürebilir. Effect’in dependency listesinde `id` bulunmalı ve cleanup eski isteği iptal etmeli. Böylece `/movie/550` isteği geç döndüğünde `/movie/603` ekranını ezmez. Sadece `movies.filter(...)` gibi senkron hesap için effect kurma; liste değiştiğinde render sırasında yeniden hesaplamak yeterlidir.

:::mistake[Sık hata]
Hook paylaşılabilir davranıştır, bütün UI’yi saklama yeri değildir. Yükleme ekranı ile boş sonuç mesajı ayrı kullanıcı durumlarıdır.
:::

:::sector[Sektörde]
Modül 12’de veri çekme hook’larının içi Query ile değişecek; sade bileşen arayüzü bu geçişi kolaylaştırır.
:::
