---
title: "Platformu tanı"
minutes: 14
kind: concept
---

# Platformu tanı

:::pain[Problem]
Geleneksel eğitimlerde yüzlerce satır kod kopyalayıp tarayıcıda bir şeyler görmeye çalışırsın; ancak bir harf yanlış olduğunda neden çalışmadığını anlayamazsın. Hatanın nerede olduğunu söyleyen bir geri bildirim sistemi olmadığında saatlerce boş ekrana bakıp pes edersin.
:::

## Nasıl bir öğrenme ortamındasın?

Bu platformda React'i bir video izleyerek veya slayt okuyarak değil; modern yazılım şirketlerinde çalışan mühendislerin her gün kullandığı **endüstriyel araç zinciriyle** öğreneceksin. Burada teorik anlatımlar soyut kalmaz; her kavram gerçek bir acıdan doğar, ardından kod editöründe somut bir çözüme dönüşür.

Öğrenme sürecimiz katı bir pedagojik döngüyü takip eder:

1. **Önce acıyı ve yetersizliği gör:** Bildiğin saf yöntemle bir problem çözmeye çalışırsın; yöntemin nerede tıkandığını, isteklerin nasıl kontrolden çıktığını veya tip hatalarının projeyi nasıl durdurduğunu kendi gözünle gözlemlersin.
2. **Aracı ihtiyaç anında öğren:** Sorunun tam tıkandığı noktada o problemi çözmek için tasarlanmış endüstri standardı araç (TypeScript, Vite, TanStack Query vb.) sahneye çıkar.
3. **Çalıştırılabilir geri bildirim al:** Yazdığın kod soyut bir jüri tarafından değil; milisaniyeler içinde koşan gerçek Vitest birim testleri ve TypeScript derleyicisi (`tsc`) tarafından otomatik olarak denetlenir.

Platformdaki çalışma ve doğrulama akışı üç ana istasyondan geçer:

![Platformun çalışma ve geri bildirim döngüsü](diagrams/platform-akisi.svg "Editör, doğrulama hattı ve sonuç raporlama döngüsü")

Bu modeli şu kesin kurallarla zihninde canlandır:

1. **1 · Kod Düzenleme Alanı:** Kodunu platformun dahili Monaco editöründe ya da yerel bilgisayarındaki VS Code editöründe yazarsın. Her iki editör de arka plandaki `workspace/` klasörü üzerinden anlık olarak senkronizedir.
2. **2 · Doğrulama Motoru:** `⌘ + Enter` (veya `Ctrl + Enter`) tuşlarına bastığında platform arka planda iki bağımsız süreç başlatır: TypeScript derleyicisi kodun tiplerini inceler; Vitest motoru ise test dosyasındaki şartları adım adım koşturur.
3. **3 · Şeffaf Geri Bildirim:** Kodun başarılıysa ekran yeşile döner; bir şart karşılanmadıysa beklenen (`Expected`) ve üretilen (`Received`) değerler arasındaki fark satır satır raporlanır.

:::model[Geri bildirim döngüsü]
Platform bir LeetCode hakemi gibi çalışır; ancak algoritma bulmacaları yerine modern React ve TypeScript mimarisini denetler. Testlerin başarısız olması bir ceza değil; şartnamenin hangi maddesinin henüz tamamlanmadığını gösteren bir yol haritasıdır.
:::

## Üç farklı görev türü

Platformda ilerlerken karşına üç farklı öğrenme aracı çıkacaktır:

| Görev Türü | Çalışma Ortamı | Amacı ve İşleyişi |
| --- | --- | --- |
| **Quiz** | Platform arayüzü | Zihinsel modelleri, tarayıcı davranışlarını ve mimari kararları pekiştirir. Her şıkkın altında neden doğru veya yanlış olduğunu anlatan kapsamlı açıklamalar yer alır. |
| **Kod (Code)** | Platform içi editör | Saf yardımcı fonksiyonları, custom hook'ları ve React bileşenlerini yazar veya hata ayıklarsın. Canlı önizleme ve testler anında çalışır. |
| **Proje (Project)** | Yerel VS Code | Gerçek dünyadaki **Sinema** projesini geliştirirsin. Terminalden `pnpm dev` ile ayağa kaldırır, gerçek dosya ağacında çalışır ve testleri platformdan doğrulatırsın. |

## Kodun çalıştırılma adımlarını izleyelim

"Çalıştır" butonuna bastığında arka planda gerçekleşen olaylar zincirini şu zaman tablosuyla izleyebilirsin:

| Aşama | Gerçekleşen İşlem | Olası Çıktı / Durum |
| --- | --- | --- |
| 1. Kaydetme | Editördeki kod `workspace/` dizinindeki ilgili dosyaya yazılır. | Dosya diske kaydedildi. |
| 2. Tip Kontrolü | `tsc` derleyicisi çalıştırılır; değişken ve fonksiyon tipleri kontrol edilir. | `error TS2322` varsa işlem durur; yoksa sonraki adıma geçer. |
| 3. Test Yürütme | Vitest, test dosyasını izole bir Node.js sürecinde koşturur. | Fonksiyonlar farklı girdilerle test edilir. |
| 4. Karşılaştırma | `expect(sonuc).toBe(beklenen)` satırları değerlendirilir. | Fark varsa `AssertionError` fırlatılır. |
| 5. Raporlama | Sonuç paneli güncellenir; başarı durumu veya hata farkı ekrana basılır. | Yeşil onay veya kırmızı hata kartı görünür. |

## Kırık örnek

Bir film portalında izlenme sayılarına göre rozet metni üreten `formatPopularityBadge` fonksiyonunu düşünelim. Kuralımız basittir: İzlenme sayısı 1.000 ve üzeriyse `"Popüler"`, 0 veya negatifse `"Veri yok"`, diğer durumlarda ise `"Standart"` dönmelidir.

Aşağıdaki ilk deneme sınır durumunu kaçırmıştır:

```ts
export function formatPopularityBadge(views: number): string {
  // Kırık: 0 ve negatif durumları kontrol edilmemiş
  if (views >= 1000) {
    return 'Popüler'
  }
  return 'Standart'
}
```

Bu fonksiyon için hazırlanan testler çalıştırıldığında sonuç paneli kırmızıya döner:

```text
FAIL formatPopularityBadge.test.ts > 0 izlenmede "Veri yok" döner
AssertionError: expected 'Standart' to be 'Veri yok'
- Expected: "Veri yok"
+ Received: "Standart"
```

Hata raporu sana ne yapman gerektiğini doğrudan söyler: `0` değeri geldiğinde kodun `"Standart"` döndürmüş, oysa şartname `"Veri yok"` beklemektedir.

## Doğru örnek

Test çıktısındaki ipucunu kullanarak kodumuza erken dönüş kontrolünü ekliyoruz:

```ts check
export function formatPopularityBadge(views: number): string {
  if (views <= 0) {
    return 'Veri yok'
  }
  if (views >= 1000) {
    return 'Popüler'
  }
  return 'Standart'
}
```

Şimdi "Çalıştır" butonuna bastığımızda tüm kontroller yeşile döner:

```text
✓ formatPopularityBadge.test.ts (3 tests) 3ms
  ✓ 1000 ve üzeri izlenmede Popüler döner
  ✓ 0 ve negatif izlenmede Veri yok döner
  ✓ aradaki değerlerde Standart döner
```

## İpuçları, çözümler ve dürüstlük ilkesi

Bir görevde tıkandığında sağ üst köşedeki **İpuçları** butonunu kullanabilirsin. İpuçları kademelidir:
- **1. Kademe:** Nereye odaklanman gerektiğini ve doğru soruyu gösterir.
- **2. Kademe:** Kullanılacak yöntem, kütüphane fonksiyonu veya algoritmayı söyler.
- **3. Kademe:** İskelet kod parçasını ya da çözüme çok yakın bir örneği sunar.

Görevi başarıyla geçtiğinde **Çözüm** sekmesi açılır. Burada kıdemli bir mühendisin gözünden "Neden böyle çözdük?", "Hangi alternatifler vardı?" ve "Sektörde hangi tuzaklara dikkat edilir?" notları yer alır. Görevi geçmeden önce de çözüme bakabilirsin; ancak bu durum ilerleme raporunda kaydedilir. Öğrenme yolculuğunda kendine karşı dürüst olmak en hızlı gelişim yoludur.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: Test dosyasını okumadan kod yazmaya başlamak]
Belirti → Kod yazıldı, çalıştırıldı ama 3 test patladı; gereksinimlerin ne olduğu tahmin edilmeye çalışılıyor.  
Neden → Görev metni genel amacı anlatır; sınır durumlarının (boş dizi, null, sıfır vb.) tam listesi test dosyasındadır.  
Düzeltme → Kod yazmaya başlamadan önce mor renkli test sekmesini aç ve `it(...)` başlıklarını baştan sona oku.
:::

:::mistake[Sık hata: Tip hatasını test hatası sanıp mantığı değiştirmek]
Belirti → Testlerin geçtiğini düşünürken ekranda `error TSxxxx` yazıyor ve sonuç yeşile dönmüyor.  
Neden → TypeScript kuralları çiğnenmiştir (örneğin değişkene yanlış tip atanmış).  
Düzeltme → Fonksiyonun dönüş tipini ve parametre tiplerini kontrol et; test mantığını kurcalamadan önce tip uyarısını gider.
:::

:::sector
Sektördeki modern yazılım ekiplerinde hiçbir kod testleri geçmeden ve tip denetiminden onay almadan ana depoya (main branch) birleştirilmez. Bu süreç Sürekli Entegrasyon (CI) sunucularında otomatik olarak çalışır. Burada edineceğin "önce testi oku, sonra kodu yaz, tip hatasını asla görmezden gelme" refleksi, profesyonel bir ekibe katıldığın ilk gün seni öne çıkaracaktır.
:::

## Özet

- Platform, gerçek Vitest testleri ve TypeScript derleyicisi ile çalışan anlık bir geri bildirim motoruna sahiptir.
- Quiz kavramları sorgular, Kod platform içinde çözüm üretir, Proje ise yerel VS Code ortamında Sinema uygulamasını inşa eder.
- Test dosyaları en kesin şartnamedir; bir görevin sınır durumlarını en net şekilde test dosyası anlatır.
- Tip denetimi (`tsc`) ile test koşumu (Vitest) iki bağımsız adımdır; bir görevin tamamlanması için her ikisi de hatasız olmalıdır.

**Kendini yokla:** Bir kod görevinde fonksiyonun beklenmedik bir girdi aldığında (örneğin boş string) ne döndürmesi gerektiğini nereden öğrenirsin?  
*Cevap:* Mor sekmedeki test dosyasını açıp ilgili sınır durumu için yazılmış `it(...)` başlığını ve `expect` beklentisini okuyarak öğrenirsin.

**Kendini yokla:** Vitest testlerinin tamamı geçtiği halde bir görev neden onaylanmaz?  
*Cevap:* Kodda TypeScript tip denetimi hatası (`tsc` derleyici hatası) bulunuyorsa görev tamamlanmış sayılmaz.
