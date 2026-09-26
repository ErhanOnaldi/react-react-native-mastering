---
title: "Mimari kararlar: state haritası ve ADR"
minutes: 10
kind: project
---

# Mimari kararlar: state haritası ve ADR

:::pain[Problem]
Sinema’daki favorileri hatırla: 3. modülde `App` içinde bir `useState`’ti. 5. modülde birden çok sayfa okuyunca `FavoritesContext`’e taşındı. 16. modülde Context’in gereksiz render’ları can sıkınca Redux slice’ına taşındı. **Üç taşıma**, her birinde bileşenler ve testler değişti.

Daha kötüsü: bugün Sinema’ya yeni biri katılsa “Favoriler neden Redux’ta da izleme listesi neden başka yerde?” sorusunun cevabını hiçbir dosyada bulamaz. Karar verilmiş ama **gerekçesi kaybolmuş**.
:::

Kodu yazmadan önce iki belge hazırlayacaksın: uygulamadaki her bilginin sahibini gösteren bir **state haritası** ve büyük kararlarının gerekçesini saklayan **ADR**’ler.

## State haritası: her bilginin tek sahibi

9. modülde state’i dört kategoriye ayırmıştın: **sunucu**, **istemci**, **URL** ve **form**. Kitaplık’ta bunu bir adım ileri götürüyorsun: gereksinim belgesindeki her bilgiyi tek tek listeleyip sahibini, okuyanı, yazanı ve kalıcılığını yazıyorsun.

| Bilgi | Kategori | Sahibi | Okuyan | Yazan | Kalıcılık |
| --- | --- | --- | --- | --- | --- |
| Arama sorgusu `q` | URL | `/search?q=` | Arama sayfası, arama kutusu | Arama formu | Adres çubuğu |
| Arama sonuçları | Sunucu | ? | Arama sayfası | Open Library | ? |
| Okuma listesi | İstemci | ? | ? | ? | `localStorage` |
| “Okuma listem (n)” sayısı | **Türetilmiş** | `liste.length` | Menü | — | Saklanmaz |

Son satıra dikkat: menüdeki sayı **saklanmaz**, listeden hesaplanır. Ayrı bir `count` state’i tutmak, iki kopyanın bir gün birbirini tutmaması demektir. Haritanda bir değer başka değerlerden hesaplanabiliyorsa, sahibi yoktur; türetilmiştir.

Haritayı doldururken şu soruları sırayla sor:

1. **Sunucudan mı geliyor?** → Sunucu state’i. Bir kopyasını `useState`’e koyma; önbellek aracına ver.
2. **Paylaşılan linkte ya da geri tuşunda korunmalı mı?** → URL.
3. **Sadece gönderilene kadar mı yaşıyor?** → Form state’i.
4. **Uygulamanın kendi verisi ve birden çok yerde mi okunuyor?** → Paylaşılan istemci state’i. Aracı ölçeğe göre seç.
5. **Başka bir değerden hesaplanabiliyor mu?** → Türetilmiş; saklama.

## ADR: kararın gerekçesini sakla

**ADR** (*Architecture Decision Record*), tek bir mimari kararı ve **neden** verildiğini anlatan kısa bir belgedir. Repoda `docs/adr/` altında, numaralı dosyalar olarak durur: `0001-sunucu-verisi.md`, `0002-okuma-listesi.md`… Klasik iskeleti şudur:

```md title="docs/adr/0001-arama-durumu-url-de.md"
# ADR 0001 — Arama durumu URL'de tutulur

- **Durum:** Kabul edildi
- **Tarih:** 2026-09-25
- **İlgili gereksinimler:** K-2, K-7

## Bağlam
Arama sorgusu ve sayfa numarası paylaşılabilmeli, geri tuşuyla dönülebilmeli (K-2).
Sinema'da sayfa numarası useState'teydi; yenileyince kayboluyordu.

## Karar
`q` ve `page` yalnızca URL'de tutulur, useSearchParams ile okunur. Kopyası tutulmaz.

## Değerlendirilen alternatifler
- useState: yenileyince kaybolur, link paylaşılamaz.
- Global store: paylaşılabilirlik sorununu çözmez, üstüne senkron tutma yükü getirir.

## Sonuçlar
- ✅ Link paylaşımı ve geri tuşu kendiliğinden çalışır.
- ⚠️ URL'den gelen değer güvenilmez (`?page=abc`): her okumada doğrulanmalı.
```

İyi bir ADR’yi kötüsünden ayıran dört şey:

| Özellik | Kötü | İyi |
| --- | --- | --- |
| Bağlam | “Redux iyidir.” | “Liste iki yerde okunuyor, iki yerde yazılıyor, birkaç yüz kaydı geçmez.” |
| Alternatifler | Hiç yok | En az iki **gerçek** seçenek ve neden seçilmedikleri |
| Sonuçlar | Sadece artılar | Artılar **ve** bedeller (⚠️) — “şu olursa bu kararı yeniden düşünürüz” |
| Değişmezlik | Eski karar silinip üstüne yazılır | Yeni ADR yazılır, eskisinin durumu “Yerini 0007 aldı” olur |

:::tip[Hangi kararlar ADR’ye değer?]
Geri dönmesi pahalı olanlar: sunucu verisini hangi araçla yöneteceğin, okuma listesinin nerede ve nasıl saklanacağı, klasör yapısı, test stratejisi. Buton renginin ADR’si olmaz.
:::

## Kitaplık’ın büyük kararları

Önündeki seçenekleri Sinema’dan tanıyorsun. Bu sefer ölçeğe göre seç:

| Karar | Seçenekler | Düşünmen gereken |
| --- | --- | --- |
| Sunucu verisi | `useEffect` + `useState` · TanStack Query · RTK Query · router loader | Önbellek, sayfalama, tekrar deneme, gereksiz istek (API nezaketi) |
| Okuma listesi | Context + `useReducer` · Zustand · Redux Toolkit · `useSyncExternalStore` ile kendi store’un | Kaç yerde okunuyor, ne kadar büyük, bağımlılık maliyeti, test kolaylığı |
| Kalıcılık | `localStorage` · IndexedDB | Veri boyutu; okurken **doğrulama** (bozuk kayıt) |
| Klasör yapısı | Tür bazlı (`components/`, `hooks/`) · feature bazlı (`features/books`, `features/reading-list`) | 9. modülde feature bazlı yapıya neden geçtiğini hatırla |

Tek bir “doğru” cevap yok. Context + `useReducer` da, Zustand da savunulabilir; **savunmayı yazman** gerekiyor. Testler de buna göre tasarlandı: sabit sözleşmeye uyduğun sürece hangi aracı seçtiğine bakmazlar.

:::mistake
Her şeyi tek bir global store’a koymak: arama sonuçlarını, form taslağını, sayfa numarasını da. Store büyür, her değişiklik her yeri render eder ve sunucu verisinin önbellek/tazeleme sorunları hâlâ çözülmemiş olur. State haritası bu hatayı kod yazmadan önce gösterir.
:::

:::mistake
ADR’yi karar verildikten aylar sonra, “belge olsun” diye yazmak. O zaman bağlamı ve reddedilen alternatifleri hatırlamazsın; belge sadece kodu tekrar eden bir özete döner. ADR karar anında, 15 dakikada yazılır.
:::

:::sector
ADR fikri Michael Nygard’ın 2011’deki bir yazısından geliyor ve bugün pek çok açık kaynak projede `docs/adr/` klasörü görürsün. Büyük şirketlerde benzer süreç “RFC” ya da “design doc” adıyla işler: karar yazılı önerilir, ekip yorum yapar, sonra kabul edilir. Mülakatlarda “Bu projede neden X’i seçtin?” sorusuna ADR yazmış biri çok daha iyi cevap verir.
:::
