---
title: "Sinema’yı tarayıcıda doğrula ve yayına hazırla"
minutes: 5
kind: project
---

# Sinema’yı tarayıcıda doğrula ve yayına hazırla

Bu projede Sinema’nın kullanıcı akışlarını tarayıcıda çalıştıracak, kontrolleri CI’a taşıyacak ve yayındaki davranışını hazırlayacaksın. Önceki derslerde öğrendiğin test, ağ taklidi, build ve hata izleme fikirlerini burada bir araya getiriyorsun.

:::model[Test katmanları]
Birim ve entegrasyon testleri küçük parçaları hızlıca sınar; E2E testi kullanıcının kritik yolunu gerçek tarayıcıda yürütür. Az sayıdaki önemli akışı tarayıcıda koru ve yalnızca sayfanın açıldığını değil, kullanıcının istediği sonucun göründüğünü de doğrula.

![Birim, entegrasyon ve uçtan uca testlerin kapsadığı alanlar](diagram:test-katmanlari)
:::

:::model[MSW perdesi]
Şemadaki MSW perdesi Vitest içindir; ayarlar Playwright’ın açtığı tarayıcıya otomatik geçmez. E2E’de dış servis yanıtlarını Playwright’ın `page.route` özelliğiyle sabitle; uygulamanın arayüzü ve gezinmesi gerçek kalsın.

![Uygulama fetch çağrısı MSW tarafından yakalanıp handler yanıtına döner](diagram:msw-perdesi)
:::

:::model[Build ve yayın]
Vite build’i yayın dosyalarını üretir; host bu dosyaları ve doğrudan açılan uygulama yollarını sunar. HTML güncel asset adını gösterebilmeli, değişmeyen hash’li asset’ler uzun süre saklanabilmelidir.

![Kaynak dosyaların Vite build ile hashli çıktıya, oradan host ve tarayıcıya gitmesi](diagram:build-ve-yayin)
:::

## Çalışma sırası

1. Aramadan film ayrıntısına, boş oturumdan izleme listesine giden iki kullanıcı yolunu tarayıcıda çalıştır. Dış servis yanıtlarını sabitle; locator’ları erişilebilir rol ve adlarla kur, sonuçları bekleyen assertion’larla doğrula.
2. Aynı kontrolleri temiz bir CI makinesinde sırayla çalıştır. E2E başarısız olursa inceleyebilmek için trace dosyalarını sakla.
3. Build’i preview’da açıp derin bağlantıyı ve HTTP başlıklarını kontrol et. Hata raporlamasında sürüm ve route gibi tanı bilgilerini taşı; parola ve token gönderme.

Her parçayı kendi değişikliğinde tamamlayıp ilerleyebilirsin. Önce kullanıcı yolculuklarını çalıştır, ardından CI ve yayın ayarlarına geç. Bir sorun çıktığında tarayıcıdaki görünür sonucu, trace’i veya Network kaydını inceleyerek hangi adımın beklentiden saptığını bul.

## Aklında tut

- Tarayıcı testlerini kullanıcının tamamlaması gereken az sayıdaki kritik yol için kullan.
- E2E’de dış servisleri sabitle, arayüzdeki gerçek sonucu doğrula.
- CI’ı temiz makine gibi düşün; başarısız E2E kanıtını sakla.
- Build, host kuralları ve güvenli hata raporlaması da yayın hazırlığının parçasıdır.
