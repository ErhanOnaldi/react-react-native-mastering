---
title: "E2E testi hangi boşluğu kapatır?"
minutes: 13
kind: concept
---

# E2E testi hangi boşluğu kapatır?

:::pain[Sinema’da pazartesi sabahı]
Pazartesi ilk kullanıcı “Giriş yap” düğmesine basınca boş sayfa görüyor. Cuma günü Vitest raporundaki 126 test yeşildi. Son değişiklikte login route’u korumalı route grubuna taşınmış; giriş yapmamış kişi /login’e gönderiliyor, ama /login de aynı korumaya takılıp formu hiç açmıyor.
:::

## Test katmanı, cevapladığın sorudur

:::model[Test katmanları]
Bir test katmanı, uygulamanın farklı genişlikteki bir parçasını çalıştırır. Birim testinde tek kural, entegrasyon testinde bağlı parçalar, E2E testinde tarayıcıdaki kullanıcı yolculuğu sınanır. Katmanı “ne kadar gerçekçi?” diye değil, “hangi riski en az maliyetle görünür yapıyor?” diye seç.

![Birim, entegrasyon ve uçtan uca testlerin kapsadığı alanlar](diagram:test-katmanlari)
:::

Kesin kurallar:

1. **Birim testi** saf fonksiyonu veya küçük mantık birimini sınar. Süreyi saat ve dakikaya çevirmek, sıfırın nasıl gösterileceğini kontrol etmek bu katmandadır.
2. **Entegrasyon testi** birlikte çalışması gereken parçaları aynı ortamda kurar. Gerçek route ağacını ve oturum bilgisini bağlayıp korumalı sayfaya gitmek buna örnektir.
3. **E2E testi** uygulamayı tarayıcıda açar ve kullanıcı girdilerini UI üzerinden verir. Router, provider’lar, CSS ve tarayıcı depolaması bu akışa katılır.
4. **Bir üst katman alt katmanın yerine geçmez.** E2E, beş sınır değerini denemek için pahalıdır; birim testi de route’ların yanlış bağlanmasını göremez.
5. **E2E sayısı kritik yolculuklarla sınırlı kalır.** Saniyeler süren ve çok katman içeren testte hata kaynağı geniştir; ayrıntı testleri hızlı ve dar tutulur.

Vitest’teki üç ayrı test Sinema’daki hatayı kaçırabilir: LoginPage kendi mini router’ında doğru render olur; koruma bileşeni yetkisiz kullanıcıyı doğru yere yollar; liste formu hazır oturumla çalışır. Hatanın bulunduğu şey, bu parçaların gerçek route ağacında hangi sırayla birleştiğidir. Gerçek route dizisini kullanan bir entegrasyon testi de bunu yakalayabilir; E2E ise uygulamanın gerçek giriş noktasından tarayıcıya kadar olan birleşimi sınar.

## Üç katmanın çalışma alanı

| Kontrol | Kurulum | Neyi güvenceye alır? | Yaklaşık maliyet |
| --- | --- | --- | --- |
| Süre biçimi | Fonksiyon çağrısı | Yuvarlama ve sınır değerleri | Milisaniye |
| Giriş sayfası | RTL ve sahte API | Form ve istek/yanıt bağlantısı | Onlarca milisaniye |
| Girişten liste oluşturmaya | Gerçek uygulama ve tarayıcı | Route, form, depolama ve gezinme | Saniyeler |

Bir testin kapsadığı alan büyüdükçe daha çok şeyi doğrular, fakat kalınca daha çok olası neden bırakır. “Beklenen başlık görünmedi” tek başına formun hiç açılmadığını, ağın yanıt vermediğini veya route’un yanlış olduğunu söylemez. Dar testler hata yerini hızlı buldurur; geniş testler parçalar arası boşluğu kapatır.

Bu nedenle hata incelemesinde “hangi test daha gerçekçi?” sorusu yerine “hangi küçük kanıt eksik?” diye sor. Saf fonksiyon testinde hata varsa bütün ekranı açmadan hesap kuralını düzeltirsin. Bileşen ve sahte servis birlikte çalışırken hata çıkıyorsa entegrasyon testi doğru yerdir. Hata ancak gerçek başlangıç route’u, browser depolaması veya host davranışı devreye girince oluşuyorsa o birleşimi kapsayan E2E gerekir.

Bir test kapsamını büyütmek yeni bir maliyet de getirir: browser açılışı, server hazırlığı, veri sabitleme ve olası zamanlama farkları. Her katmana aynı beklentiyi kopyalama. Örneğin formun boş e-postayı reddetmesi bileşen testinde çok sayıda sınır değerle sınanabilir; E2E’de yalnızca kullanıcıya önemli olan başarılı ve başarısız kayıt yolculukları tutulur.

## Kullanıcının yolunu zaman sırasıyla izle

Girişten listeye giden bir tarayıcı testi beş ayrı gözlem toplar:

| Sıra | Tarayıcı olayı | Beklenen görünür sonuç | Koparsa şüphe |
| --- | --- | --- | --- |
| 1 | Kullanıcı /watchlists adresini açar | Adres /login olur | Korumalı yönlendirme |
| 2 | Sayfa yüklenir | Giriş formu görünür | Route ağacının birleşimi |
| 3 | Bilgiler gönderilir | Oturum sonrası sayfa açılır | Form ve API bağlantısı |
| 4 | Liste sayfasına gidilir | Liste adı alanı görünür | Dönüş adresi veya oturum |
| 5 | Liste kaydedilir | Yeni ad ekranda görünür | Submit ve UI güncellemesi |

İz sürerken her assertion’ın hangi kullanıcı amacına karşılık geldiğini sor. Yalnızca sayfa başlığını kontrol etmek ilk görünümü doğrular; kullanıcının liste oluşturabildiğini kanıtlamaz. Çok fazla beklentiyi tek teste yığarsan ilk kalış sonraki adımları gizler; senaryoyu anlamlı kritik yolculuklara ayır.

Örneğin kullanıcı önce bir içerik bulup sonra ayrıntıya geçiyorsa, yalnızca arama kutusunun göründüğünü doğrulamak yeterli değildir. Akış, sonuç bağlantısının ve açılan ayrıntı başlığının da görünmesini beklemelidir. Buna karşılık her kartın puanını, boş tarihini ve tüm hata mesajlarını tarayıcıyla kontrol etmek gerekmez; bu kurallar küçük testlerde daha hızlı ve anlaşılırdır.

## Önce kırık, sonra anlamlı kontrol

Kırık kontrol yalnızca uygulamanın başlığını doğrular. Başlık doğru olsa da liste isteği başarısız olmuş olabilir:

~~~ts
await page.goto('/')
await expect(page.getByRole('heading', { level: 1, name: 'Etkinlikler' })).toBeVisible()
~~~

Etkinlik kataloğunda daha anlamlı kontrol, kullanıcının aradığı içeriği de bekler:

~~~ts check title="e2e/event-home.spec.ts"
import { expect, test } from '@playwright/test'

test('etkinlik sayfası haftanın programını gösterir', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Etkinlikler' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bu hafta' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Açık hava gösterimi' })).toBeVisible()
})
~~~

İki örnek farklı kapsam taşır: ilkinde başlık vardır ama kullanıcı işi bitmez; ikincisinde anlamlı sonuç da görünür. Gerçek uygulamada rol ve erişilebilir ad kullanmak testin kullanıcıya benzer şekilde arama yapmasını sağlar. Testin adı da beklenen davranışı anlatmalıdır; “sayfa çalışıyor” gibi belirsiz bir isim, hangi kullanıcı amacının güvenceye alındığını göstermez.

## Sınırlar ve sık hatalar

:::mistake[Her ayrıntıyı tarayıcıda sınamak]
**Belirti:** Küçük bir sayı kuralı değişince yüzlerce saniyelik test kırılır. → **Neden:** Her kenar durumu en pahalı katmanda tekrarlanmıştır. → **Düzeltme:** Fonksiyon kurallarını birim, ekran davranışını entegrasyon, az sayıdaki kritik yolculuğu E2E ile koru.
:::

:::mistake[Başlığı başarı saymak]
**Belirti:** Sayfa başlığı doğru görünür ama içerik hiç gelmez. → **Neden:** Assertion kullanıcı amacını değil yalnızca kabuğu ölçer. → **Düzeltme:** Yolculuğun sonunda kullanıcının aradığı görünür sonucu da doğrula.
:::

:::mistake[Testi yalnız yerelde çalıştırmak]
**Belirti:** Değişiklik main’e geçtikten sonra E2E ilk kez çalışır. → **Neden:** Tarayıcı senaryosu otomatik değişiklik kapısına bağlı değildir. → **Düzeltme:** Aynı komutları CI’da çalıştır ve temiz makinenin tarayıcı ihtiyacını kur.
:::

:::mistake[E2E’yi hiç yazmamak]
**Belirti:** Her küçük bileşen doğruyken girişten listeye giden yol bozulur. → **Neden:** Testler yalnızca parçaları ayrı ayrı kurmuştur. → **Düzeltme:** Ürün için kritik olan birkaç yolculuğu gerçek uygulama üzerinden yürüt.
:::

:::sector[Sektörde]
Takımlar genellikle çok sayıda hızlı birim ve entegrasyon testi, daha az sayıda E2E testi tutar. E2E listesi ürünün oturum açma, ödeme veya ana iş akışı gibi kritik risklerini korur. Test kalınca ekip hangi katmanın kanıt verdiğine bakar; tüm kontrolleri tarayıcı testine taşımak bakım maliyetini artırır. Playwright ile Chromium, Firefox ve WebKit sürülebilir; bu modülde Chromium kullanıyoruz.
:::

## Özet

- Birim testi küçük bir kuralı, entegrasyon testi bağlı parçaları, E2E testi tarayıcıdaki yolculuğu sınar.
- Geniş kapsam daha çok birleşim hatasını görür; dar test daha hızlı ve kolay teşhis edilir.
- E2E’yi kritik kullanıcı yollarına ayır; ayrıntıları hızlı katmanlarda bırak.
- Yeşil test yalnızca kurduğu kapsamı güvenceye alır.

**Kendini yokla:** Bir süre biçimlendirme kuralı için ilk tercihin hangi katman olur?  
*Cevap:* Birim testi; sınır değerlerini tarayıcı açmadan hızlıca denersin.

**Kendini yokla:** Route ağacındaki giriş döngüsünü neden yalnızca sayfa testi yakalamayabilir?  
*Cevap:* İzole sayfa testi gerçek route ağacını kullanmıyor olabilir; hata parçaların bağlandığı yerdedir.
