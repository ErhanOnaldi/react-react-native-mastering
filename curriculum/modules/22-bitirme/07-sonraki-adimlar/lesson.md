---
title: "Sonraki adım: web, sunucu veya mobil"
minutes: 8
kind: concept
---

# Sonraki adım: web, sunucu veya mobil

:::pain[Problem]
Sinema'da film detayını TMDB'den tarayıcı açıldıktan sonra çekiyordun. Kitaplık demosundan sonra biri “Google'da kitap detayları bulunmuyor; ilk ekranda veri daha erken gelsin” diyor. Bir başkası “Metroda telefona yüklenen gerçek bir uygulama istiyorum” diyor. İki uygulamayı da Vite ile istemcide kurdun; şimdi aynı React bilgisinin hangi yöne genişleyeceğini seçmen gerekiyor. İki istek aynı araçla çözülmez.
:::

Bu ders yeni bir kurulum görevi değil. Şimdiye kadar öğrendiğin **bileşen, state, veri, test ve erişilebilirlik** ilkelerini yeni çalışma ortamlarına taşıyorsun. Aracı ihtiyaca göre seç; yalnızca popüler diye projeyi yeniden yazma.

## Kitaplık'ın yeni web ihtiyacı: Next.js ve Server Components

Vite ile yaptığın Kitaplık bir istemci uygulaması. Tarayıcı JavaScript'i çalıştırır, sonra Open Library'ye istek atar. Kitap detayının ilk HTML'de bulunması, arama motoru görünürlüğü veya sunucudaki özel bir veriye erişim gerektiğinde React framework'ü değerlendirebilirsin. **Next.js App Router**, Server Components ve Client Components'ı birlikte kullanır; sayfa ve layout'lar varsayılan olarak Server Component'tır.

Server Component veri kaynağına yakın yerde çalışabilir ve tarayıcıya daha az JavaScript gönderebilir. Her istekte sunucuda veya derleme sırasında çalışması mümkündür; “Server Component” her zaman çalışan bir sunucu demek değildir. Ancak `useState`, event handler ve `localStorage` gibi tarayıcı etkileşimleri için Client Component gerekir. Next.js'te `'use client'`, bu etkileşimli bölümün sınırını işaretler; bütün uygulamaya rastgele eklenmez.

Kitaplık'ta örnek bölme: herkese açık **eser açıklaması** sunucuda alınabilir; kullanıcının bu tarayıcıdaki **okuma listesi formu** Client Component olur. Listeyi `localStorage`'da tuttuğun sürece sunucu o kişisel veriyi ilk HTML'ye koyamaz. Hesap ve cihazlar arası eşitleme istenirse veri sahipliği ve mimari kararları yeniden yazılır.

:::mistake[Sık hata]
“Server Component = `useEffect`'in sunucudaki hali” değil. Server Component interaktif hook'ları çalıştırmaz; veri alma ve render sınırı değişir. Ayrıca `'use client'` dosyasının içe aktardığı bileşenler de istemci paketinin parçası olur. Küçük etkileşimli adalar kurmak daha anlaşılırdır.
:::

## Metroda yerel uygulama ihtiyacı: React Native ve Expo

React Native, React bileşen modelini iOS ve Android'in yerel arayüz öğeleriyle kullanır. DOM etiketleri (`div`, `button`) ve CSS dosyan doğrudan taşınmaz; `View`, `Text`, `Pressable` gibi yerel bileşenlerle arayüzü yeniden kurarsın. Buna karşılık veri şemaları, iş kuralları ve test düşüncesi tekrar kullanılabilir.

**Expo**, React Native projesi başlatmayı, yönlendirmeyi ve cihaz özelliklerine erişimi kolaylaştıran bir framework'tür. Kitaplık'ın mobil sürümüne başlayacaksan önce küçük bir ekranla dene: Dune detayı + listeye ekleme. Sonra çevrimdışı okuma, cihaz depolaması ve eşitleme kararlarını yeni ADR'lere yaz. Web'deki `localStorage`'ı mobilde varmış gibi kabul etme.

## Sonraki öğrenme planın

| İhtiyaç | İlk deney | Hangi eski bilgi işine yarar? |
| --- | --- | --- |
| Herkese açık sayfaların ilk içerikte görünmesi | Next.js'te tek bir eser detayı aç | Zod ile API sınırı, hata ve yüklenme durumu, URL parametresi |
| Tarayıcıdaki listeye cihazlar arası erişim | Hesap + sunucu veri modeli tasarla | State haritası, ADR, form ve mutation testleri |
| Gerçek mobil deneyim | Expo'da tek eser ekranı yap | React bileşenleri, props, a11y, test stratejisi |
| Kitaplık'ı güvenle büyütmek | K-1–K-21 kriterlerinden yeni risk seç | RTL/MSW, Playwright, CI, performans ölçümü |

Bir sonraki projeyi seçerken tek cümlelik **acı** yaz: “Kullanıcı X'i yaparken Y yüzünden Z oluyor.” Sonra en küçük deneyle çözümü sınamaya başla. Sinema'dan Kitaplık'a taşıdığın asıl beceri, doğru kütüphanenin adını ezberlemek değil, bu sırayı uygulamak.

Kaynaklar: [React Server Components](https://react.dev/reference/rsc/server-components), [Next.js Server ve Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Expo proje başlangıcı](https://docs.expo.dev/get-started/create-a-project/).
