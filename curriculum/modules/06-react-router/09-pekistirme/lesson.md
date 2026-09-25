---
title: "Paylaşılabilir arama ekranı"
minutes: 9
kind: practice
---

# Paylaşılabilir arama ekranı

:::pain[Problem]
`/search?q=Matrix&page=3&genre=28` linki açıldı. Input "Matrix" demeli, 3. sayfa ve Aksiyon filtresi uygulanmış görünmeli. Şimdi query "Dövüş" olunca eski 3. sayfada kalırsa boş sonuç gösterme hatası geri gelir.
:::

## Birleştir

Önce URL'deki üç değeri okuyup güvenli varsayılanlar üret. Sonra statik film listesini filtrele, sayfala ve kontrolleri URL'ye bağla. Query veya genre değişince yalnızca `page` sıfırlanır; diğer filtre korunur. Sayfa değişince `q` ve `genre` korunur.

## Kontrol et

1. Linki doğrudan açınca aynı ekranı gör.
2. Bir filtre değiştirince sayfanın 1'e döndüğünü gözle.
3. Geri tuşu ile eski URL'ye ve eski seçime dön.
4. Geçersiz `page=abc` ya da `page=0` ile ekranın kırılmadığını gör.

:::mistake[Sık hata]
Filtrelenmiş liste uzunluğunu değil tüm listenin uzunluğunu sayfalarsan son sayfalarda boş kartlar çıkabilir. Önce filtrele, sonra dilimle.
:::

:::sector
Buradaki liste statik. Modül 7'de aynı URL değerleri TMDB aramasına ve `page` parametresine dönüşecek.
:::
