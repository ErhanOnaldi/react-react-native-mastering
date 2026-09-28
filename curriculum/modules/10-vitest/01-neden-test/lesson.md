---
title: "Test katmanları ve davranış güvencesi"
minutes: 17
kind: concept
---

# Test katmanları ve davranış güvencesi

:::pain[Sinema’da ne oldu?]
Sinema’da tür filtresinde Dram seçili, ama Komedi etiketli film de listede kalıyor. Derleme yeşil ve ekran açılıyor; yanlış filtre ancak kullanıcı listeyi incelerken fark ediliyor.
:::

## Derleyicinin bilemediği davranış

TypeScript, tür etiketlerinin string olduğunu ve filtre fonksiyonunun beklenen tipte sonuç verdiğini denetler. Dram filtresinin Komedi filmini dışarıda bıraktığını bilemez. Derleme hatasız olsa bile yanlış koşul veya eksik karşılaştırma çalışmaya devam edebilir. Test, seçtiğin girdiyi gerçek koddan geçirip gözlenebilir sonucu önceden belirlediğin beklentiyle karşılaştırır.

Sen zaten 0. modülden beri test okuyup 1–6. modüllerde küçük testler yazdın. Burada başlangıç noktasına dönmüyoruz: aynı Arrange–Act–Assert akışını daha büyük bir sistemde nereye uygulayacağına karar veriyoruz. Yeni soru “test nasıl yazılır?” değil; “bu davranışı hangi sınırda doğrulamak en hızlı ve anlamlı olur?”

:::model[Test anatomisi]
Bir testi **hazırla → çalıştır → doğrula** diye oku. Hazırlık girdiyi ve gerekli ortamı kurar; çalıştırma gerçek davranışı çağırır; doğrulama dışarıdan görülen sonucu ölçer. Bu üç parça testin neyi kanıtladığını açık eder. Önceki modüllerde saf fonksiyonlara uyguladığın bu model, şimdi farklı büyüklükteki sınırları karşılaştırmana yardım eder.

![Test katmanları: küçük birimden tüm kullanıcı akışına](diagram:test-katmanlari)

## Üç katmanın karar kuralları

1. **Birim testi**, tek bir küçük davranışı dış ortamdan ayırarak denetler. Saf fonksiyon, reducer veya tarih biçimleyici buna uygundur. Başarısızsa olası neden azdır ve geri bildirim hızlıdır.
2. **Entegrasyon testi**, birlikte çalışması gereken birkaç parçayı gerçek halleriyle bağlar. Örneğin bir React bileşenini render edip kullanıcı etkileşiminin ekranda oluşturduğu sonucu gözlersin. Gerçek ağ gibi kontrol etmediğin dış sistemleri bu katmanda sınırlandırabilirsin.
3. **Uçtan uca test**, uygulamayı kullanıcıya en yakın ortamda açıp baştan sona bir akışı yürütür. Route, tarayıcı, ağ ve ekran birlikte çalışır. Daha çok gerçek davranışı kapsar; kurulum ve hata ayıklama maliyeti de daha yüksektir.

Bir katmanın “daha iyi” olması diğerlerini gereksiz yapmaz. Küçük fonksiyondaki her kombinasyonu tarayıcıyı açarak test etmek yavaştır. Öte yandan tüm bileşenleri izole birim testine ayırırsan kullanıcı eylemi ile ekrandaki sonucun bağını hiç ölçmeyebilirsin. Her katmanı, sorunun ortaya çıktığı sınıra yerleştir.

## Tür filtresini adım adım izleyelim

Kullanıcı Dram türünü seçtiğinde birbirinden ayrı birkaç karar vardır:

| Sıra | Çalışan parça | Bilinmesi gereken sonuç |
| --- | --- | --- |
| 1 | Kontrol değeri | seçili tür Dram olur |
| 2 | Karşılaştırma | her filmin tür listesi incelenir |
| 3 | Saf filtre | yalnız Dram içeren filmler kalır |
| 4 | Ekran | Komedi filmi listede görünmez |
| 5 | Birleşik akış | seçili tür ve görünen kartlar uyuşur |

Adım 3 saf bir fonksiyonsa birim testi tür listesini doğrudan verip kalan filmleri sınar. Adım 1–4 arasında seçici bileşen ve kartlar işbirliği yapıyorsa entegrasyon testi etkileşim ile görünen listeyi ölçer. Kullanıcı tercihini kaydedip sonra yeniden açma akışı önemliyse uçtan uca senaryo eklenebilir. Tek bir üst düzey test bütün girdi çeşitlerini hızlıca kapsayamaz; küçük testler de filtre kontrolünün gerçekten ekrana bağlandığını kanıtlamaz.

Bu ayrım hata bulmayı da kolaylaştırır. Birim testi Komedi türünü yanlışlıkla geçiriyorsa filtre kuralına bakarsın. Birim testi geçip entegrasyon testi kalırsa seçili değer karta doğru ulaşmıyor olabilir. Entegrasyon geçip tarayıcı akışı kalırsa tercih saklama veya ekranı yeniden kurma akışı sorun çıkarabilir. Katmanlar birer teşhis sınırı sağlar.

## Önce kırık, sonra doğru

Aşağıdaki saf fonksiyonda yanlış tür karşılaştırması testin gözünden kaçar; yalnızca kalan eleman sayısını kontrol etmek yeterli değildir:

```ts check
type Film = { title: string; genres: string[] }
function filterByGenre(items: Film[], genre: string): Film[] {
  return items.filter((film) => film.genres.includes('Dram'))
}

const movies: Film[] = [
  { title: 'Kıyı', genres: ['Dram'] },
  { title: 'Kahkaha', genres: ['Komedi'] },
]
const brokenResult = filterByGenre(movies, 'Komedi')
const expected = [{ title: 'Kahkaha', genres: ['Komedi'] }]
if (JSON.stringify(brokenResult) !== JSON.stringify(expected)) {
  throw new Error('Yalnız Komedi türündeki film bekleniyordu')
}
```

Kırık davranışta Komedi seçildiğinde de bir film kalır; sayı kontrolü yeşil kalır. Beklentiyi kullanıcının ihtiyacına göre keskinleştir:

```ts check
type Film = { title: string; genres: string[] }
function filterByGenre(items: Film[], genre: string): Film[] {
  return items.filter((film) => film.genres.includes(genre))
}

const movies: Film[] = [
  { title: 'Kıyı', genres: ['Dram'] },
  { title: 'Kahkaha', genres: ['Komedi'] },
]
const actual = filterByGenre(movies, 'Dram')
const expected = [{ title: 'Kıyı', genres: ['Dram'] }]
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  throw new Error(`Beklenen ${expected}, gelen ${actual}`)
}
```

İlk blokta test “bir film var” diyor ama gereksinim “seçili türdeki filmler var”. Doğru örnekte kalan filmin kimliği ve türü karşılaştırılır. Gerçek test dosyasında aynı fikir Vitest’in `expect(actual).toEqual(expected)` matcher’ıyla yazılır; ileride farklı veri şekillerine uygun matcher seçeceksin.

## Sınırları doğru seç

Bir testi seçerken şu sırayı izle: önce kullanıcının veya çağıranın gördüğü hatayı cümleye dök; sonra hataya en yakın, dış sistem içermeyen parçayı bul; son olarak parçalar arası bağlantının ayrıca doğrulanması gerekip gerekmediğine karar ver. “Komedi filmi Dram filtresinde görünüyor” gözlemdir. Saf tür karşılaştırmasını birim testinde, seçicinin bileşene bağlanmasını entegrasyon testinde, tercih saklanıp sayfanın yeniden açılmasını uçtan uca testte ölçebilirsin.

Testin sonucu uygulamanın özel değişken isimlerine bağlıysa refactor sırasında gereksiz yere kırılır. Fakat yalnız “filtre çağrıldı” beklentisi de yanlış tür karşılaştırmasını yakalamaz. Dışarıdan görülen davranış, hem çözüm biçimine alan bırakmalı hem de gerçek gereksinimi ayırt edecek kadar kesin olmalı.

:::mistake[Tip kontrolünü davranış testi sanmak]
**Belirti:** Derleme yeşil, ama Dram filtresinde Komedi filmi var. → **Neden:** Tipler metnin string olduğunu doğrular; karşılaştırma mantığını çalıştırmaz. → **Düzeltme:** Tür listesini gerçek fonksiyondan geçirip kalan filmleri karşılaştır.
:::

:::mistake[Her şeyi tek tarayıcı testine yüklemek]
**Belirti:** Basit bir hesaplama hatasını bulmak için bütün uygulama açılıyor ve hata mesajı çok genel kalıyor. → **Neden:** Küçük mantık ile route ve ekran bağlantısı aynı sınırda sınanıyor. → **Düzeltme:** Hızlı birim testiyle hesabı, entegrasyon veya uçtan uca testiyle gereken bağlantıyı ayrı doğrula.
:::

:::mistake[Sadece çağrı sayısını ölçmek]
**Belirti:** Filmler dönüyor ama seçili tür dışındakiler listede. → **Neden:** Test yalnız sonucun boş olmadığını ölçüyordur. → **Düzeltme:** Kalan filmlerin türlerini veya beklenen kartları denetle.
:::

Bir test katmanının hata bulma hızı, kurulum maliyeti ve temsil ettiği gerçeklik arasında seçim yaparsın. Örneğin tek tür karşılaştırmasını unit testte hızlıca tekrar etmek kolaydır. Gerçek seçim kontrolü, state ve film kartlarının birlikte çalıştığını görmek için entegrasyon testi gerekir. Kullanıcının sayfayı yenileyip aynı filtre tercihini bulması ise route ve kalıcı durumla birleşen başka bir akıştır. Küçük testlerin tümünü browser testine taşımak pahalıdır; yalnız birim testleri de kablolama hatasını gizleyebilir.
Ekipler genellikle saf iş kurallarını hızlı birim testinde, kritik kullanıcı akışlarını daha az sayıda uçtan uca testte tutar; aradaki component ve servis bağlantılarını entegrasyon testleriyle kapatır. Kod incelemesinde “hangi davranış bozulursa bu test kırılır?” sorusu, test adedinden daha anlamlı bir kalite ölçüsüdür.
:::

## Özet

- TypeScript şekli denetler; test, girdiden çıkan davranışı çalıştırır.
- Birim testi küçük kuralı, entegrasyon testi parçaların işbirliğini, uçtan uca test kullanıcı akışını kapsar.
- Hata görüldüğü sınıra yakın test, nedenini daha hızlı buldurur.
- Beklenti, yanlış filtre gibi gerçek hatayı ayırt edecek kadar kesin olmalıdır.

**Kendini yokla:** Filtre sonucunun uzunluğunu kontrol etmek neden yetersizdir? Çünkü yanlış türde aynı sayıda film kalabilir; beklenen filmleri de karşılaştırmalısın.

**Kendini yokla:** Tür seçiminin tarayıcıda yapılıp doğru kartları göstermesi hangi katmana uygundur? Component ve liste birlikteyse entegrasyon; tercih saklanıp yeniden açılması da kapsanacaksa uçtan uca test uygundur.
