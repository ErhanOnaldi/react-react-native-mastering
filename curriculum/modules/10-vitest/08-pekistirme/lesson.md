---
title: "Test sınırlarını birlikte kullan"
minutes: 6
kind: practice
---

# Test sınırlarını birlikte kullan

Bu alıştırmalarda sayfalama, API hatası ve arama davranışları için test yazacaksın. Her soruda önce kullanıcının fark edeceği davranışı söyle; sonra o davranışı gözleyebileceğin en küçük sınırı seç.

:::model[Test anatomisi]
Arrange girdiyi hazırlar, Act gerçek fonksiyonu çalıştırır, Assert beklenen sonucu karşılaştırır. Assertion, bu karşılaştırmayı yapan beklentidir. Testini bu üç adımda kur; her adımın neden orada olduğunu anlayabiliyorsan daha kolay fark edersin neyin bozulduğunu.
:::

:::model[Bir davranış, bir sınır]
Saf bir hesaplamada girdiyi verip dönüş değerini karşılaştırırsın. `fetch` gibi dışarıyla konuşan bir sınırda sahte yanıt kullanabilirsin; uygulamanın URL kurma ve hata taşıma kodu gerçek çalışmaya devam eder. Böylece testi hızlı ve deterministic (aynı koşullarda her çalıştırmada aynı sonucu veren) tutarken gerçekten önemli kararı sınarsın.
:::

## Üç farklı davranış

Sayfalama testinde yalnızca sonuç sayısına bakmak, yanlış sayfanın aynı sayıda kayıt döndürmesini kaçırabilir. İkinci sayfanın başlangıcını ve son sayfada hangi kaydın kaldığını düşün; içerik beklentisi, yanlış offset’i görünür kılar.

API hatasında istek reddedildi demek tek başına yeterli değildir. Çağıran kod HTTP durumunu, servis kodunu ve mesajı ayrı ayrı kullanabilir; testin bu bilgilerin taşındığını göstermesi gerekir.

Arama testinde dolu sorgunun URL’ye ve yetkilendirme başlığına nasıl yansıdığını, boş sorgunun ise ağ çağrısı oluşturmamasını ayrı davranışlar olarak ele al. Çağrı yapıldı mı sorusu, doğru sorgunun gönderildiğini tek başına göstermez.

## Nasıl ilerleyeceksin?

Önce test adını davranış cümlesi yap: “ikinci sayfanın ilk kaydı doğru” gibi. Sonra küçük bir girdi kur, Arrange–Act–Assert sırasını izle ve assertion’ının hangi yanlış sonucu yakalayacağını sor. Birbirinden bağımsız davranışları ayrı testlerde tut; böylece başarısızlık sana hangi beklentinin bozulduğunu söyler.

:::mistake[Her şeyi tek beklentide toplamak]
Belirti: Test başarısız olur ama sayfalama mı, hata ayrıntısı mı yoksa arama mı bozuldu anlayamazsın. → Neden: Farklı davranışlar tek geniş senaryoya yüklenmiştir. → Düzeltme: Her davranış için ayrı, açık isimli test yaz.
:::

## Özet

- Test adını, koruduğun davranışı anlatacak şekilde yaz.
- Saf dönüş değerini ve dış çağrı sınırını uygun ayrı yöntemlerle gözle.
- İstek sayısını değil, istek ayrıntılarını ve kullanıcıya dönen sonucu da düşün.
- Her testte assertion’ın hangi yanlış davranışı yakalayacağını bil.

**Terimler:** **assertion** — beklenen bir sonucu karşılaştıran test ifadesi. **Deterministic** — aynı koşullarda tekrarlandığında aynı sonucu veren.

**Kendini yokla:** `fetch` çağrıldıysa aramanın doğru olduğunu biliyor musun? Hayır; URL, başlıklar ve dönen sonuç gibi davranış ayrıntılarını da kontrol etmelisin.
