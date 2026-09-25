---
title: "Sinema: Query geçişi"
minutes: 8
kind: project
---

# Sinema: Query geçişi

:::pain[Problem]
Sinema v2’nin klasörleri temiz, testleri var; fakat aramaya geri dönünce aynı GET, sayfalamada boşalma, kart tıklamasında bekleme sürüyor. Şimdi ölçtüğün acıyı projede çöz.
:::

## Üç adım

1. `queryClient` ve `movieQueries` ile ortak cache kimliğini kur.
2. Home, Search, Details ve Favorites sayfalarını `useQuery` akışına taşı; URL `q`, `page`, `genre` değerlerini key’e bağla. Sayfalamada eski sayfayı geçici göster.
3. Trend için `useInfiniteQuery`, kart hover’ında detay prefetch ekle. İstek sayacında geri navigasyonun aynı taze aramaya yeni GET eklemediğini kontrol et.

`movies-api.ts` içindeki Bearer başlığı ve `ApiError` korunur. `Query` sunucu verisini tutar; favori kimlikleri gibi client state’i buraya taşımana gerek yok. Sonraki modülde puanlama gibi yazma işlemleri için mutation ve invalidation ekleyeceğiz.

:::sector
Geçişi küçük adımlarla yap: önce provider ve key factory, sonra sayfalar, ardından sonsuz liste ve prefetch. Her adımda aynı kullanıcı akışını ölç.
:::
