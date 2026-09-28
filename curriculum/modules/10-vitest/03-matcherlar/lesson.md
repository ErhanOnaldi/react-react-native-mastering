---
title: "Beklentinin kapsamını seç"
minutes: 16
kind: concept
---

# Beklentinin kapsamını seç

:::pain[Sinema’da ne oldu?]
Konser bileti özetinde etkinlik adı doğru ama kalan koltuk sayısı yanlış. Test yalnızca `toBe` ile nesnenin aynı referans olmasını beklediği için çağıranın gerçek sözleşmesini ölçemiyor.
:::

## Matcher seçmek, gereksinimi seçmektir

Önceki derste string biçimlemesini tam eşitlikle doğruladın. Nesnelerde ise “aynı değer”, “şu alanları içeriyor” ve “bu fonksiyon hata veriyor” farklı beklentilerdir. Vitest matcher’ı, kodun hangi özelliğinin çağıran için önemli olduğunu açıklar. Yanlış seçim iki yönde sorun çıkarır: test ya geçerli değişiklikte kırılır ya da istenmeyen sonucu kabul eder.

AAA akışı sabit kalır; burada Assert adımını daha dikkatli kuracağız. Bir assertion yazmadan önce “hangi fark olursa kullanıcı veya çağıran bunu hisseder?” diye sor. Yalnızca o farkı bağla. Ek alanların önemsiz olduğu bir API cevabını bire bir nesneye kilitleme; kalan koltuk sayısı kritikse de sadece nesnenin varlığını kontrol etme.

## Karşılaştırma kuralları

1. `toBe`, primitive değerler ve referans kimliği içindir. String veya sayı çıktısında tam eşitliği bekle.
2. `toEqual`, iç içe nesne ve dizilerin değerlerini ve yapısını tam karşılaştırır.
3. `toMatchObject`, bir nesnenin belirli alanlarını doğrular; fazladan alanlara izin verir.
4. `expect.objectContaining` ile dizi içindeki öğelerin bir kısmını seçebilirsin; sıra sözleşmenin parçası değilse kullan.
5. `toThrow`, hatayı üreten fonksiyon çağrısını callback olarak alır. Çağrıyı assertion’dan önce çalıştırma.
6. Matcher’ı gereğinden fazla gevşetme. Boş alt küme veya yalnız “en az bir öğe” kontrolü kritik hataları kaçırabilir.

![Tam eşitlik, kısmi alan eşitliği ve hata beklentisini seçme](diagrams/matcher-secimi.svg)

## Sonucu adım adım izleyelim

`{ eventName: "Yaz Akşamı", remainingSeats: 12, venue: "Küçük Salon" }` dönen bir özet düşün. Test yalnız etkinlik adını kontrol ediyorsa akış şöyledir:

| Sıra | Değer | Karar |
| --- | --- | --- |
| 1 | `eventName = "Yaz Akşamı"` | Doğru etkinlik seçilmiş |
| 2 | `capacity = 40` | Salonun toplam kapasitesi |
| 3 | `remainingSeats = 2` | Kalan bilet hesabı yanlış |
| 4 | `toMatchObject({ eventName: "Yaz Akşamı" })` | Test yine geçer |

Beklentiye `remainingSeats: 12` eklemek bu hatayı yakalar. Salon adı gibi ilgisiz alanlar implementation detayı değilse bile bu davranışın sözleşmesinde bulunmayabilir. API’nin ileride `metadata` eklemesi testi kırmamalı; tüm cevabı `toEqual` ile sabitlemek gereksiz kırılganlık yaratabilir.

```ts
const summary = { eventName: 'Yaz Akşamı', remainingSeats: 12, venue: 'Küçük Salon' }
expect(summary).toMatchObject({ eventName: 'Yaz Akşamı', remainingSeats: 12 })
```

Bu test fazladan alana izin verir ama zorunlu iki alanı korur. `toMatchObject({})` yazarsan hiçbir şeyi zorunlu tutmamış olursun. Seçici eşitlik, eksik beklenti anlamına gelmez.

## Kırık, sonra doğru assertion

Referans eşitliğiyle nesne içeriğini karşılaştırmak yanlıştır:

```ts check
const actual = { eventName: 'Yaz Akşamı' }
const expected = { eventName: 'Yaz Akşamı' }
if (actual !== expected) throw new Error('Eşit olmalıydı')
```

İki nesne aynı anahtar ve değere sahip, ama bellekte ayrı referanslardır; `!==` true olur. Değerleri karşılaştıran doğru biçim:

```ts check
const actual = { eventName: 'Yaz Akşamı' }
const expected = { eventName: 'Yaz Akşamı' }
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  throw new Error('Nesne değerleri eşleşmedi')
}
```

Test kodunda bunu `toEqual` ile ifade edersin. Ek alan serbestse daha küçük bir alt küme kullan:

```ts
expect(actual).toMatchObject({ eventName: 'Yaz Akşamı' })
```

Hata beklentisinde fonksiyonu hemen çağırmak da kontrolü assertion’dan önce taşır. `ensureRange(0)` satırı hatayı fırlatır ve sonraki satıra ulaşılmaz. Doğru kullanım çağrıyı callback içine alır:

```ts
expect(() => ensureRange(0)).toThrow(RangeError)
```

## Dizi ve hata sınırları

Sıralı listenin kendisi davranışsa tam dizi karşılaştırması kullan. Örneğin alfabetik sıralamada `["A", "B"]` ile `["B", "A"]` farklı sonuçtur. Sıralama garanti edilmiyorsa ve yalnızca belirli bir filmi arıyorsan `expect.arrayContaining([expect.objectContaining({ id: 42 })])` uygundur. Fakat yalnız varlık kontrolü listenin uzunluğunu veya tekrarları doğrulamaz; bunlar da sözleşmeyse ayrıca ölç.

Hata matcher’ları da kesinlik taşır. `toThrow()` herhangi bir hata için yeterli olabilir, ama hata sınıfı veya mesajı API sözleşmesiyse `toThrow(RangeError)` ya da `toThrow('Sayfa geçersiz')` kullan. Hatanın tüm stack trace’ini karşılaştırma; stack yolu ortama göre değişebilir ve çağıranın sözleşmesi değildir.

Matcher seçerken testin kapsamı ve test edilen değer birlikte düşünülür. String çıktısında `toBe`, nested response’un tamamında `toEqual`, esnek response alanlarında `toMatchObject`, hata dalında `toThrow` tercih edilebilir. Bir matcher diğerinden her durumda üstün değildir. Gözlenebilir gereksinim hangi farkı anlamlı kılıyorsa seçim ona bağlıdır.

## Kırmızı sonucun anlamını daralt

Assertion başarısız olduğunda hangi alanın farklı olduğu açıkça görünmelidir. Bir response’u tek bir büyük snapshot gibi karşılaştırmak hızlı görünebilir, fakat değişen tüm alanları bir hata duvarına dönüştürür. Birden çok kritik alanı aynı matcher’da toplamak yine okunur olabilir; her alan farklı bir gereksinimi temsil ediyorsa ayrı assertion hata mesajını daraltabilir. Örneğin etkinlik adı ve kalan koltuk ayrı kaynaktan hesaplanıyorsa ikisini ayrı kontrol etmek hangi bilginin bozulduğunu gösterir.

Sayısal değerlerde kesinlik de gereksinime bağlıdır. Tam para kuruşu hesaplanıyorsa toleranslı karşılaştırma kullanmak hatayı gizleyebilir. Ölçüm sonucu ondalık kayan nokta hesabından geliyorsa küçük yuvarlama farkı beklenebilir. “Sayı olduğu sürece geçsin” ile “matematiksel olarak belirli toleransta aynı” farklı sözleşmelerdir. Matcher’ı düşünmeden önce kabul edilen farkı tarif et.

:::mistake[İki nesneyi `toBe` ile kıyaslamak]
**Belirti:** Aynı alanları taşıyan iki nesne eşit görünse de test kalır. → **Neden:** `toBe` nesnenin değerini değil referansını karşılaştırır. → **Düzeltme:** Tam yapı için `toEqual`, gerekli alanlar için `toMatchObject` seç.
:::

:::mistake[Boş veya aşırı gevşek beklenti]
**Belirti:** Kalan koltuk sayısı yanlışken test yeşil kalır. → **Neden:** Assertion yalnız etkinlik adına veya nesnenin varlığına bakıyordur. → **Düzeltme:** Hata hikâyesini ayırt edecek her alanı açıkça bekle.
:::

:::mistake[Hata fırlatılmadan matcher’a ulaşmak]
**Belirti:** Test hata verir ama assertion sonucu raporlanmaz. → **Neden:** Hatalı çağrı callback yerine doğrudan çalıştırılmıştır. → **Düzeltme:** Hata beklenen çağrıyı `() => fn()` biçiminde ver.
:::

:::sector
API ve UI ekipleri response’un tüketilen alanlarını açıkça test edip ilgisiz alanlara tolerans tanır. Böylece sunucu cevabı genişlerken testler gereksiz yere kırılmaz, kritik alan da eksik kalmaz.
:::

String eşitliğinde boşluk, büyük-küçük harf ve Unicode normalizasyonu görünür çıktının parçası olabilir. Test, ürünün bunları aynen korumasını mı yoksa normalize etmesini mi beklediğini göstermelidir. Karşılaştırmadan önce değeri dönüştürmek kolay görünür; fakat bu adım kullanıcıda oluşacak farkı gizleyebilir.

Koleksiyonlarda matcher seçimi sıra ve tekrar kurallarına dayanır. ArrayContaining belli öğelerin varlığını arar, fakat fazladan kayıtları, sıralamayı ve yinelenen öğeleri reddetmez. Tam sıralı liste için toEqual, tekil üyelik için objectContaining ve gerekirse ayrıca uzunluk kontrolü kullan. Beklenti ne kadar toleranslı olursa hangi hataları kabul ettiğini o kadar bilinçli seçmelisin.

Hata testlerinde yalnız tip veya yalnız mesajı kontrol etmek her zaman yeterli değildir. API katmanı HTTP status’u ve uzak servisin hata kodunu ayrı taşıyorsa ikisi de çağıranın kararını etkileyebilir. Değişken zaman damgası gibi sözleşme dışı alanlar ise tam nesne eşitliğini kırılgan kılar. Beklentiyi hata tüketen kodun kullandığı bilgilerle sınırla.

Üç kısa soru matcher kararını hızlandırır: Değer primitive mi, nesne mi, hata mı? Ek alan veya farklı sıra kabul ediliyor mu? Bilinen hatada hangi alan değişecek? Gereksinimi test adında yazıp kabul edilebilir farkı tarif etmek matcher’ın gevşekliğini görünür kılar.

## Özet

- `toBe` primitive ve referans, `toEqual` tam değer yapısı içindir.
- `toMatchObject` seçilen alanları zorunlu tutar, ek alanlara izin verir.
- Sıra veya öğe üyeliğini yalnız gerçek sözleşme gerektiriyorsa esnet.
- `toThrow` için hata üreten çağrıyı callback olarak ver.
- Her assertion gerçek hatayı yakalayacak kadar kesin olmalıdır.

**Kendini yokla:** Response’a yeni alan eklenince testi kırmamak, kalan koltuk sayısı kontrolünden vazgeçmeyi gerektirir mi? Hayır; `toMatchObject` içine etkinlik adıyla birlikte kalan koltuğu da yaz.

**Kendini yokla:** `["B", "A"]` ile `["A", "B"]` farkı önemliyse hangisi uygundur? Sıralı diziyi `toEqual` ile tam karşılaştır.

