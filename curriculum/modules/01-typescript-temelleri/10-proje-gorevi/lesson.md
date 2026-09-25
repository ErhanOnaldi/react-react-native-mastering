---
title: "Sinema: tipler ve formatlar"
minutes: 8
kind: project
---

# Sinema: tipler ve formatlar

:::pain[Problem]
Sinema başlığı çalışıyor ama gerçek TMDB listesini bağlayınca kartlar boş tarihte anlamsız, null posterde kırılgan olacak. Şimdi ortak sözleşmeleri projeye taşı.
:::

## İki dosya, iki sorumluluk
Önce `src/types/tmdb.ts` içinde gerçek liste öğesini ve liste cevabını modelle. Ardından `src/lib/format.ts` içinde puanı ve tarihi kullanıcıya gösterilecek metne çevir. Bu dosyalar ileride kart, arama ve detay sayfaları tarafından paylaşılacak.

`Movie` tipi API verisinin şeklini anlatır; `format` fonksiyonları boş değerlerin ekranda nasıl görüneceğine karar verir. Tip tanımı tek başına null posteri düzeltmez.

:::tip
Projede her görevin `prompt.md` dosyasındaki export adını ve yolu aynen kullan. `pnpm typecheck` tipleri kontrol eder; görev testleri davranışı da kontrol eder.
:::

## Uygulama sırası
Önce iki farklı fixture'daki liste öğelerini karşılaştır. `movie-550.json` detay cevabını liste tipi için temel alma; orada `genres` gibi daha zengin alanlar var. `src/types/tmdb.ts` içinde `Movie` ve `MovieListResponse` adlarını export et. `poster_path` ile `backdrop_path` nullable, `release_date` ise boş olabilen string olsun.

Sonra `src/lib/format.ts` içinde üç fonksiyonu yaz. `formatVote` sıfırda “Henüz oy yok” desin; diğer puanları bir ondalıkla göstersin. `releaseYear` boş tarihi boş bıraksın; UI gerekirse kendi mesajını seçebilir. `formatDate` aynı boş tarihe “Tarih yok” desin ve dolu tarihi Türkçe uzun biçimde göstersin. Bu iki boş tarih kararı farklı kullanım bağlamları içindir.

## Deneyerek bitir
Önce `pnpm typecheck`, ardından platformdaki proje testlerini çalıştır. Tipler doğru olsa bile `8` için `"8"` dönmek testten kalır; kullanıcıya `"8.0"` göstermek istiyoruz. Tarih gününü farklı saat dilimlerinde korumak için biçimlendirmede UTC belirt.

:::sector
Ortak tip ve biçimlendirme dosyaları sonraki modüllerin temelidir. Kartları henüz yazmıyoruz; önce onları güvenle besleyecek sözleşmeyi kuruyoruz.
:::
