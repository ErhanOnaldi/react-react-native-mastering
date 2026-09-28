---
title: "Test sınırlarını birlikte kullan"
minutes: 7
kind: practice
---

# Test sınırlarını birlikte kullan

:::pain[Sinema’da ne oldu?]
Tek bir refactor’da sayfa dilimi, API hata ayrıntısı ve arama query’si bozuldu. “Çalışıyor” diyen tek test bu farklı regresyonların hiçbirini açıklamıyor.
:::

## Her belirtiye uygun assertion

Bu pekiştirmede farklı test yaklaşımlarını bir arada uygulayacaksın. Sayfalama saf bir dönüşüm olarak incelenebilir; hata cevabı controlled network boundary gerektirir; arama akışında URL alanları ve boş girdi davranışı ayrı gereksinimlerdir. Her biri için testi kırabilecek farkı önce cümleye dök.

:::model[Test anatomisi]
Arrange girdiyi kurar, Act gerçek fonksiyonu veya akışı çalıştırır, Assert görülen sonucu karşılaştırır. Bu üç adım değişmez; değişen, bağımlılıkların sayısı ve uygun sınırdır. Saf fonksiyonda fake gerekmez, dış HTTP çağrısında kontrol edilen fetch sınırı gerekebilir.
:::

## Çalışma sırası

1. Hata hikâyesini tek cümleyle yaz: hangi girdi yanlış sonucu üretiyor?
2. Bilinen doğru sonucu belirle ve buna en yakın test sınırını seç.
3. Assertion’ın hangi yanlış uygulamada kırılacağını düşün.
4. Gerçek dış etkileri yalnız testin kontrol alanına al ve her değişikliği geri yükle.
5. Test adını başarısızlık raporunda yol gösterecek şekilde yaz.

Örneğin “sayfa dilimi iki öğe döndürür” yanlış offset’i yakalamaz. İkinci sayfanın ilk öğesini ve son sayfanın içeriğini belirtmek gerekir. Hata yönetiminde de yalnız herhangi bir rejection değil, çağırana aktarılması gereken HTTP durumu ve servis mesajı önem taşıyabilir. Aramada boş metnin hiç istek atmaması, dolu aramanın doğru query’yi taşımasından farklı davranıştır.

## Sınırları birbirine karıştırma

İlk testte yalnız çağrı sayısına bakma; query parametresinin içeriğini çözümle. İkinci testte başarılı cevaptaki alanları genişçe karşılaştırmak yerine hata sözleşmesinin kritik alanlarını seç. Üçüncüde fake fetch’i her testten sonra geri al; aksi halde başka dosyadaki testler de sahte davranışa bağlanır.

:::mistake[Bir testle üç davranışı belirsizleştirmek]
Belirti: Hata raporu sayfalama mı, error mapping mi yoksa query mi bozuldu söylemez. → Neden: Bağımsız gereksinimler tek geniş senaryoya yüklenmiştir. → Düzeltme: Her davranışı ayrı, hedefli test adı ve assertion ile koru.
:::

:::sector
Regresyon testleri geçmişte görülen bir belirtiye bağlandığında en değerlidir. Mutation yaklaşımında da her testin gerçek hata varyantlarından en az birini yakalaması, assertion’ın yalnız satır çalıştırmadığını gösterir.
:::

## Özet

- Saf hesapta dönüş değerini; dış çağrıda protokol sınırını ölç.
- Çağrının varlığı kritik argümanın doğru olduğunu kanıtlamaz.
- Farklı davranışlar için ayrı test adları kullan.
- Fake global değerleri temizle ve testleri bağımsız tut.

**Kendini yokla:** İstek yapılmışsa arama testi tamam mıdır? Hayır; query, sayfa ve boş girdi gibi sözleşme davranışlarını da sınamalısın.
