---
title: "Proje görevi: Sinema E2E ve CI"
minutes: 10
kind: project
---

# Sinema’nın gerçek yolunu koru

:::pain[Problem]
Birim ve entegrasyon testleri yeşilken `/login` yanlış route grubuna taşınmıştı. Şimdi kritik iki yolu gerçek Sinema üzerinde tarayıcıyla yürüt: ana sayfa → arama → detay ve giriş → izleme listesi. Ardından ikisini her push’ta CI’da çalıştır.
:::

## Önce tarayıcıyı hazırla

Sinema projesinde `@playwright/test` kurulu olmalı. İlk yerel kurulumda `npx playwright install chromium` çalıştır. `playwright.config.ts` dosyasının `webServer` alanı Vite’ı `http://localhost:5174` adresinde başlatsın; CI’da var olan sunucuyu tekrar kullanmasın. Gerçek `.env` gerektirmeyen sahte bir `VITE_TMDB_TOKEN` ver.

## Akışları yaz

`e2e/*.spec.ts` dosyalarında `page.route` ile TMDB ve DummyJSON yanıtlarını sabitle. TMDB’de Bearer başlığını kontrol et; 550 için Türkçe başlık **Dövüş Kulübü**. Login için `emilys` / `emilyspass` sahte kimliğini kullan. Arama ve detay testinde rol tabanlı locator ve web-first assertion’lar seç.

Giriş testini hazır `storageState` ile atlama: modülün başlangıcındaki router hatasını ancak formu ve yönlendirmeyi gerçekten yürüyerek yakalarsın. Listede yeni ad görününce akış tamamlanır.

## Her push’ta çalıştır

`.github/workflows/sinema-ci.yml` temiz makinede lint, typecheck, Vitest ve Playwright’ı koştursun. Başarısız E2E için trace sakla. Sonraki modülde sıfırdan yeni proje kurarken aynı kalite kapısını yeniden kuracaksın.
