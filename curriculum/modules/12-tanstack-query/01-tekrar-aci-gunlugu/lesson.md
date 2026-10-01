---
title: "Tekrar eden istekleri say"
minutes: 7
kind: review
---

# Tekrar eden istekleri say

Sinema’da aynı arama sonucuna dönünce Network panelinde aynı GET isteğini yeniden görebilirsin. Önce akışı sabitle: aramayı aç, bir filme git, geri dön. Her adımda URL’yi ve istek sayısını not et; böylece neyin tekrarlandığı belli olur.

:::model[State kategorileri]
Arama ifadesi paylaşılabilir bir seçim olduğu için URL’de yaşar; TMDB cevabı server state’tir ve Query cache’inde tutulur; favori seçimi ise kullanıcıya ait client state’tir. Ekrandan ayrılınca bu üç değerin aynı davranması gerekmez: arama geri gelmeli, cevap kısa süre paylaşılabilmeli, favori de kullanıcının seçimi olarak kalmalıdır.
:::

![Server state, URL state, client state ve form state sahiplerini gösteren diyagram](diagram:state-kategorileri)

:::model[Effect yaşam döngüsü ve race condition]
Önceki effect modelinde istek, React ekrandaki güncellemeyi işledikten sonra (commit aşamasında) başlıyordu; ekran kalkınca cleanup çalışıyordu. Race condition, hızlı arka arkaya giden isteklerden eski cevabın geç gelip yeni sonucu ezmesidir. Cleanup bunu önlemeye yardım eder, ama tamamlanmış cevabı başka ekranda saklamaz; tekrar kullanma işini cache üstlenir.
:::

![Effect setup, dependency değişince cleanup ve yeniden setup sırasını gösteren diyagram](diagram:effect-yasam-dongusu)

![Yavaş eski cevabın yeni sonucu ezmesini ve cleanup ile engellenmesini gösteren diyagram](diagram:yaris-kosulu)

Görevleri sırayla çöz: önce cache yokken geri dönüşte kaç istek çıktığını hesapla, sonra URL, sunucu cevabı ve favorinin sahibini ayır, en son cache’in hangi veriyi saklaması gerektiğini seç. Önceki modüllerdeki state sahipliği, Router URL parametreleri ve `useQuery` temellerini hatırla. Aynı kullanıcı akışını değişiklikten önce ve sonra karşılaştır; beklenen sonuç, aynı taze arama için gereksiz GET’in azalmasıdır.

## Hatırlayacağın noktalar

- Cache yoksa arama ekranının iki ayrı açılışı iki istek başlatabilir.
- URL seçimi, server state ve client state farklı sahiplerdir.
- İstek sayısını aynı akışta ölçmek, iyileşmenin işe yarayıp yaramadığını gösterir.

**Terimler:** `server state` sunucudan gelen ve zamanla değişebilen veri; `client state` kullanıcının arayüzdeki seçimi; `commit` React’in ekrandaki güncellemeyi uygulaması; `race condition` geç gelen eski cevabın yeni sonucu ezmesi.

**Kendini yokla:** `AbortController` tamamlanmış cevabı sonraki ekrana taşır mı?

**Yanıt:** Hayır. Devam eden isteği iptal edebilir; tamamlanmış cevabı saklamak cache’in işidir.
