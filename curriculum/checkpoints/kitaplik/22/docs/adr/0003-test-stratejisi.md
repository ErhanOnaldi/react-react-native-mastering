# ADR 0003 — Test stratejisi: davranış odaklı entegrasyon testleri + ince E2E katmanı

- **Durum:** Kabul edildi
- **Tarih:** 2026-09-25

## Bağlam

Kitaplık'ın riski en çok iki yerde: Open Library'nin kirli/beklenmedik verisi ve ekranlar arası akış (arama → detay → liste). Tek geliştiriciyiz; testler hem güvenlik ağı hem de gereksinimlerin çalıştırılabilir hali olmalı.

## Karar

| Katman      | Araç                                     | Ne test edilir                                            | Örnek                                         |
| ----------- | ---------------------------------------- | --------------------------------------------------------- | --------------------------------------------- |
| Birim       | Vitest                                   | Saf mantık: Zod şemaları, URL okuma, reducer, depolama    | `schemas.test.ts`, `storage.test.ts`          |
| Entegrasyon | Vitest + RTL + user-event + MSW          | Sayfaların davranışı, gerçek route ağacıyla (`renderApp`) | `SearchPage.test.tsx`, `ReadingList.test.tsx` |
| E2E         | Playwright (`page.route` ile ağ taklidi) | Gerçek tarayıcıda kritik akış, sayfa yenileme             | `reading-list.spec.ts`                        |

- Testler **uygulama detayına değil davranışa** bakar: rol ve etiketle sorgu (`getByRole`, `getByLabelText`), kullanıcı gibi etkileşim.
- MSW `onUnhandledRequest: 'error'` ile açılır: hiçbir test gerçek ağa çıkmaz. Hata yolları `server.use` ile test başına canlandırılır.
- Test adları Türkçe ve gereksinim cümlesi gibidir; kabul kriterleri (K-n) testlere eşlenir.
- E2E ince tutulur: jsdom'un yapamadığını (gerçek `localStorage` + yenileme, gerçek gezinme) kanıtlar.

## Kabul kriterleriyle bağ

| Kriterler | İlk güvence                                            | Gerekçe                                                                |
| --------- | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| K-1–K-9   | Arama sayfası RTL/MSW testleri                         | URL, istek parametreleri, sayfalama ve görünür sonuç birlikte değişir. |
| K-10–K-12 | Eser sayfası RTL/MSW + şema testleri                   | 404 ve eksik yazar gibi cevaplar deterministik üretilir.               |
| K-13–K-21 | Form/liste RTL, depolama birim testleri, bir E2E akışı | Alan kuralı, kalıcılık ve gerçek yenileme farklı katmanlarda sınanır.  |

## Sonuçlar

- ✅ Refactor sırasında (örn. okuma listesini Zustand'a taşımak) testler değişmeden kalır.
- ✅ CI her push'ta tüm katmanları çalıştırır.
- ⚠️ Entegrasyon testleri birim testlerden yavaştır; şu an tüm paket ~1 sn, izlenecek.

## Açık riskler

Gerçek Open Library servisinin erişilebilirliği, cevap süresi ve kapak CDN'inin ayakta kalması bu sahte ağ testleriyle doğrulanmaz. Tarayıcılar arası senkron da v1 kapsamında değildir. Dış servis sorunları için üretimde ayrı gözlemleme ve kullanıcıya gösterilen hata yolunu izleme gerekir.
