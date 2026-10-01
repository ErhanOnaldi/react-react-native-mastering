---
title: "Tipleri bir arada kullan"
minutes: 7
kind: practice
---

# Tipleri bir arada kullan

Bu pekiştirmede Sinema'daki endpoint cevaplarını eşleştirecek, uzak verinin durum geçişlerini kuracak ve dışarıdan gelen mekan verisi için test yazacaksın. Her işte önce değerin şeklini düşün, sonra TypeScript'in hangi bilgiyi korumasını istediğini belirle.

:::model[Generics, `keyof` ve indeksli erişim]
Bir tip haritasındaki anahtarı seçtiğinde, generic tip bu seçimi taşır; indeksli erişim de o anahtarın değer tipini verir. Böylece yanlış endpoint cevabını yanlışlıkla eşleştirmek zorlaşır.
:::

:::model[Kontrol akışı union'ı daraltır]
Discriminated union, ortak bir `status` ya da `type` alanıyla farklı durumları ayırır. Kontrol ettikten sonra TypeScript yalnızca o dala ait alanlara izin verir; exhaustive kontrol de her dalın ele alındığını görünür kılar.
:::

## Her işi küçük adımlara böl

Endpoint cevabında önce izin verilen yolları ve her yolun cevap biçimini çıkar. Reducer'da, yani mevcut durum ve eylemden yeni durum üreten saf fonksiyonda, her eylem için hangi alanların anlamlı olduğunu düşün. Test yazarken de dışarıdan gelen değerin geçerli ve geçersiz örneklerini ayır.

Üçüncü alıştırmada bir **mutant**, testlerin yakalaması gereken davranış hatasını içeren değiştirilmiş bir implementasyondur. Her testi yazdıktan sonra şu soruyu sor: Bu test hangi yanlış davranışı başarısız kılar? Böylece yalnızca doğru örneği değil, sınırdaki yanlış değerleri de sınarsın.

:::tip[Çalışma sırası]
Önce beklenen girdi ve çıktıyı kendi sözlerinle yaz. Ardından tipleri veya test durumlarını kur, en son her dalın ne döndürdüğünü kontrol et. Bir dalı atladığında, `never` kontrolü eksik durumu derleme hatası olarak gösterebilir.
:::

## Özet

- Generic anahtar, seçilen endpoint ile cevap tipini birbirine bağlar.
- Durum geçişinde her eylem yeni ve tutarlı bir durum üretir.
- Testler geçerli değerlerle birlikte hatalı sınır değerlerini de kapsar.

**Yeni terim — mutant:** Testin yakalaması beklenen davranış hatası eklenmiş implementasyon.

**Kendini yokla:** Bir test mutant'ı yakalamazsa ne eksik olabilir?  
*Cevap:* Test edilen davranış için beklenen sonucu ortaya koyan bir durum yoktur ya da assertion bu farkı kontrol etmiyordur.
