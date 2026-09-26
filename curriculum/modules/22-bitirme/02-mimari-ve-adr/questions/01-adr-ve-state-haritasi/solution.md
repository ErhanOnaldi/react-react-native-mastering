Referans belgeler: `curriculum/checkpoints/kitaplik/22/docs/state-map.md` ve `docs/adr/0001…0003`. Referans çözüm şu kararları vermiş:

- **0001 — Sunucu verisi TanStack Query’de, arama durumu URL’de.** Sinema’da `useEffect` ile yaşanan tekrar eden loading/error kodu ve gereksiz istekler bağlamın kendisi. RTK Query reddedilmiş, çünkü tek bir kullanıcı özelliği için store kurmak fazla tören.
- **0002 — Okuma listesi Context + `useReducer` + `localStorage`, Zod ile doğrulanarak.** Liste iki yerde okunuyor, birkaç yüz kaydı geçmez, bağımlılık eklemeye değmez. Bedel dürüstçe yazılmış: “Context değeri değişince tüm tüketiciler render olur; tüketici sayısı artarsa `useSyncExternalStore`/Zustand’a geçişi yeniden değerlendir.”
- **0003 — Test stratejisi** (6. derste yazıldı).

Senin kararların farklı olabilir; önemli olan, **başka biri okuyunca aynı sonuca varabilmesi ya da hangi koşulda farklı karar vereceğini görebilmesi.**

Bir ipucu daha: ADR’ler değişmez. İlerde okuma listesini Zustand’a taşırsan `0002`’yi silmezsin; `0004-okuma-listesi-zustand.md` yazar, `0002`’nin durumunu “Yerini 0004 aldı” yaparsın. Böylece “neden önce Context’ti?” sorusunun cevabı hiç kaybolmaz.
