---
title: "Sinema’yı tarayıcıda doğrula ve yayına hazırla"
minutes: 5
kind: project
---

# Sinema’yı tarayıcıda doğrula ve yayına hazırla

:::pain[Son kapı]
Sinema’nın ana parçaları ayrı ayrı çalışıyor. Yine de kullanıcı girişten listeye dönemiyor, bir film bağlantısı yenilendiğinde host 404 veriyor veya üretim hatası ekipte iz bırakmıyor. Proje görevinde bu kullanıcı yolculuklarını, CI sırasını ve yayın davranışını bir bütün olarak ele alacaksın.
:::

:::model[Test katmanları]
Birim ve entegrasyon testleri ayrıntıları hızlıca sınar; birkaç kritik kullanıcı yolculuğu E2E ile gerçek tarayıcıda yürür. Bu işte iki kritik akışı koru, CI’da hızlı kontrolleri önce çalıştır ve tarayıcı testlerinin kanıtını sakla.

![Birim, entegrasyon ve uçtan uca testlerin kapsadığı alanlar](diagram:test-katmanlari)
:::

:::model[MSW perdesi]
Vitest’teki MSW ağı tarayıcı testine kendiliğinden aktarılmaz. E2E sırasında dış servisleri Playwright’ın route katmanında taklit et; UI, router ve tarayıcı davranışı gerçek uygulama olarak kalsın.

![Uygulama fetch çağrısı MSW tarafından yakalanıp handler yanıtına döner](diagram:msw-perdesi)
:::

İlk akış ana sayfadan aramaya ve film ayrıntısına gider. İkinci akış boş oturumla korumalı sayfayı açar, giriş yapar ve yeni bir liste oluşturur. Her iki senaryoda kullanıcının gördüğü sonucu doğrula; yalnızca URL’nin değiştiğini veya sayfanın açıldığını başarı sayma. İstek verisini sabitlemek, testin gerçek servisin kotasına ya da o günkü katalog sırasına bağlı kalmasını önler.

:::model[Build ve yayın]
Vite build’i statik dosyalar üretir; host bu dosyaları ve derin URL davranışını sunar. Hash’li asset’ler uzun süre cachelenebilir, HTML yeni dosya adını öğrenebilmek için doğrulanır. Yayın kontrolünde bu ayrımı gerçek HTTP yanıtında gör.

![Kaynak dosyaların Vite build ile hashli çıktıya, oradan host ve tarayıcıya gitmesi](diagram:build-ve-yayin)
:::

Sonra CI kapısını temiz bir makinede kur: lockfile’a bağlı kurulum, hızlı kalite kontrolleri, Vitest, browser kurulumu ve E2E. Son adımda Sinema’yı yayına hazırla: doğrudan açılan uygulama adresleri, cache ve güvenlik başlıkları, hata kaydının gönderimi ve build sürümüne bağlı source map birlikte düşünülür.

## Çalışma sırası

1. İki kullanıcı yolculuğunu gerçek browser ve sabit dış servis yanıtlarıyla yürüt.
2. Lint, tip kontrolü, Vitest ve Playwright adımlarını her push’ta çalışan workflow’a koy.
3. Build çıktısını preview’da aç; hostun derin URL ve cache davranışını kontrol et.
4. Hata kaydında sürüm ve route gibi yararlı bağlamı taşı, sırları gönderme.

İki görevi de aynı oturumda tamamlamak zorunda değilsin; her biri kendi değişikliğini ve kanıtını verir. Önce kolayca bozulan kritik yolculukları ele al, sonra temiz CI ve yayın ayarlarına geç. Bir sorun yalnızca yerelde görünmüyorsa trace veya Network kaydına dön ve hangi adımda beklenen kullanıcı durumunun kaybolduğunu bul.

## Özet

- E2E, az sayıdaki kritik kullanıcı yolunu gerçek tarayıcıda korur.
- Dış ağ yanıtlarını sabitle; testin asıl gördüğü UI, router ve tarayıcı olsun.
- CI’da temiz kurulum yap, ucuz kontrolleri önce çalıştır ve başarısız trace’i sakla.
- Build, host başlıkları ve hata raporlaması yayınlanabilir uygulamanın parçasıdır.
