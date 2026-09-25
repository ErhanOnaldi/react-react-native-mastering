---
title: Sinema: tipler ve formatlar
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

## Sektörde
Dış veri modeli ile gösterim kuralını ayrı tutmak yeni ekranlarda aynı kararı tekrar vermemeni sağlar.
