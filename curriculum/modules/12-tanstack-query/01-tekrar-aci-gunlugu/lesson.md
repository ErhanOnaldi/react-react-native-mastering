---
title: "Tekrar eden istekleri say"
minutes: 7
kind: review
---

# Tekrar eden istekleri say

:::pain[Problem]
Sinema v1’de `?q=Matrix` aramasını açıp bir filme gidiyor, geri dönünce aynı listeyi yeniden bekliyordun. Network’te aynı URL için iki GET vardı. Bu davranış “sayfa yavaş” diye geçiştirilebilir; ama sayı, neden ve sonuç birlikte yazılınca düzeltmenin gerçekten işe yarayıp yaramadığı anlaşılır.
:::

## Önceki kavramlar bu akışta ne anlatıyor?

:::model[State kategorileri]
Arama ifadesi URL’de yaşar; TMDB cevabı server state’tir; favori seçimi client state’tir. Önceki `state-kategorileri` diyagramı üç verinin sahibini ayırıyordu. Şimdi özellikle server state’in component unmount olduğunda da kısa süre cache’te kalmasını istiyoruz.
:::

:::model[Effect yaşam döngüsü ve race condition]
Effect commit sonrasında isteği başlatır; dependency değişiminde temizlenir ve yeniden kurulur. `yaris-kosulu` eski cevabın yeni arama sonucunu ezebileceğini gösteriyordu. Elle yazdığın effect bu isteği başlatır ve eski sonucu durdurur; fakat tamamlanmış cevabı başka ekranda paylaşmaz.
:::

## Belirtiyi ölç ve sınıflandır

Bir akışı aynı başlangıçla tekrarla: arama sayfasını aç, detaya git, geri dön. İstek sayacında eşsiz URL’leri ve her URL’nin toplam tekrarını yaz. Örneğin `/3/search/movie?query=Matrix&page=1` ilk mount’ta bir, geri dönüşte ikinci kez çağrılıyorsa fazladan bir GET var. Geliştirme modunda StrictMode effect’i tekrar çalıştırabilir; karşılaştırırken aynı ortam ve aynı kullanıcı adımlarını kullan.

`useDebounce` yazarken tuş başına istek sayısını azaltabilir, ama daha önce tamamlanan cevabı saklamaz. Cleanup ve `AbortController` geç kalan cevabın UI’a yazılmasını önler; cache yerine geçmez. Bu üç aracın çözdüğü sorular farklıdır: debounce çağrı sıklığı, cleanup yaşam döngüsü, cache ise aynı veriyi tekrar kullanma.

Akışın birden fazla ekranı varsa sonuç component’ten ayrılınca çöpe gitmemelidir. Yine de her yanıtı sınırsız saklamak da doğru değildir: server state zamanla değişir, kullanıcıya ne kadar eski veri gösterebileceğini seçmen gerekir. Bu yüzden önce “aynı URL tekrar geldi mi?” sorusunu, sonra “cevap ne kadar süre taze?” sorusunu sor. İlk ölçüm cache gerekip gerekmediğini, ikinci karar tazelik politikasını netleştirir.

:::mistake[Ölçümsüz iyileştirme]
**Belirti:** Kod daha karmaşık ama geri dönüşte aynı sayıda GET var. → **Neden:** Başlangıç ve bitiş ölçümü aynı akışta yapılmamıştır. → **Düzeltme:** Önce akışı ve istek sayısını kaydet; sonra aynı koşullarda tekrar ölç.
:::

:::sector
Performans notunda “hızlı oldu” yerine “detaydan geri dönüşte arama GET’i 2’den 1’e indi” yaz. Kullanıcı adımı, endpoint ve sayaç birlikte olunca ekip iyileştirmenin kapsamını tartışabilir.
:::

## Özet

- Tekrar isteği, aynı URL ve kullanıcı akışında sayaçla doğrula.
- Debounce, race condition cleanup ve cache farklı sorunları çözer.
- URL state, server state ve client state’in sahipleri ayrıdır.

**Kendini yokla:** `AbortController` tamamlanmış cevabı sonraki ekranda saklar mı? Geri dönüşteki iyileşmeyi nasıl kanıtlarsın?

**Yanıt:** Hayır; iptal yalnız devam eden isteğe etki eder. Aynı akışı önce ve sonra istek sayarak karşılaştır.
