---
title: "Web Vitals: LCP, INP ve CLS"
minutes: 16
kind: concept
---

# Web Vitals: LCP, INP ve CLS

Bir film detay sayfasını kendi hızlı bilgisayarında açtın: afiş çabuk geldi, filtreye tıklayınca sonuç hemen değişti. Başka bir cihazda afiş geç görünebilir, filtre tıklaması takılabilir ya da afiş gelince başlık aşağı kayabilir. Bunlar “site yavaş” demenin üç ayrı biçimi; önce hangisinin yaşandığını adlandıralım.

## Üç kullanıcı belirtisi, üç ölçüm

**Core Web Vitals**, sayfanın yüklenmesi, etkileşime tepkisi ve görsel kararlılığı hakkında tarayıcıda ölçülen üç temel göstergedir. Kısaca **LCP** en büyük ana içeriğin ne zaman göründüğünü, **INP** kullanıcının etkileşimine sayfanın ne kadar çabuk yanıt verdiğini, **CLS** beklenmeyen görsel kaymaların ne kadar olduğunu anlatır.

İlk örnek: afiş 3 saniye sonra görünüyorsa, asıl içerik geç geldiği için LCP yüksektir. İyi hedef 2,5 saniye veya daha azdır. Ölçüm, sayfa açılışından görünür alandaki en büyük metin ya da görselin çizilmesine kadar sürer.

İkinci örnek: filtre düğmesine bastın ve yeni kare 350 ms sonra geldi. Etkileşimden ekrandaki sonraki çizime kadar olan tepkiyi INP ölçer; 350 ms, iyi hedef olan 200 ms'nin üzerindedir. INP sayfa boyunca yapılan tıklama, dokunma ve klavye etkileşimlerini kapsar; yalnız ilk etkileşime bakmaz.

Üçüncü örnek: görsel yüklenirken başlık 120 piksel aşağı itildi. Beklenmeyen görsel hareketi CLS'e katkı verir. CLS puanı piksel sayısı değildir; yer değiştiren içeriğin alanını ve hareket miktarını temel alır. İyi hedef 0,1 veya daha azdır.

Bu metrikler birbirinin yerine geçmez. Yavaş afişi (LCP) hızlı filtre koduyla düzeltemezsin; başlığın kaymasını (CLS) ölçmek için tıklama gecikmesine bakmazsın. Önce belirtiyi metrikle eşleştir, sonra o belirtiye yol açan kaydı incele.

![Web Vitals: sayfa ömründe LCP, INP ve CLS](diagram:web-vitals)

## Sinema sayfasını sırayla izleyelim

| Zaman | Olay | Metrik ve yorum |
|---|---|---|
| 0 ms | Ziyaretçi film sayfasını açar | Sayfa yükleme başlangıcı |
| 350 ms | Sunucudan ilk yanıt baytları gelir | İstek ve sunucu süresi hakkında ipucu; tek başına Core Web Vital değildir |
| 800 ms | İlk metin görünür | FCP, yani ilk içerik boyaması; LCP'den önce gelebilir |
| 1.600 ms | Büyük başlık ve ana afiş görünür | LCP = 1,6 sn, iyi hedef içinde |
| 2.100 ms | Boyutu ayrılmamış reklam gelir, başlığı aşağı iter | Beklenmeyen kayma CLS'e eklenebilir |
| 3.200 ms | Ziyaretçi tür filtresine basar | INP etkileşimi başlar |
| 3.280 ms | Filtreli görünüm çizilir | Yaklaşık 80 ms tepki; iyi hedef içinde |

Bu örnekte LCP, sayfanın kullanılabilir olduğunu değil, en büyük ana içeriğin göründüğünü söyler. INP tıklamadan sonraki boyamaya kadar olan yanıtı ilgilendirir. Görsel kayma ise ayrı bir deneyim sorunudur. FCP, sayfadaki ilk içeriğin görünmesidir; ilk kullanımda bu kısaltmayı açtık çünkü LCP ile karıştırmak kolaydır.

CLS'te küçük ama önemli bir ayrıntı var: kullanıcı tıklamasından hemen sonra doğrudan o etkileşimin açtığı panelin sayfayı itmesi genellikle beklenen harekettir ve CLS'e katılmaz. Ama reklam ya da afiş kullanıcı bir şey yapmadan içeriği aşağı iterse bu beklenmeyen kaymadır. “Her kayma kötüdür” değil, “kullanıcının beklemediği kayma ölçülür” diye düşün.

## Örneklerden sonra eşikleri yorumla

Dört ziyaretten LCP değerleri 1,8, 2,0, 2,3 ve 4,4 saniye olsun. Bunları küçükten büyüğe dizersek 1,8, 2,0, 2,3, 4,4 olur. Dört değerin yüzde 75 noktasındaki değer 2,3 saniyedir; bu örneğin p75'i iyi hedef olan 2,5 saniyenin altındadır.

**p75**, gözlemleri küçükten büyüğe sıraladığında ziyaretlerin yüzde 75'ine kadar olan deneyimi temsil eden yüzdelik noktadır. Gerçek raporlar çok daha fazla ziyaret üzerinden hesap yapar. Ortalama yerine p75 kullanmak, iyi deneyim yaşayan çoğunluğun yanında yavaş deneyimlerin de görünür olmasına yardım eder. Core Web Vitals değerlendirmesinde hedef, saha verisinde p75'in her metrik için iyi aralıkta olmasıdır.

Şimdi aynı sayfanın laboratuvar ve saha ölçümünü ayıralım. **Laboratuvar ölçümü (lab)** Lighthouse veya DevTools gibi araçların kontrollü koşulda yaptığı tekrarlanabilir testtir. Belirli ağ ve CPU ayarlarını seçip sayfanın yüklenmesini inceleyebilirsin. **Saha verisi (field data)** farklı cihaz ve ağlardaki gerçek ziyaretlerden gelir; gerçek kullanıcı ölçümü için **RUM** (Real User Monitoring) denir. Laboratuvar, sorunu bulup yeniden üretmekte işe yarar; saha verisi kullanıcıların gerçekte ne yaşadığını gösterir.

Örneğin Lighthouse açılışı iyi gösterirken saha raporunda INP yüksek olabilir. Lighthouse'ın sıradan sayfa yükleme koşusu, ziyaretçilerin tüm gerçek tıklama ve yazmalarını içermez; bu yüzden canlı etkileşim ölçümünün yerine geçmez. İki ölçümü birlikte oku: laboratuvarda sorunu araştır, saha verisinde etkisinin gerçek kullanıcılarda görülüp görülmediğini izle.

## Üçüncü bir iş: metriği raporlamak

Bir kampanya afişi geç geldi, filtre de kasıyor. Canlı sitede insanların LCP, INP ve CLS deneyimlerini toplamak için Google Chrome ekibinin `web-vitals` paketindeki `onLCP`, `onINP` ve `onCLS` callback'leri kullanılabilir. **Callback**, ölçüm hazır olduğunda çağrılan fonksiyondur. Paket tarayıcı API ayrıntılarının çoğunu senin yerine yönetir; sonuçları bir RUM servisine gönderebilirsin.

```ts
import { onCLS, onINP, onLCP } from 'web-vitals'

onLCP((metric) => reportToRUM(metric))
onINP((metric) => reportToRUM(metric))
onCLS((metric) => reportToRUM(metric))
```

Bu kodda callback'in aldığı `metric`, ölçüm adı ve değerinin yanı sıra raporlama için gereken bilgileri taşır. Bu kısımda raporun nereye gönderileceğini `reportToRUM` adlı yer tutucu fonksiyon gösteriyor; gerçek projede bu senin izleme servisine bağlanır. Paket değerleri her zaman sayfa ilk açılır açılmaz vermeyebilir: örneğin INP için kullanıcı etkileşimi gerekir. Dolayısıyla hemen log görmemek ölçüm çalışmıyor anlamına gelmez.

CLS için küçük bir hesap örneği de inceleyelim. Tarayıcı iki yerleşim kayması kaydetti: biri 0,05 puan, diğeri 0,12. İkinci kayma kullanıcı tıklamasının ardından olduysa beklenen hareket sayılır ve temel hesapta dışarıda kalır; geriye 0,05 kalır. İki beklenmeyen kayma 0,02 ve 0,03 ise toplam 0,05 olur.

```ts
interface Shift {
  value: number
  hadRecentInput: boolean
}

function sumUnexpectedShifts(entries: Shift[]) {
  const total = entries
    .filter((entry) => !entry.hadRecentInput)
    .reduce((sum, entry) => sum + entry.value, 0)
  return Math.round(total * 10_000) / 10_000
}
```

Fonksiyon önce kullanıcı girdisiyle ilişkili kaydı eler, sonra kalan puanları toplar ve kayan noktalı sayıların uzun küsuratını dört basamağa yuvarlar. Boş liste için toplam sıfır çıkar. Bu küçük alıştırma, `hadRecentInput` filtresini anlamaya yarar; üretimde raporlanan CLS'in tamamı bu düz toplamdan ibaret değildir.

:::mistake[Lighthouse puanını canlı kullanıcı deneyimi sanmak]
**Belirti:** Yerel test iyi görünürken gerçek ziyaretçiler yavaş etkileşim bildirir. **Neden:** Kontrollü test gerçek cihaz çeşitliliğini ve her kullanıcının etkileşimlerini içermez. **Düzeltme:** Lighthouse'ı tanı koymak için kullan; canlı performans için saha verisini de izle.
:::

Neden iki tür ölçüm tutuyoruz? Laboratuvar kaydı aynı koşulları tekrar ederek kod değişikliğinin etkisini görmemizi sağlar. Saha ölçümü ise farklı ağ ve cihazlardaki kullanıcılardan gelen gerçek deneyimi gösterir. Biri diğerini geçersiz kılmaz; soruyu doğru araçla yanıtlar.

:::info[Derinlemesine (isteğe bağlı)]
Üretim Web Vitals paketindeki CLS, bütün kaymaları yaşam boyu tek toplam olarak toplamaz. En fazla 5 saniye süren ve ardışık kaymalar arasında en fazla 1 saniye bulunan oturum pencereleri değerlendirilir; en yüksek pencere skoru kullanılır. Buradaki saf toplam yalnızca filtreleme ve toplama mantığını gösterir. Ham `PerformanceObserver` ile gözlemci kurup sekme görünürlüğünü ve raporlamayı yönetmek de mümkündür; uygulama kodunda genellikle `web-vitals` bu ayrıntıları üstlenir.
:::

## Özet

- LCP ana içeriğin görünme süresini, INP etkileşim tepkisini, CLS beklenmeyen görsel kaymayı ölçer.
- İyi hedefler: LCP ≤ 2,5 sn, INP ≤ 200 ms, CLS ≤ 0,1.
- p75, ziyaretlerin yüzde 75 noktasındaki deneyimi özetler; saha ölçümünde kullanılır.
- Laboratuvar tekrarlanabilir teşhis sağlar; saha verisi gerçek ziyaretçilerin cihaz ve etkileşim çeşitliliğini gösterir.
- `web-vitals` callback'leri LCP, INP ve CLS değerlerini uygulamanın raporlama servisine taşımaya yardım eder.

**Yeni terimler**

- **Core Web Vitals:** Yükleme, etkileşim ve görsel kararlılığı ölçen temel tarayıcı göstergeleri.
- **LCP / INP / CLS:** Ana içeriğin görünme süresi / etkileşim tepkisi / beklenmeyen görsel kayma puanı.
- **p75:** Ölçülen ziyaretlerin yüzde 75 noktasındaki değer.
- **Lab / saha verisi:** Kontrollü test / gerçek ziyaretlerden toplanan ölçüm.
- **RUM:** Gerçek kullanıcı ölçümlerini toplama ve izleme yaklaşımı.

**Kendini yokla**

1. Afiş geç görünüyorsa önce hangi metriğe bakarsın? LCP'ye; çünkü ana içerik geç görünmektedir.
2. Filtre tıklamasından sonra sayfa geç tepki veriyorsa hangi metrik sorunu tarif eder? INP; çünkü etkileşimden sonraki çizime kadar geçen süre uzundur.
