---
title: "Dış bağımlılığı kontrollü kıl"
minutes: 17
kind: concept
---

# Dış bağımlılığı kontrollü kıl

:::pain[Sinema’da ne oldu?]
API client testini gerçek film servisine bağlayınca ağ kesintisi, token süresi ve sunucudaki veri değişikliği aynı sonucu etkiliyor. Test başarısız olduğunda client’ın mı yoksa bağlantının mı bozulduğunu ayıramıyorsun.
:::

## Sınırda sahte, içeride gerçek

Test edilecek kod dış dünyaya dayanıyorsa o sınırı kontrol etmelisin. Ağ, saat, rastgelelik veya browser storage aynı girdide her zaman aynı sonucu vermeyebilir. Mock, testin kontrol etmediği bir bağımlılığın yerini alır; amaç test edilen gerçek kodun davranışını sahtelemek değildir.

Önceki modüllerde davranışı ve test sınırını seçmeyi öğrendin. Burada Vitest’in vi.fn, vi.spyOn ve vi.stubGlobal araçlarıyla sahteyi nereye koyduğunu belirginleştireceğiz. Uygulamanın client kodu çalışsın ama fetch gerçek ağa çıkmasın. Böylece gönderilen isteği ve dönen cevabı deterministik biçimde seçebilirsin.

## Mock seçimi için kesin kurallar

1. vi.fn sıfırdan bir fake function üretir. Çağrı argümanlarını, sayısını ve kurduğun dönüş değerini görebilirsin.
2. vi.spyOn(object, method) var olan metoda gözlem noktası koyar. Varsayılan olarak gerçek metodu çalıştırır; yalnızca gözlemek istediğinde uygundur.
3. vi.stubGlobal(name, value), fetch gibi global sınırın yerine test kontrollü bir değer koyar. İşi bitince vi.unstubAllGlobals() ile önceki değeri geri yükle.
4. vi.mock(module) modül sınırının tamamını taklit eder. Bu geniş bir müdahaledir; daha dar bir bağımlılık yeterliyse modülün tamamını değiştirme.
5. Sahte cevap, çağrı argümanı ve cleanup aynı senaryoda okunabilir olmalıdır.
6. Fake’i gerçek bağımlılığın yerine koy, test edilen fonksiyonun yerine değil.

![Client gerçek kalır, yalnız fetch sınırı kontrollü fake ile değiştirilir](diagrams/mock-siniri.svg)

## İstek sınırını zaman içinde izle

Bir API client metodu çağrıldığında önce URL ve headers hazırlar, sonra global fetch çağırır, ardından cevabı işler. Gerçek fetch yerine fake koyarsan sıra şöyledir:

| Zaman | Gerçek client | Testin kontrol ettiği sınır |
| --- | --- | --- |
| 1 | Arama yolu ve query oluşturulur | fetch henüz çağrılmadı |
| 2 | Client Authorization başlığını ekler | fake çağrı argümanlarını kaydeder |
| 3 | fetch çağrılır | test URL ve başlığı inceler |
| 4 | Cevap okunur | fake belirlediğin Response nesnesini döndürür |
| 5 | Client sonucu verir | test verinin korunduğunu denetler |

Bu test gerçek URL kurma ve response okuma kodunu çalıştırır. Yalnız dış ağ cevabı sahte olduğundan test token’a veya internet erişimine bağlı değildir. Fake’i uygulamanın her katmanına yayarsan test yalnızca senin yazdığın sahte davranışları doğrular; gerçek client hatası görünmez.

## Önce kırık, sonra doğru

Aşağıdaki kırık yaklaşım test sırasında da gerçek ağı kullanır:

    async function loadShelf(): Promise<string[]> {
      const response = await fetch('https://example.invalid/shelf')
      return response.json() as Promise<string[]>
    }

    void loadShelf()

Çalıştırma anında ağ sonucu ve erişilebilirlik dış koşullara bağlıdır. Sahte fetch kurup test edilen fonksiyonu değiştirmeden çağır:

    import { afterEach, expect, it, vi } from 'vitest'

    afterEach(() => vi.unstubAllGlobals())

    it('raf içeriğini sunucudan gelen adlarla verir', async () => {
      const fakeFetch = vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({ names: ['Sessiz Şehir'] }),
      )
      vi.stubGlobal('fetch', fakeFetch)
      const result = await loadShelf()
      expect(fakeFetch).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ names: ['Sessiz Şehir'] })
    })

Burada loadShelf gerçek fonksiyondur; fetch ise çağrı argümanı ve response’u testin belirlediği sınırdır. Test client’ın URL’sini kuruyorsa URL’yi new URL(String(input)) ile çöz ve önemli query alanını oku. Parametre sırası gereksinim değilse ham stringi karşılaştırma. Headers için new Headers(init?.headers) kullanmak harf biçimi farkını gizlerken değeri korur.

## Spy ve cleanup

Bir metot gerçek davranışıyla çalışmalı ama etkisini görmek istiyorsan spy ekle. Örneğin storage’a yazılan anahtarı denetlerken Storage.prototype.setItem çağrısını izleyebilir, gerçek localStorage içeriğini de okuyabilirsin. Sadece “metot çağrıldı” demek yetersizdir; hangi anahtara hangi verinin yazıldığını da davranış gerektiriyorsa karşılaştır.

Testler birbirini etkilememeli. vi.stubGlobal ile globali değiştirince afterEach veya eşdeğer cleanup’ta geri yükle. vi.spyOn için vi.restoreAllMocks() kullan. Vitest 5’te clearMocks: true çağrı geçmişini her test öncesi temizler, fakat mock implementation’ı korur. Bu ayar globali geri yüklemekle aynı şey değildir; cleanup işini yine yapmalısın. Her testteki kurulum da davranışı açık göstermelidir.

Async çağrıda sonucu bekle. await client.get(...) olmadan test gövdesi assertion’dan önce tamamlanabilir. Promise rejection’ı doğrularken await expect(promise).rejects... yaz; Vitest 5 beklenmeden bırakılmış rejects assertion’ını başarısız sayar. Sahte cevap başarı ve hata durumunu ayrı örneklerle kontrol etmeye izin verir.

Bir mock’un kapsamı test sorusuna göre dar olmalı. Client testinde yalnız fetch değiştirilir; response parse etme, URL kurma ve hata dönüştürme gerçek kodda kalır. Tüm client modülünü mock edersen bu davranışların hiçbiri test edilmez. vi.fn yeni method yaratmak, vi.spyOn mevcut davranışı koruyarak izlemek içindir.

Mock’un neyi kanıtlamadığını da bil. Fake fetch’in bir çağrı kaydetmesi internetin çalıştığını veya uzak servisin isteği kabul ettiğini göstermez. Test, client’ın doğru protokol isteği oluşturduğunu ve cevabı beklenen biçimde işlediğini kanıtlar. Gerçek ağ entegrasyonu ayrı bir doğrulama türüdür; günlük unit testlere ağ erişimi eklemek bu soruyu daha iyi yanıtlamaz.

:::mistake[Gerçek ağa çıkmak]
Belirti: Test bazen token, DNS veya servis hatasıyla kalır. → Neden: Dış ağ testin kontrol alanında değildir. → Düzeltme: Client’ın kullandığı fetch sınırına deterministic fake koy.
:::

:::mistake[Sadece çağrı sayısını doğrulamak]
Belirti: Bir istek yapılır ama query veya Authorization yanlıştır. → Neden: Argümanlar incelenmemiştir. → Düzeltme: URL parametrelerini ve headers değerini çözümleyip karşılaştır.
:::

:::mistake[Mock’u temizlememek]
Belirti: Test tek başına geçer, dosya bütünü farklı sırada kalır. → Neden: Global veya spy önceki testten sızmıştır. → Düzeltme: Stub’ları ve spy’ları afterEach içinde geri al.
:::

:::sector
Servis client’larında ekipler dış HTTP sınırını unit testte fake eder; daha geniş entegrasyonda uygulama isteğini MSW gibi HTTP katmanında yakalar. Mock seviyesi testin cevaplayacağı soruyu belirler: client ne gönderdi, yoksa uygulama genelinde ağ akışı doğru mu?
:::

Mock edilen bağımlılığın cevabını da sen seçtiğin için gerçekçi bir cevap kullan. Uygulama JSON parse ediyorsa Response.json ile Response benzeri bir değer vermek düz object vermekten daha çok gerçek kodu çalıştırır. Client HTTP status kontrol ediyorsa status değerini gerekli cevaba göre ayarla. Fake doğru koşulu kurmazsa test beklediğin hata dalını çalıştırmayabilir.

Başarı ve hata davranışlarını ayrı testlerde görmek yararlıdır. Başarı testi URL, authorization ve dönen veriyi kontrol eder. Hata testi HTTP status, servis hata kodu ve mesajı ölçer. Aynı çağrı sınırını kullanırlar ama farklı karar dallarıdır; ayrı başlıklar başarısızlığı daraltır.

vi.clearAllMocks ile vi.restoreAllMocks aynı işi yapmaz. İlki çağrı geçmişini sıfırlar; ikincisi spy’ın sardığı metodu geri koyar. Vitest 5 clearMocks ayarı geçmişi test öncesi temizleyebilir, fakat global stub’ı kaldırmaz. Testin yaptığı değişikliğe uygun cleanup seç.

Bir mock kurulumunu okurken bağımlılığın hangi kısmının sahte olduğunu zihninde işaretle. Eğer fake fetch yanıtı yalnız başlığı döndürüyorsa test parsing davranışını çalıştırmayabilir. Eğer bütün client fake edildiyse URL ve headers üreten kod da devre dışı kalır. Fake’in verdiği response, gerçek kodun incelemesi gereken şekli ve status’u taşımalıdır.

Gerçek kullanıcı akışlarında bu yaklaşımın sınırı vardır. Fetch fake’i client’ın isteği kurmasını doğrular ama uygulamanın bütün component ağacına bağlandığını kanıtlamaz. Daha geniş testte istekleri HTTP katmanında yakalayan MSW gibi bir araç seçilebilir; bu, gerçek fetch kodunu ve uygulama wiring’ini çalıştırır. Her araç kendi test sorusuna uyar.

## Özet

- Mock kontrol etmediğin dış bağımlılığın yerine geçer.
- vi.fn yeni fake üretir, vi.spyOn var olan metodu izler, vi.stubGlobal globali değiştirir.
- Gerçek client’ı çalıştırıp yalnız fetch sınırını taklit etmek kapsamı dengeler.
- URL ve headers içinden sözleşme alanlarını oku; ham sıraya bağlanma.
- Global ve spy değişikliklerini her testten sonra geri yükle.

**Kendini yokla:** vi.spyOn gerçek metodu kendiliğinden durdurur mu? Hayır; varsayılanı gerçek davranışı sürdürüp çağrıyı izlemektir.

**Kendini yokla:** Client’ın URL üretimini de ölçmek istiyorsan hangi bölümü mock’lamalısın? Yalnız ağ sınırını; client’ın kendisini gerçek bırak.
