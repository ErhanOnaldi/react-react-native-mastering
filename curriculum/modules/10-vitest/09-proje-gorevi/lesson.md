---
title: "Sinema’da kalıcı test alışkanlığı kur"
minutes: 6
kind: project
---

# Sinema’da kalıcı test alışkanlığı kur

Şimdi Vitest’i Sinema’nın içine ekleyip gerçek proje kodunun davranışlarını koruyacaksın: biçimleme, API client’ı ve arama gecikmesi. Önce projedeki Vite ayarlarını ve paket script’lerini oku; mevcut ayarları koruyarak test komutunu ve test dosyalarını ekle.

:::model[Test anatomisi]
Arrange test verisini kurar, Act fonksiyonu ya da akışı çalıştırır, Assert gözlenen sonucu karşılaştırır. Her testte hangi değeri hazırladığını, hangi davranışı çağırdığını ve hangi sonucu beklediğini açık tut; bu düzen başarısız testi okumayı kolaylaştırır.
:::

:::model[Kontrol edilen sınır]
Uygulamanın kendi kararları çalışsın, yalnızca testin yönetmesi gereken dış etkiyi değiştir. API testinde `fetch` için sahte yanıt kullanırsın; gecikme testinde fake timer ile saati sen ilerletirsin. Test bitince bu geçici değişiklikleri temizle ki testler birbirini etkilemesin.
:::

## Önce proje test komutu

Vite yapılandırması test ortamını tanımlar; `package.json` içindeki script ise testleri tek komutla çalıştırmanı sağlar. DOM benzeri bir ortam olan `jsdom`, Node.js içinde tarayıcının bazı DOM özelliklerini taklit eder. React hook’unu gerçek bir tarayıcı açmadan test edebilmen için bu projede o ortamı kullanacaksın.

Biçimleme fonksiyonlarında bir girdi verip tam beklenen string’i karşılaştır. Örneğin `"8"` ile `"8.0"` aynı değildir; gevşek bir parça eşleşmesi biçim kuralındaki hatayı saklayabilir. Boş puan ve eksik tarih gibi durumları da düşün, çünkü gerçek film verisi bu sınırları içerir.

## Ağ ve zaman davranışları

API client’ını denerken sahte `fetch` yanıtı kur, ama client’ın URL ve header hazırlayan kodunu çalışır bırak. İkinci sayfanın doğru parametrelerini, yetkilendirme bilgisini, başarılı film sonucunu ve hata cevabında korunması gereken ayrıntıları gözle. Gerçek ağa gitme; test sonunda sahte globali geri al.

Arama gecikmesinde zamanı gerçekten beklemek yerine fake timer’ı ilerlet. Değer hemen değişmemeli; 499 ms’de eski değer sürmeli, 500 ms’de yenisi görünmeli. Araya yeni değer girerse eski timer’ın sonradan eski aramayı yayımlamadığını da düşün: süre son değişiklikten başlamalı.

Hook testinde `renderHook`, hook’u test ortamında çalıştırır; `act` ise timer ilerleyince oluşan React güncellemelerinin assertion’dan önce tamamlanmasını sağlar. Burada bu iki aracı yalnızca debounce hook’unun sonucunu okuyabilmek için kullan.

Testi bir kez bilerek yanlış beklentiyle çalıştırıp kırmızı sonucu gör, sonra doğru beklentiyi geri koyup `pnpm test` komutunu yeniden çalıştır. Kırmızı sonuç, testin gerçekten karşılaştırma yaptığını gösterir; testin kapsadığı davranışları ise sen seçersin.

:::mistake[Test komutunu güvence sanmak]
Belirti: `pnpm test` başarılıdır ama hatalı bir sonuç da geçerdi. → Neden: Script testleri başlatmıştır, fakat anlamlı bir assertion yanlış davranışı yakalamıyordur. → Düzeltme: Beklentiyi geçici olarak yanlış yapıp testin kaldığını gör; ardından gerçek beklentiyi geri yükle.
:::

## Özet

- Mevcut proje ayarlarını okuyup tek komutla çalıştırılan test akışı kur.
- Biçimleme, HTTP ve gecikme farklı davranışlardır; her birinin gözlenebilir sonucunu seç.
- `jsdom` React kodunu DOM benzeri bir ortamda çalıştırır.
- Fake global ve timer’ları testten sonra temizle; sınırı bilerek zorlayıp beklentinin çalıştığını doğrula.

**Terimler:** **jsdom** — Node.js içinde bazı tarayıcı DOM özelliklerini taklit eden ortam. **Fake timer** — testte zamanlayıcıları gerçek zamanı beklemeden ilerletme yolu. **`renderHook`** — bir hook’u test ortamında çalıştıran yardımcı. **`act`** — React güncellemelerinin testte okunmadan önce tamamlanmasını sağlayan yardımcı.

**Kendini yokla:** Başarılı `pnpm test` tek başına davranışların doğru olduğunu kanıtlar mı? Hayır; assertion’ların önemli doğru ve yanlış davranışları ayırt ettiğini de görmelisin.
