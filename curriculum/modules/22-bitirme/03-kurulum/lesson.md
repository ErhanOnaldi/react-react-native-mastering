---
title: "Kitaplık iskeletini kur"
minutes: 8
kind: project
---

# Kitaplık iskeletini kur

Boş bir proje kurarken bütün araçları tek dosyada toplamaya çalışma. Her ayar bir sorumluluğu açıklasın: Vite uygulamayı paketlesin, Vitest testleri çalıştırsın, Playwright tarayıcıyı açsın. Böylece hata çıktısı geldiğinde hangi katmana bakacağını bilirsin.

:::model[Proje araç zinciri]
Kaynak koddan uygulama paketi üretilir; tip kontrolü, lint ve testler bu kodu farklı açılardan denetler. Bir komut başarısız olduğunda önce hangi araca ait olduğunu bul, sonra o aracın ayarını düzelt. Tüm kontrollerin temiz çalışması iskeletin hazır olduğunu gösterir.
:::

![Kaynak kod build, test ve yayın aşamalarından geçerek tarayıcıya ulaşır](diagram:build-ve-yayin)

## Üç ayar, üç belirti

İlk olarak `@/components/BookCard` import’unu düşün. `@/` bir **path alias**’tır: uzun göreli yollar yerine kullanılan kısa yol adıdır. TypeScript’e ve Vite’a ayrı ayrı tanıtılmalıdır; yalnız TypeScript bilirse editör yolu kabul eder ama Vite modülü bulamaz.

Sonra ESLint ayarına bak. **Flat config**, ESLint’in güncel yapılandırma biçimidir; kurallar ve dosya grupları sırayla bir dizide belirtilir. `eslint-config-prettier` bu dizinin sonuna gelmelidir ki daha önce eklenen biçim kurallarıyla çakışmayı kapatsın.

Son olarak bir **duman testi** ekle: bu, uygulamanın en temel parçalarının ayağa kalktığını gösteren küçük kontroldür. Kitaplık ana sayfası testte açılıp “Kitaplık” başlığını gösteriyorsa rota ve provider iskeletin çalışıyor demektir. Testin çalışması özelliklerin tamamlandığını kanıtlamaz; yalnızca temel bağlantıları doğrular.

## Kurulum sırası

Önce çalışma zamanı paketleriyle geliştirme araçlarını ayır. Sonra TypeScript/Vite alias ayarını kur; ESLint ve Prettier’ı ekle. Vitest’in jsdom ortamını ve MSW kurulumunu Playwright E2E ortamından ayrı tut. Playwright’ın yerel sunucu ayarını en sona ekleyip CI’da yeni sunucu başlatıldığını kontrol et.

`createRoutes(queryClient)` bir **factory function** örneğidir: kendisine QueryClient verilir ve testte ya da uygulamada kullanılabilecek rota listesini üretir. Ayrı bir `AppProviders` bileşeni, uygulamanın ihtiyaç duyduğu sağlayıcıları tek noktada kurar. İkisini de küçük tut; rota kurmak ile tüm uygulamayı render etmek aynı görev değildir.

:::mistake[Test araçlarının E2E dosyalarını da toplaması]
Belirti: `pnpm test` Playwright dosyalarını çalıştırıp `page` bulunamadı diye hata verir. Neden: Vitest ve Playwright aynı test dizinini tarıyordur. Düzeltme: Vitest yapılandırmasında `e2e/**` dizinini hariç tut; gerçek tarayıcı testlerini Playwright çalıştırsın.
:::

## Özet

- Araçları görevlerine göre ayır: build, birim/DOM testi ve gerçek tarayıcı testi farklı işlerdir.
- Alias hem TypeScript hem Vite tarafından tanınmalı.
- Flat config ESLint ayarlarını dosya gruplarıyla düzenler; Prettier uyum ayarı en sona gelir.
- Duman testi temel iskeleti doğrular, uygulamanın tamamını değil.

**Yeni terimler:** Path alias: dosya yolunu kısaltan ad eşlemesi. Flat config: ESLint’in dizi tabanlı yapılandırma biçimi. Duman testi: uygulamanın temel parçalarının çalıştığını kontrol eden küçük test. Factory function: girdi alıp yapılandırılmış bir değer üreten fonksiyon.

### Kendini yokla

1. TypeScript `@/` yolunu tanıyor ama Vite neden bulamıyor? **Cevap:** TypeScript tip kontrolü yapar; import’u paketleyen Vite’ın da alias eşlemesini bilmesi gerekir.
2. Duman testinin yeşil olması neyi kanıtlar? **Cevap:** Test ettiği temel iskelet çalışır; henüz bütün özelliklerin doğru olduğunu değil.
