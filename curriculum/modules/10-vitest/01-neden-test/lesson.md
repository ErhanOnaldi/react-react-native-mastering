---
title: "Testler hangi davranışı korur?"
minutes: 13
kind: concept
---

# Testler hangi davranışı korur?

Sinema aramasında `page=2` seçtiğini düşün. İstek yine ilk sayfanın filmlerini getirirse ekran açılır ve TypeScript hata vermez; kullanıcı yanlış listeyi görür. **Regresyon**, daha önce çalışan bir davranışın sonraki bir değişiklikle yeniden bozulmasıdır. Test, böyle bir değişiklikten sonra beklediğin davranışın hâlâ çalışıp çalışmadığını tekrar kontrol eder.

## Derleyici şekli, test davranışı denetler

TypeScript, `page` değerinin sayı olduğunu denetleyebilir. Bu sayının URL’ye doğru yazıldığını ya da ikinci sayfa seçilince doğru filmlerin istendiğini kendi başına bilemez. Bir **matcher**, testin gözlediği değerle beklenen sonucu karşılaştıran araçtır; hangi farkın önemli olduğunu açıkça yazmana yardım eder.

Önce URL’de sayfa numarasının bulunup bulunmadığına bakalım:

```ts check
const url = new URL('https://sinema.test/search?page=3')
const hasPage = url.searchParams.has('page')
if (!hasPage) throw new Error('Sayfa parametresi eksik')
```

Parametre var, ama değeri yanlışlıkla `1` de olabilir. Bu kontrol yalnız “bir sayfa değeri yazılmış mı?” sorusunu cevaplar; “üçüncü sayfa mı istenmiş?” sorusunu cevaplamaz. Beklentinin sınırını, korumak istediğin davranış belirler.

Şimdi değerin kendisini kontrol edelim:

```ts check
const url = new URL('https://sinema.test/search?page=3')
const page = url.searchParams.get('page')
if (page !== '3') throw new Error('Üçüncü sayfa istenmeliydi')
```

Bu kontrol yanlış sayfa değerini yakalar. Yine de bir URL’nin doğru olması, ekrandaki listenin doğru olduğunu tek başına kanıtlamaz: istek doğru hazırlanıp cevap ekrana yanlış bağlanmış olabilir. O yüzden test edeceğin yeri, doğrulamak istediğin davranışa göre seçersin.

## Bir davranış, farklı sınırlar

Test katmanı, kontrolün uygulamanın hangi büyüklükteki parçasında yapıldığını anlatır. **Birim testi** küçük bir fonksiyonu tek başına çalıştırır. **Entegrasyon testi** birlikte çalışan parçaları, örneğin seçim kontrolüyle film listesini, beraber dener. **Uçtan uca test** uygulamayı kullanıcıya yakın biçimde açıp aramadan sonuçların görünmesine kadar akışı yürütür.

Aynı film arama davranışını üç küçük adımda düşünelim. İlkinde yalnız sayfa URL’sini kuran fonksiyon vardır:

```ts check
function pageFromUrl(input: string): string | null {
  return new URL(input).searchParams.get('page')
}

const page = pageFromUrl('https://sinema.test/search?page=3')
if (page !== '3') throw new Error('Sayfa 3 okunmalıydı')
```

Burada fonksiyonun girdisi ve çıktısı belli; ağ veya arayüz yok. Bu nedenle birim testi hızlıca “URL’den doğru sayfayı okuyor mu?” sorusuna cevap verir. Hata çıkarsa bakılacak yer de dardır.

Bir sonraki adımda seçim kontrolü ve film listesi birlikte çalışsın. Seçim `3` olduğunda görünen listede üçüncü sayfanın filmleri olmalı. Birlikte çalışan iki parçayı denediğimiz için bu, entegrasyon örneğidir. İlk testte her parçanın tek başına doğru olduğunu bilmek, aralarındaki bağlantının da doğru kurulduğunu garanti etmez.

Son adımda Sinema’yı tarayıcıda açıp arama kutusuna film adı yazar, üçüncü sayfaya geçer ve film kartlarını görürsün. Bu akış route, tarayıcı ve ekranı birlikte kapsar; uçtan uca testin gücü daha gerçek kullanıcı yolunu denemesidir. Buna karşılık kurulum daha ağırdır ve başarısız olduğunda hatanın hangi parçadan geldiğini bulmak daha uzun sürebilir.

| Soru | Uygun katman | Neden? |
| --- | --- | --- |
| URL’den `page` değeri doğru okunuyor mu? | Birim | Tek küçük fonksiyon yeterli |
| Seçim değişince doğru film kartları kalıyor mu? | Entegrasyon | Seçim ve liste birlikte çalışıyor |
| Kullanıcı arayıp üçüncü sayfaya geçince sonuçları görüyor mu? | Uçtan uca | Tarayıcıdaki tam akış önemli |

Bu tablo “her özelliğe üç test yaz” demiyor. En küçük anlamlı sınır, hızlı geri bildirim verir; parçaların birlikte davranışı önemliyse daha geniş sınırı da denersin. Tüm ayrıntıları yalnız tarayıcı testinde sınamak yavaştır; sadece küçük fonksiyonları sınamak ise kablo bağlantısındaki bir hatayı kaçırabilir.

![Test katmanları: küçük birimden tüm kullanıcı akışına](diagram:test-katmanlari)

Test katmanları kalite sıralaması değildir. Birim testi daha küçük olduğu için önemsiz olmaz; kullanıcı akışının doğru görünmesi de tek bir fonksiyonun her girdide doğru olduğunu kanıtlamaz. Aynı davranışın farklı sorularını cevaplarlar. “URL sayfayı okuyor mu?” ile “seçim değişince doğru kartlar görünüyor mu?” aynı kontrol değildir ve her biri kendine uygun küçük bir beklenti ister.

## Aynı uzunluk, farklı sonuç

Filtre fonksiyonunun `Dram` ve `Komedi` filmlerinden yalnız seçili türü bırakması gerektiğini düşün. Sadece kaç film kaldığına bakan beklenti şöyle olabilir:

```ts check
type Film = { title: string; genres: string[] }
function filterByGenre(items: Film[], genre: string): Film[] {
  return items.filter((film) => film.genres.includes('Dram'))
}

const films: Film[] = [
  { title: 'Kıyı', genres: ['Dram'] },
  { title: 'Kahkaha', genres: ['Komedi'] },
]
const result = filterByGenre(films, 'Komedi')
if (result.length !== 1) throw new Error('Bir film kalmalıydı')
```

Kırık fonksiyon Dram’ı aradığı halde bir film döndürüyor; uzunluk beklentisi yeşil kalıyor. Belirti “test geçti ama yanlış film gösterildi” olur. Çünkü beklenti, seçilen türün doğru olmasını değil yalnız tek kayıt kalmasını söylüyor.

Beklentiyi gözlenen davranışa yaklaştıralım:

```ts check
type Film = { title: string; genres: string[] }
function filterByGenre(items: Film[], genre: string): Film[] {
  return items.filter((film) => film.genres.includes(genre))
}

const films: Film[] = [
  { title: 'Kıyı', genres: ['Dram'] },
  { title: 'Kahkaha', genres: ['Komedi'] },
]
const result = filterByGenre(films, 'Komedi')
if (result[0]?.title !== 'Kahkaha') throw new Error('Komedi filmi kalmalıydı')
```

Bu kez yanlış tür koşulu testte doğru filmi bırakamaz ve test kırmızı olur. Test, fonksiyonun nasıl yazıldığını değil çağıranın göreceği sonucu sabitler; uygulamayı içeride yeniden düzenleyebilirsin, davranış bozulursa test haber verir.

İkinci sayfa örneğinde de aynı hata biçimi vardır: “istek başladı” demek yeterli değildir, istenen sayfanın taşındığını bilmen gerekir. Beklenti, bilinen yanlış sonucu kabul etmeyecek kadar belirgin olmalı; ilgisiz iç ayrıntıları ise sabitlememelidir.

:::mistake[Sadece kayıt sayısını kontrol etmek]
**Belirti:** Test yeşil ama Dram filtresinde Komedi filmi görünüyor. → **Neden:** Aynı sayıda yanlış film kalmış olabilir. → **Düzeltme:** Filmin türünü veya beklenen kartı da doğrula.
:::

## Özet

- Derleyici tipleri kontrol eder; test çalıştırılan davranışı ve gözlenen sonucu kontrol eder.
- Regresyon, daha önce çalışan davranışın değişiklikten sonra bozulmasıdır; test bunu tekrar fark ettirir.
- Birim testi küçük parçayı, entegrasyon testi parçaların işbirliğini, uçtan uca test kullanıcı akışını sınar.
- Testin kapsamını, cevabını aradığın davranışa göre seç; yalnız kolay ölçüleni değil.

**Yeni terimler**

- **Regresyon:** Değişiklik sonrası yeniden ortaya çıkan davranış hatası.
- **Matcher:** Gerçek gözlemi beklenen sonuçla karşılaştıran test aracı.
- **Birim testi:** Tek küçük davranışı tek başına sınayan test.
- **Entegrasyon testi:** Birlikte çalışan parçaları beraber sınayan test.
- **Uçtan uca test:** Kullanıcının uygulamada izlediği tam akışı sınayan test.

**Kendini yokla:** Derleme hatasızken URL neden yanlış sayfayı isteyebilir? TypeScript tipleri denetler; istenen sayfa numarasının URL’ye yazıldığını denetlemez.

**Kendini yokla:** Sayfa seçimi doğru olsa bile doğru filmler görünmüyorsa neyi ek olarak sınarsın? Seçimle film listesinin birlikte çalışmasını entegrasyon sınırında sınarım.
