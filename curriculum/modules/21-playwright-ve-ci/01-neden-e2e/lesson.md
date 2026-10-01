---
title: "E2E testi hangi boşluğu kapatır?"
minutes: 16
kind: concept
---

# E2E testi hangi boşluğu kapatır?

Bir film kartındaki puanın nasıl yuvarlandığını JavaScript fonksiyonunda sınayabilirsin. Ama Sinema’da kullanıcı giriş yapıp izleme listesi oluşturamıyorsa, puan fonksiyonunun doğru olması pek işe yaramaz. Önce elindeki testlerin hangi parçayı çalıştırdığına bakalım.

## Aynı film, üç farklı kontrol

Sinema ana sayfasında bir film puanının 8.4 olarak gösterilmesi gerektiğini düşün. Bunu sağlayan küçük kural şöyle olabilir:

```ts
function formatRating(rating: number) {
  return rating.toFixed(1)
}
```

Bu fonksiyona `8.36` verip `8.4` döndüğünü kontrol etmek için uygulamayı açman gerekmez. Böyle tek bir kuralı sınayan teste **birim testi** denir. Hata varsa sorun fonksiyondadır; tarayıcı, route veya ağ aramak zorunda kalmazsın.

Şimdi puanı gösteren film kartını düşün. Başlık, puan ve favori düğmesi birlikte doğru görünmeli. React Testing Library (RTL), React bileşenini DOM’a çizip kullanıcının göreceği metin ve düğmeleri kontrol etmene yarar. Bu kontrol fonksiyon testinden daha geniştir, ama uygulamanın tamamını başlatmaz.

Bir testi geçerli saymak için beklenen sonucu kontrol eden ifadeye **assertion** denir. Örneğin “Dövüş Kulübü başlığı görünür” bir assertion’dır. Assertion’ın hangi kapsamda çalıştığı, sana hangi konuda güvence verdiğini belirler.

```tsx
render(<MovieCard title="Dövüş Kulübü" rating={8.4} />)
expect(screen.getByRole('heading', { name: 'Dövüş Kulübü' })).toBeVisible()
expect(screen.getByText('8.4')).toBeVisible()
```

Burada bileşen başlığı ve puanı aynı yerde kontrol ediyoruz. Kart içindeki başlık yanlışsa test yakalar; gerçek ana sayfa bu kartı hiç göstermiyorsa bileşen testi bunu bilemez. Çünkü kartı tek başına çizdik.

### Bileşenler birlikte çalışınca

Bir sonraki adımda gerçek route listesini ve giriş durumunu kurup `/watchlists` adresini açtığını düşün. Oturumsuz kullanıcı `/login` sayfasına gönderilmeli ve giriş formu görünmeli. Bu bağlı parçaları birlikte çalıştıran kontrole **entegrasyon testi** denir.

```ts
renderWithRouter(
  <AppRoutes initialEntries={['/watchlists']} session={null} />,
)
expect(screen.getByRole('heading', { name: 'Giriş yap' })).toBeVisible()
```

Bu test artık yalnızca formun kendisine bakmıyor; gerçek route bağlantısı ve oturum bilgisi de devrede. Yine de tarayıcıyı ve üretimde kullanılan başlangıç yolunu açmış değiliz. Test ortamı uygulamanın bir bölümünü kuruyor.

### Tarayıcıdaki yolculuk

Şimdi aynı işi kullanıcı gibi düşün: tarayıcıda `/watchlists` açılır, adres `/login` olur, form görünür, kullanıcı bilgilerini gönderir, liste ekranına geçer ve bir liste adı kaydeder. Bu akışı gerçek uygulamayı tarayıcıda açarak sınayan teste **uçtan uca (E2E) testi** denir. Tarayıcı, gerçek route’ları, React bileşenlerini ve uygulamanın başlangıç ayarlarını birlikte çalıştırır.

E2E’de yalnızca “sayfa açıldı” demek yetmez. Kullanıcı amacını gösteren görünür sonucu da kontrol edersin: örneğin yeni listenin adı sayfada görünmeli. Böylece test, uygulamanın kabuğunu değil işin tamamlandığını kanıtlar.

## Hata hangi sınırda saklı?

Sinema’da giriş sayfası tek başına düzgün görünüyor, korumalı sayfa da oturumsuz kişiyi doğru yere gönderiyor olsun. Buna rağmen gerçek uygulamada `/login` de koruma altında kaldığı için form hiç görünmüyorsa, iki parçanın birleştiği yerde hata vardır.

| Kontrol | Kurulum | Bu örnekte neyi görebilir? | Yaklaşık süre |
| --- | --- | --- | --- |
| Birim | Puan biçimlendirme fonksiyonunu çağır | `8.36` doğru biçimde `8.4` oluyor mu? | Milisaniye |
| RTL bileşen testi | Film kartını ve sahte veriyi çiz | Kart başlığı ve puanı doğru mu? | Onlarca milisaniye |
| Entegrasyon | Gerçek route listesini ve oturum durumunu kur | `/watchlists` giriş ekranına yönlendiriyor mu? | Onlarca-yüzlerce milisaniye |
| E2E | Uygulamayı başlatıp tarayıcıda kullanıcı yolunu izle | Girişten liste kaydetmeye kadar akış çalışıyor mu? | Saniyeler |

![Birim, entegrasyon ve uçtan uca testlerin kapsadığı alanlar](diagram:test-katmanlari)

Her satır bir öncekinden daha geniş bir alanı çalıştırıyor. Geniş kapsam, route’ların veya gerçek başlangıç ayarlarının birleşmesinden doğan hataları yakalayabilir; ama hata çıktığında olası nedenler de çoğalır. Bu yüzden puanın yuvarlanmasını E2E’ye taşımak gereksiz yere yavaş ve zor teşhis edilir olur.

Bu seçim “en gerçekçi test hangisi?” diye yapılmaz. “Hangi risk kaldı ve bunu en dar, anlaşılır testle nasıl görünür yaparım?” diye sorarsın. Ufak hesap kuralları birim testinde; bileşen davranışı RTL’de; birbirine bağlı route ve UI davranışları entegrasyon testinde iyi korunur. Tarayıcıya kadar uzanan az sayıdaki kritik kullanıcı yolu E2E’ye uygundur.

## Bir kullanıcı yolunu adımlara ayır

E2E yolculuğu, tek bir büyük “çalışıyor” kontrolü değildir. Her adım kullanıcıya görünür bir sonuç üretir:

| Sıra | Kullanıcı ne yapar? | Ekranda ne görmeli? | Görünmüyorsa olası alan |
| --- | --- | --- | --- |
| 1 | `/watchlists` adresini açar | Adres `/login` olur | Route koruması |
| 2 | Sayfa yüklenir | Giriş formu görünür | Route’ların bağlanması |
| 3 | Bilgileri gönderir | Oturum açılır ve liste ekranı gelir | Form ile API bağlantısı |
| 4 | Liste adını yazar ve kaydeder | Yeni listenin adı görünür | Kaydetme ve ekran güncellemesi |

Bu sıra, başarısızlığın hangi kullanıcı adımında ortaya çıktığını anlamana yardım eder. Yalnızca H1 başlığını kontrol edersen sayfa kabuğunun geldiğini bilirsin; liste kaydetmenin çalıştığını bilmezsin. Öte yandan her filmin tüm puan biçimlerini ve boş alan mesajlarını bu yolculuğa eklemek testi gereksiz yere uzatır. Bunlar daha dar testlerde kalabilir.

## Sık düşülen iki tuzak

:::mistake[Her ayrıntıyı tarayıcıda sınamak]
**Belirti:** Ufak puan biçimi değişikliğinde uzun E2E testleri kırılıyor. → **Neden:** Sınır değerleri en geniş ve pahalı katmanda tekrar edilmiş. → **Düzeltme:** Hesap kurallarını birim testinde, kullanıcıya önemli birleşimleri entegrasyon veya E2E’de tut.
:::

:::mistake[Başlığı başarı saymak]
**Belirti:** Sayfa başlığı görünüyor ama film listesi boş. → **Neden:** Assertion yalnızca sayfa kabuğunu kontrol ediyor. → **Düzeltme:** Kullanıcının o yolculuğun sonunda beklediği gerçek sonucu da kontrol et.
:::

:::mistake[E2E’yi yalnızca yerelde çalıştırmak]
**Belirti:** Kullanıcı akışı değişiklikten sonra CI’da ilk kez bozuluyor. → **Neden:** Test otomatik değişiklik kontrolüne bağlı değil. → **Düzeltme:** Kritik E2E yollarını CI’da da çalıştır; böylece bozulma kod birleştirilmeden görünür olur.
:::

E2E listesi genellikle giriş, arama veya liste oluşturma gibi ürünün ana işlerini kapsayan küçük bir gruptur. Playwright aynı testi farklı tarayıcılarda da çalıştırabilir; bu modülde Chromium kullanacağız. Her ayrıntıyı tarayıcıda tekrarlamak yerine her katmana kendi güçlü olduğu soruyu ver.

## Özet

- Birim testi tek kuralı, RTL bileşen testi tekil UI davranışını, entegrasyon testi bağlı parçaları, E2E tarayıcıdaki kullanıcı yolunu sınar.
- Kapsam büyüdükçe birleşim hatalarını görebilirsin; hata kaynağını bulmak da zorlaşır.
- E2E’yi kullanıcı için kritik, baştan sona giden az sayıdaki akışa ayır.
- Assertion, testte beklenen sonucu kontrol eden ifadedir; onu kullanıcı amacına bağla.

**Yeni terimler**

- **Birim testi:** Tek bir fonksiyon veya küçük kuralı uygulamanın geri kalanından ayrı sınar.
- **Entegrasyon testi:** Birlikte çalışması gereken uygulama parçalarını aynı testte kurar.
- **E2E testi:** Kullanıcının tarayıcıda izlediği yolu gerçek uygulamada sınar.
- **Assertion:** Testte beklenen sonucu kontrol eden ifade.

**Kendini yokla:** Puanın `8.36` değerini `8.4` yapmasını hangi testle başlatırsın?  
*Cevap:* Birim testiyle; tarayıcı açmadan fonksiyonun kuralını kontrol edebilirsin.

**Kendini yokla:** Giriş sayfası ve koruma ayrı ayrı doğruyken gerçek route bağlantısı bozuksa hangi test görebilir?  
*Cevap:* Gerçek route listesini kullanan entegrasyon testi veya gerçek uygulama yolunu izleyen E2E testi.
