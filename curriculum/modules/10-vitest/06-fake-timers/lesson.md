---
title: "Beklemeyi testte yönet"
minutes: 8
kind: concept
---

# Beklemeyi testte yönet

:::pain[Sinema’da ne oldu?]
Arama kutusunda hızlıca “ba” yazıp “başlangıç”a geçtin. Eski timer temizlenmezse kısa arama için istek de yola çıkar; gerçek 500 ms bekleyen testler ise yavaşlar.
:::

## Zamanı bağımlılık olarak gör

Debounce gibi davranışlarda sonuç yalnız girdiyle değil geçen süreyle de belirlenir. Gerçek saati bekleyen test yavaş ve kırılgan olabilir. Fake timer testin saati kontrollü ilerletmesini sağlar; böylece tam sınır anlarını, iptal edilen eski timer'ı ve cleanup davranışını ayrı ayrı gözlersin.

Hook dersinde eski arama cevabının yeniyi ezmesini engelledin. Sinema'nın debounce akışında benzer zaman yarışı timer düzeyinde yaşanır. Final değeri görmek yetmez; aradaki yanlış değerin hiç görünmediğini de sınamak gerekir.

## Sorunu nasıl görürsün?

`vi.useFakeTimers()` saati senin kontrolüne verir. `vi.advanceTimersByTime(499)` henüz güncellenmemeli; bir milisaniye sonra son değer gelmeli. `vi.useRealTimers()` temizliği unutma.

## Uygulama

`useDebounce` testinde `renderHook` ve `rerender` kullanarak bir değer değişimini gözle. Timer ilerletmeyi `act` içinde yap. Bir sonraki adımda kullanıcı etkileşimi gerekirse `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` kullan.

Zaman çizelgesini yazmak cleanup hatasını görünür kılar:

| An | Değişim | Beklenen debounced değer |
| --- | --- | --- |
| 0 ms | `""` → `"ba"` | `""` |
| 200 ms | `"ba"` → `"başlangıç"` | `""` |
| 500 ms | İlk timer’ın eski bitişi | `""` |
| 700 ms | Son değişimden 500 ms | `"başlangıç"` |

Yalnızca 700 ms sonrasını sınarsan eski timer’ın 500 ms’de kısa süreliğine yanlış değeri gösterdiğini kaçırırsın. Bu yüzden aradaki an da gereksinimin parçası.

## Sık hata

:::mistake
Fake timer açıkken `userEvent.setup()` varsayılan ayarla kendi timer’ını bekleyebilir. Gerçek ağa istek atan kod ile fake timer’ı karıştırmak da gereksiz karmaşa yaratır.
:::

:::sector
Debounce, animasyon ve retry gibi zaman bağımlı kodların sınırlarını milisaniye düzeyinde test etmek regresyonu hızlı yakalar.
:::
