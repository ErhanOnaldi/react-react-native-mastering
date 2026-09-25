---
title: "Sinema’ya kalıcı testler ekle"
minutes: 9
kind: project
---

# Sinema’ya kalıcı testler ekle

:::pain[Sinema’da ne oldu?]
Platformdaki alıştırmalar geçti, ama Sinema’nın kendi test komutu yok. Yeni refactor’da arama sayfalaması yine sessizce bozulabilir.
:::

## Sorunu nasıl görürsün?

Bu derste projeye Vitest ayarı ve `test` script’i ekleyip format, API client ve debounce davranışlarını kendi dosyalarında test edeceksin. Üç sınır farklı araç gerektirir: saf fonksiyon assertion’ı, `fetch` mock’u, fake timer.

## Uygulama

Önce yerel test komutunu çalıştır. Testleri yazdıktan sonra tek bir gereksinimi bilerek bozup kırmızı sonucu gör, ardından düzelt.

İlk görevde `vite.config.ts` içindeki mevcut plugin, alias ve `envDir` ayarlarının yanına `test` ayarı gelir. `vitest/config` üzerinden gelen `defineConfig`, Vite ayarlarını da kabul eder. `package.json` içindeki `"test": "vitest run"` komutu tek seferlik koşu yapar; geliştirmede istersen `vitest` watch modunu ayrıca kullanabilirsin.

İkinci görevde üç ayrı sınırı koru: format helper’larının string çıktısı, `tmdbClient` isteğinin URL ve Bearer başlığı, `useDebounce` zamanlayıcısının temizlenmesi. İlk test dosyası değişken ağ ve zamana ihtiyaç duymaz. Diğer ikisinde `fetch` ve saati testin kontrolüne alıp her test sonunda geri verirsin.

İleride aynı repoda Node ve DOM testlerini ayrı ortamlarda çalıştırmak gerekirse Vitest 5’in `test.projects` ayarı kullanılabilir. Bu projede şimdilik tek `jsdom` ortamı yeterli; sırf seçenek var diye ek yapı kurman gerekmiyor.

## Sık hata

:::mistake
`test` script’inin olması tek başına güvence değildir; test dosyaları davranışı doğrulamalı.
:::

:::sector
Bundan sonra yeni davranış eklerken Sinema testleri değişiklikten önce ve sonra çalıştırılabilir bir sözleşme sunar.
:::
