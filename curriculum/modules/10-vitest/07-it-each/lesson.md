---
title: "Aynı kuralı veri tablosuyla sınayalım"
minutes: 15
kind: concept
---

# Aynı kuralı veri tablosuyla sınayalım

:::pain[Sinema’da ne oldu?]
Tarih biçimleyici boş tarihte doğru çalışıyor ama geçerli tarihlerden yalnızca birinde doğru. Her girdi için kopyalanmış test gövdeleri eklenince hangi sınırın eksik olduğu da okunmuyor.
:::

## Tek davranış, birden çok örnek

Testin amacı her olası değeri gelişigüzel çoğaltmak değildir. Aynı kuralın birkaç girdi için sonucunu görmek gerekiyorsa Vitest’in it.each biçimi her veri satırını ayrı test olarak yürütür. Böylece raporda hangi örneğin bozulduğu görünür, tekrarlanan Arrange–Act–Assert kodu ortadan kalkar.

Sen önceki modüllerde küçük testler yazdın; bu derinleşme, örnek uzayını nasıl okunur bir tabloya dönüştüreceğini gösterir. Veri tablosu testin kendisi değildir. Her satır aynı davranış kuralını farklı girdide sınar. Birbirinden farklı davranışları tek tabloda toplarsan başlıklar ve hata raporu anlamını kaybeder.

:::model[Test anatomisi]
Her satırda da hazırla, çalıştır, doğrula sırası korunur. Değişen yalnızca hazırlıktaki girdi ve ona karşılık gelen beklenen değerdir; callback aynı davranışı her satır için tekrar çalıştırır.
:::

## Veri tablosu kuralları

1. Her satır aynı fonksiyonu, aynı kuralı ve aynı assertion türünü kullanmalıdır.
2. Parametre tablosundaki her satır bağımsız bir test sonucudur.
3. Başlıkta %s veya Vitest’in başka placeholder’larıyla girdiyi görünür kıl.
4. Normal değerlerin yanı sıra ayrı karar oluşturan sınırları ekle.
5. Farklı davranışlar için ayrı test adları kullan; tabloyu rastgele örnek deposuna çevirme.
6. Beklenen değerleri iş kuralından çıkar ve tablonun kapsamını kontrol et.

![Her girdi satırı aynı davranışla kendi beklenen sonucuna gider](diagrams/veri-tablosu.svg)

## Satırları sırayla izle

Diyelim ki salon kapasitesi bilinmiyorsa kullanıcıya “Kapasite yok”, sayı verilmişse “N koltuk” yazan bir yardımcı var. Her satır aynı biçimlendirme kararını ölçer:

    it.each([
      [undefined, 'Kapasite yok'],
      [0, '0 koltuk'],
      [120, '120 koltuk'],
    ])('%s kapasitesi %s etiketini verir', (count, expected) => {
      expect(formatSeats(count)).toBe(expected)
    })

Runner ilk satırda count değerini undefined, expected değerini “Kapasite yok” yapar; fonksiyon çağrılır ve string tam eşitlikle ölçülür. Sonraki satırlar aynı callback’i ayrı ayrı çalıştırır. Bir örnek kalırsa raporda başlık ve parametre görünür. İkinci satır olan sıfır özellikle anlamlıdır: falsy değeri “bilgi yok” sanan uygulamalar 0 koltuğu yanlış etiketleyebilir.

## Önce kırık, sonra doğru

Elle kopyalanmış testlerde adlar bile aynı kalabilir:

    it('kapasiteyi biçimlendirir', () => {
      expect(formatSeats(0)).toBe('0 koltuk')
    })
    it('kapasiteyi biçimlendirir', () => {
      expect(formatSeats(120)).toBe('120 koltuk')
    })

Bu örnek hangi girdinin bozulduğunu başlıktan söylemez ve aynı Arrange–Act–Assert gövdesini tekrar ettirir. Tablo, örnekleri toplar ve girdi bilgisini başlığa taşır:

    it.each([
      [0, '0 koltuk'],
      [120, '120 koltuk'],
    ])('%i koltuk için %s yazar', (count, expected) => {
      expect(formatSeats(count)).toBe(expected)
    })

Tablo test edilen iş kuralını değiştirmez; yalnız örneklerin raporlanmasını ve bakımını düzenler. Bir satır yanlış beklenen değer taşıyorsa hatalı uygulamayı değil testi kırar. Bu nedenle tabloyu yazdıktan sonra her girdinin beklenen çıktısını tekrar hesapla.

## Tipler ve örnek kapsamı

Tuple tabloları TypeScript’te basit örnekler için yeterlidir. Parametreler farklı tiplerdeyse type inference beklediğinden daha geniş union üretebilir. Tabloyu as const ile sabitlemek veya satır tipini açıkça yazmak gerekebilir; ama sırf tablo olsun diye tipi zorlamaya çalışma. Temiz ve okunur test, sihirli tip hilesinden değerlidir.

Örnekleri seçerken eşdeğer bölümleri düşün. Tarih biçimleyicide boş, geçerli ve beklenmeyen biçimli değerler farklı davranış sınıfları olabilir. Her tarihin ayrı satırı gerekli değildir; bir sınırdaki davranış ile normal davranışı ayırt edecek temsilci değer yeterlidir. Yalnız bir mutlu yol test etmek ise hata çeşidini kaçırabilir. Örnek kapsamı kurallardaki karar dallarını temsil etmelidir.

Tablo aynı davranışın girdiye göre sonucu olduğunda uygundur. Bir test API hata mesajını, diğeri storage yan etkisini kontrol ediyorsa bunları tek tabloya sıkıştırma. Her satır farklı türden işlem başlatırsa callback karmaşıklaşır ve tablo artık veriyi açıklamaz. Ayrı test adları daha dürüst sözleşme sunar.

Test başlığında girdi tipini doğru göster. %s string, %i tam sayı için okunur; karmaşık nesneyi başlığa yazmak çok uzun veya anlamsız olabilir. Böyle durumda kısa açıklayıcı label sütunu ekleyebilirsin. Hata raporunda satırın hangi iş durumuna ait olduğunu göstermek parametrik testin faydasını artırır.

Test tablosu seçiminin bir de bakım maliyeti vardır. Tabloya çok sayıda rastgele tarih eklemek kapsama hissi verir ama yeni bir kural sınamaz. Örneğin tüm girdiler dolu ve aynı biçimdeyse boş tarih mutantı açıkta kalır. Tabloyu karar noktalarından türet: boş değer, geçerli değer, sınır değeri ve gerekiyorsa hatalı biçim. Her sınıfın bir temsilcisi çoğu zaman yeterlidir. Karmaşık dönüşümde aynı örnekleri property tabanlı testle üretmek ayrı bir tekniktir; burada konu değildir.

:::mistake[Aynı kural olmayan testleri tek tabloda toplamak]
Belirti: Callback içinde çok sayıda koşul vardır ve test adı ne ölçtüğünü anlatmaz. → Neden: Farklı gereksinimler ortak veri biçimi var diye birleştirilmiştir. → Düzeltme: Her farklı davranış için ayrı test gövdesi yaz.
:::

:::mistake[Başlıkta girdiyi göstermemek]
Belirti: Tablo testi kalınca hangi satırın bozulduğu belirsizdir. → Neden: Bütün örnekler aynı genel başlığı kullanıyordur. → Düzeltme: Placeholder veya açıklayıcı label ile girdiyi raporla.
:::

:::mistake[Sadece mutlu yol eklemek]
Belirti: Eksik değer veya sıfır yanlış işlenirken tablo yeşildir. → Neden: Örnekler yalnızca normal aralığı temsil ediyordur. → Düzeltme: Ayrı iş kuralı üreten sınırları ekle.
:::

:::sector
Saf parse ve format fonksiyonlarında veri tabloları aynı kuralın sınırlarını kısa biçimde gösterir. Kod incelemesinde satırları gerçek eşdeğer sınıflarla karşılaştırmak, gereksiz örnek sayısını artırmadan eksik dalları bulmaya yardım eder.
:::

Tuple tablosunda sütun sırası callback parametreleriyle eşleşir. Girdi ile bekleneni yer değiştirirsen test ya tipiyle kalır ya da yanıltıcı değer karşılaştırır. Çok sütun varsa named object satırları daha okunur olabilir: label, input ve expected alanları anlamı adlandırır. Basit iki sütunlu tablo için tuple genellikle daha açıktır.

Parametrik testte başlık hata raporunun parçasıdır. Sadece “örnek geçmedi” bilgisiyle satırı bulmak için tabloyu tekrar açman gerekir. Yıl biçiminde tarih metnini başlıkta göstermek kısa ve anlaşılırdır. Karmaşık nesnede kısa bir label kullan; tüm nesneyi başlığa basmak gürültü çıkarır.

Tablonun son halini okuyunca her satırın aynı assertion’a ve aynı kurala gittiğini doğrula. Bir satırı çıkardığında hangi hata artık kaçabilir diye sor. Hiçbir davranış değişmiyorsa tekrar olabilir. Bir sınır mutantı yakalanmıyorsa örnek kapsamı eksiktir. Tablo uzunluğuyla değil, temsil ettiği kararlarla değerlendirilir.

Tablonun hata raporlaması Vitest’in başlık üretimine bağlıdır. Parametreleri başlıkta göstermek çok uzun hale gelirse, test satırı için kısa bir açıklama üret ve input değerini callback’e ayrı sütun olarak aktar. Böylece ürün diliyle yazılmış “boş tarih” gibi durumlar, ham boş stringden daha anlaşılır görünür. Başlıklar teknik değerle açıklayıcı etiketi birlikte taşıyabilir.

Birden fazla input alanı varsa her satırın tamamı aynı kalıbı kullanmalı. Örneğin tarih ve locale birlikte yıl etiketi oluşturuyorsa tuple üç sütun taşıyabilir: tarih, locale, beklenen. Callback’te parametre sırasını açık tut. Bir alanın opsiyonel olması nedeniyle test gövdesi dallanıyorsa farklı kurallar olabilir; bu durumda tek tabloyu zorlamak yerine testleri ayır.

it.each’i “daha kısa yazım” diye seçme. Faydası, aynı mantığı farklı veri satırlarında tekrar çalıştırıp her sonucu ayrı raporlamasıdır. Eğer örnekler tek kuralı paylaşmıyor veya her testin hazırlığı farklıysa açık test gövdeleri daha okunur olabilir.

## Özet

- it.each aynı test mantığını farklı veri örnekleriyle ayrı sonuçlar olarak çalıştırır.
- Her satır aynı kuralı ve assertion türünü paylaşmalıdır.
- Başlıkta girdi veya label göster ki başarısız satır tanınsın.
- Sıfır, boş ve normal değerler ayrı karar dallarını açığa çıkarabilir.
- Farklı gereksinimleri ayrı testlerde tut.

**Kendini yokla:** it.each neden ayrı test adlarını tamamen ortadan kaldırmaz? Farklı davranışlar aynı kurala ait olmayabilir.

**Kendini yokla:** Kapasite için neden 0 ayrıca sınanır? JavaScript’te 0 falsy olduğundan “değer yok” koşuluyla karıştırılabilir.
