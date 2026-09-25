---
title: "Sinema v2: düzenli yapı"
minutes: 10
kind: project
---

# Sinema v2: düzenli yapı

:::pain[Problem]
Egzersizlerdeki düzeni gerçek Sinema’ya taşımadıkça v1’in beş dosyasındaki token ve URL tekrarı kalacak. Yeni endpoint eklendiğinde yine aynı işi yapacaksın.
:::

## İhtiyaçtan karar

Üç adımda taşı: önce feature/shared klasörleri ve alias, sonra `tmdbClient` ile `ApiError`, sonra film endpoint’lerinin adlandırılmış fonksiyonları. Her adımda `pnpm typecheck`, `pnpm lint` ve uygulamayı kontrol et.

## Sinema’da dene

Dosya yolları ve export adları görevlerde tam yazıyor; sonraki modüller bunları kullanacak. Mevcut ana sayfa, arama, detay ve favori akışları korunmalı.

## Üç küçük teslim

1. Önce feature/shared sınırlarını ve `@/` alias’ını kur. Bir dosyayı taşıdıktan sonra bütün importları düzeltip typecheck çalıştır.
2. Sonra `tmdbClient` ile Bearer, dil ve HTTP hatasını ortaklaştır. 401 ile 404 davranışını özellikle kontrol et.
3. Son olarak `getTrendingMovies`, `discoverMovies`, `searchMovies`, `getMovieDetails` ve `getGenres` fonksiyonlarını ekle; sayfalar endpoint metinleri yerine bu fonksiyonları kullansın.

Her adımda çalışan arama, tür filtresi, sayfalama, detay ve favoriler akışını yeniden dene. İsteğin başarıyla dönmesi tek başına yeterli değil: kullanıcı geri tuşuyla eski `?q=` değerine döndüğünde ekran da geri dönmeli. Rubric bu davranışla birlikte sınırların okunurluğunu değerlendirir.

:::mistake[Sık hata]
Klasör taşıma sırasında önce eski import’ları güncelle. Aynı işin hem eski hem yeni kopyasını uzun süre bırakma; iki doğruluk kaynağı üretir.
:::

:::sector[Sektörde]
Modül 10 bu yapının üzerine testler, modül 12 ise Query cache’i ekleyecek. Şimdiki sınırlar o değişiklikleri yerel tutacak.
:::
