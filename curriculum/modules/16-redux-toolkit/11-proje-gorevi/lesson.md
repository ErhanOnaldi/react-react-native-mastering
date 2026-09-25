---
title: "Sinema’yı store’a taşı"
minutes: 10
kind: project
---

# Sinema’yı store’a taşı

:::pain[Sinema’da sorun]
Beş Context provider’ı büyüdü. Sinema’da favoriyi değiştirince ilgisiz tema/izleme listesi tüketicilerinin render sayacı artıyor; sayfa yenileme de state’i silebiliyor.
:::

## Sorunu çöz

Önce `src/app/store.ts` içinde store, tipler ve tipli hook’ları kur. Sonra dört client state alanını slice’a taşı. TMDB verisi `movieQueries` üzerinden gelmeye devam etsin.

## Sinema örneği

İlk görev store sözleşmesini ve slice davranışını, ikinci görev Provider bağlantısını ve kalıcılığı tamamlar. Her görevden sonra gerçek bileşende favori, tema ve liste etkileşimini dene.

## Geçiş sırası

1. Mevcut favori ve watchlist davranışını listele; özellikle storage anahtarlarını ve veri biçimini kaydet.
2. Saf slice reducer’larını kur. Önce `toggleFavorite(550)` ve tekrar tıklama kuralını test et.
3. `combineSlices` ile store’u kur; `RootState`, `AppDispatch` ve tipli hook’ları dışa ver.
4. UI’yi `Provider` altına taşı. Her bileşende yalnız gereken alanı seç.
5. Listener ile reducer sonrası client state’i yaz; yenileme sonrası eski tercihleri oku.
6. Render sayacını önce ve sonra aynı etkileşimde karşılaştır. Favori değişiminde tema tüketicisi artmamalı.

Project testleri sözleşmedeki export’ları okur. `projects/sinema` senin uygulaman; bu ders yalnız hangi değişiklikleri yapacağını anlatır. Başarı ölçütü çalışan favori, watchlist, tema ve son bakılan akışlarıdır.

:::mistake[Sık hata]
Eski FavoritesContext import’larını ve beşli provider zincirini kaldırırken kullanıcı davranışını koru. Uygulama kabuğunda Provider konumunu kontrol et.
:::

:::sector[Sektörde]
Bir sonraki modülde auth state’i ve çıkış temizliği aynı store’a eklenecek.
:::
