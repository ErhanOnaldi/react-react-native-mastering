---
title: "State snapshot ve updater kuyruğu"
minutes: 19
kind: concept
---

# State snapshot ve updater kuyruğu

:::pain[Üç artırma, ekranda bir artış]
Alışkanlık sayacında “+3 adım” düğmesine basıyorsun; ekranda sayı 1 artıyor. Handler içinde setter üç kez çağrılmış, ama sonuç üç değil. Çünkü `count` bir sayaç hücresi gibi anında değişmiyor: handler, o render'da gördüğü tek bir değerin fotoğrafıyla çalışıyor.
:::

## Her render kendi fotoğrafını görür

State, bileşen fonksiyonunun içinde sonradan değişen sıradan bir yerel değişken değildir. React state'i saklar ve bir render başlatırken bileşene o render'a ait değerleri verir. Handler fonksiyonları da oluşturuldukları render'ın props ve state değerlerini kapatır. Bu nedenle state setter çağrısı o closure içindeki değişkeni hemen değiştirmez.

![Her render'ın snapshot'ı ve setter kuyruğu](diagram:state-snapshot "Snapshot ile güncelleme kuyruğu")

Bu modelin kuralları nettir:

1. **Render state'i okur, onu değiştirmez.** `const [count, setCount] = useState(0)` içindeki `count`, o render için sabit bir değerdir. Handler çalışırken setter çağırmak mevcut `count` değişkenine yeni değer atamaz.
2. **Setter bir sonraki render için iş kuyruğa koyar.** React güncellemeleri uygun noktada işler ve yeni state'i kullanarak başka render başlatır. Bu, aynı event içindeki güncellemeleri toplamasına imkân verir.
3. **Değerle verilen güncelleme o render'daki değeri kullanır.** `setCount(count + 1)` önce `count + 1` ifadesini hemen hesaplar. Aynı handler'da üç kez çağrılırsa üç çağrı da aynı `count` değerinden aynı sonucu üretir.
4. **Fonksiyonel updater sıradaki state'i alır.** `setCount(current => current + 1)` çağrısında React fonksiyonu kuyruğa koyar. Kuyruktaki her updater, önceki updater'ın sonucunu alır.
5. **Handler sonrasındaki render yeni bir closure üretir.** Yeni JSX ve yeni handler'lar güncel state değerini görür; eski handler ise oluşturulduğu render'ın fotoğrafına bağlı kalır.
6. **Aynı değer için yeniden render atlanabilir.** React eski ve yeni state'i `Object.is` ile karşılaştırır. Sonuç eşitse güncellemeyi atlayabilir; bileşen işlevini bazı durumlarda yine çağırsa bile çocuklara ve DOM'a değişiklik taşımak zorunda değildir. Nesneyi yerinde değiştirmek bu yüzden güvenilir bir güncelleme değildir.

Bu kurallar render'ın saflığıyla da tutarlıdır: state setter, mevcut hesaplamayı yerinde değiştirmez; React'e başka bir hesaplama gerektiğini bildirir. “Setter çağrıldı, değişken hemen değişti” diye düşünürsen aynı handler içinde eski değeri tekrar tekrar okuman şaşırtıcı gelir.

## Kuyruğu satır satır izleyelim

Başlangıç `steps = 0` olsun. Handler üç kez şu işlemi yapıyor:

```tsx
setSteps(steps + 1)
setSteps(steps + 1)
setSteps(steps + 1)
```

Handler'ın closure'ı `steps = 0` görür. JavaScript bu ifadeleri sırayla değerlendirir:

| Satır | Closure'daki `steps` | Kuyruğa eklenen değer |
| --- | ---: | ---: |
| `setSteps(steps + 1)` | 0 | 1 |
| `setSteps(steps + 1)` | 0 | 1 |
| `setSteps(steps + 1)` | 0 | 1 |

Sonraki state 1 olur; React aynı event içindeki üç değeri işlerken son değeri kullanır. Bu, `setSteps` çağrılarının yalnızca bir kez çalıştığı anlamına gelmez. Üç değer hesaplandı fakat hepsi aynı fotoğrafa dayanıyordu.

Fonksiyonel updater ile ise kuyruğa üç hesaplama girer:

```tsx check
import { useState } from 'react'

function StepCounter() {
  const [steps, setSteps] = useState(0)
  const addThree = () => {
    setSteps((current) => current + 1)
    setSteps((current) => current + 1)
    setSteps((current) => current + 1)
  }
  return <button onClick={addThree}>Adım: {steps}</button>
}

const counter = <StepCounter />
void counter
```

| Kuyruktaki adım | Updater'ın aldığı değer | Ürettiği değer |
| --- | ---: | ---: |
| İlk fonksiyon | 0 | 1 |
| İkinci fonksiyon | 1 | 2 |
| Üçüncü fonksiyon | 2 | 3 |

React sırayı koruyarak fonksiyonları uygular. Burada `setSteps(current => current + 3)` de sonuca ulaşırdı; üç küçük updater örneği, her güncellemenin öncekinin sonucuna bağlandığını görünür kılar. Bir sonraki değeri mevcut state'e göre hesaplıyorsan updater formu güvenli varsayılandır.

React bir event handler sırasında gelen güncellemeleri gruplayabilir; bu batching, her setter çağrısında ayrı ayrı render başlatmaktan kaçınır. Setter'ların çağrılması ile state'in yeni değerini ekranda görmek arasında bu yüzden bir sınır vardır. Fonksiyonel updater'lar aynı gruptaki güncellemeleri sırayla birleştirebilir. Bu davranış “state asenkron bir değişkendir” demek değildir; state değeri render'a aittir ve yeni render oluşmadan mevcut closure'ın fotoğrafı değişmez.

Updater fonksiyonunu yazarken dışarıdaki snapshot'ı okumamaya dikkat et. `setSteps(current => current + step)` içinde state için `current`, başka bir sabit `step` değeri için closure kullanılabilir; ama birden çok state değeri birbirine bağlı ve beraber güncellenecekse geçişi reducer veya tek bir nesne state'inde toplamak daha anlaşılır olabilir. Bu modül yalnız tek sayaç geçişini ele alıyor; bağlı durumların daha geniş tasarımını sonraki Hook dersinde göreceksin.

### Snapshot bir closure içinde yaşar

```tsx
function showThenUpdate() {
  console.log(steps)
  setSteps((current) => current + 1)
  console.log(steps)
}
```

Her iki log da bu handler'ın oluşturulduğu render'daki `steps` değerini yazar. İkinci log'un yeni sayıyı göstermemesi setter'ın başarısız olduğu anlamına gelmez. React güncelleme kuyruğunu işleyip yeni render başlattıktan sonra, ekrandaki düğme yeni closure'ı kullanır.

Bir `setTimeout` callback'i, Promise continuation'ı veya başka callback de oluşturulduğu render'ın değerini kapatabilir. Bu nedenle “biraz sonra çalışacak” olması tek başına callback'i güncel state'e bağlamaz. Güncel state'e dayalı güncelleme gerekiyorsa callback içinde updater kullan; yalnız değeri okumak gerekiyorsa güncel değer gereksinimini ayrıca tasarla. Ref gibi başka bir taşıyıcıya geçmek her zaman çözüm değildir; state güncellemesinin render üretmesi gerekiyorsa state doğru araçtır.

## Önce kırık hesap, sonra doğru hesap

Bir indirim kartında mevcut puana 5 bonus ekleyelim. Aşağıdaki kod tek tıklamada görünen değeri çoğu zaman 5 artırır; ancak aynı event'te iki ayrı kaynak aynı eski değere göre güncelleme gönderecekse bir güncelleme diğerinin üstüne yazabilir:

```tsx
function addBonus() {
  setPoints(points + earnedBonus)
  setPoints(points + referralBonus)
}
```

İki değer de closure'ın eski `points` değerinden hesaplanır. İkinci setter ilk sonucu biriktirmez; o da eski puan ile referral bonus toplamını kuyruğa koyar. “Son yazan kazanır” sonucu kullanıcıya kaybolan puan olarak görünür.

Şöyle yazınca her adım sıradaki state'i temel alır:

```tsx check
import { useState } from 'react'

function RewardPoints() {
  const [points, setPoints] = useState(10)
  const earnedBonus = 3
  const referralBonus = 2

  function addBonuses() {
    setPoints((current) => current + earnedBonus)
    setPoints((current) => current + referralBonus)
  }

  return <button onClick={addBonuses}>Puan: {points}</button>
}

const rewards = <RewardPoints />
void rewards
```

Yeni sıra 10 → 13 → 15 olur. Updater fonksiyonu saf kalmalı: aynı `current` girdisinde aynı sonucu üretmeli. İçinden başka setter çağırma, ağ isteği başlatma veya dış sayaç değiştirme; React geliştirme kontrollerinde updater'ı tekrar çağırabilir.

### Değer ve updater aynı kuyrukta

Kuyruk yalnız üç aynı tür işlemi almak zorunda değil. `score = 4` iken önce `setScore(score + 1)`, ardından `setScore(current => current * 2)` çağrılırsa kuyruğun ilk öğesi hazır `5` değeridir; ikinci öğesi çalıştırılacak fonksiyondur. React önce state'i 5 yapar, sonra updater'a 5 verir ve sonuç 10 olur. Sırayı tersine çevirirsen updater 4'ü ikiye katlar, sonradan gelen hazır `5` değeri sonucu ezer; ekran 5 gösterir. Her adımın türü ile sırası birlikte sonucu belirler.

| Zaman | Handler'ın `score` snapshot'ı | Kuyruk / işlenen değer | DOM'da görünen |
| --- | ---: | --- | --- |
| Render 1 ve commit | 4 | Boş | “Puan: 4” |
| Tıklama, ilk setter | 4 | Hazır değer `5` | “Puan: 4” |
| Aynı handler, ikinci setter | 4 | `5`, ardından `current => current * 2` | “Puan: 4” |
| Render 2'nin hesaplaması | Yeni state 10 | Fonksiyon 5 alıp 10 döndürdü | Henüz “Puan: 4” |
| Commit | 10 | Kuyruk işlendi | “Puan: 10” |
| Varsa effect | 10 | Yeni render'ın değerini görür | “Puan: 10” |

Bu tablo, “React setter'ları rastgele sırada çalıştırıyor” yorumunu da düzeltir. Sıra korunur; yalnız handler içindeki `score` sabit kalır. Updater fonksiyonları render sırasında işlenebilir ve React geliştirmede saflığı kontrol etmek için onları birden fazla çağırabilir. Updater'ın içine bildirim göndermemenin nedeni budur.

### Aynı değer, nesne kimliği ve bekleyen işler

`setOpen(false)` çağrısında `open` zaten `false` ise `Object.is(false, false)` doğrudur. React yeni görünümü commit etmeyebilir. Bu, “setter hiç çağrılmadı” anlamına gelmez; amaçlanan sonraki değer mevcut değerle aynıdır. Buna karşılık `setProfile({ name: 'Ada' })` her çağrıda yeni nesne üretir; alanlar aynı olsa bile iki nesne `Object.is` açısından farklıdır.

Nesneyi yerinde değiştirmek daha ciddi bir sorundur. `profile.name = 'Ece'; setProfile(profile)` eski referansı yeniden gönderir. React içerideki alanı karşılaştırmaz; güncellemeyi atlayabilir, ekranda eski isim kalabilir. Yeni nesne oluştur: `setProfile(current => ({ ...current, name: 'Ece' }))`. Bu kopya yalnız değişen yol için yenidir; büyük iç içe yapılarda her seviyeyi bilinçli kopyalaman gerekir.

Başka bir sınır, birbiri ardına gelen kullanıcı olaylarıdır. Ayrı iki tıklamada React normalde ilk tıklamanın güncellemesini sonraki tıklamadan önce işler; her tıklama yeni render'ın handler'ına ulaşır. Tek handler içindeki çoklu setter'lar ise aynı snapshot'ı paylaşır. Geciken Promise callback'i eski closure'ı elinde tutuyorsa farklı zamanlarda çalışması yine eski değeri okumayacağı garantisini vermez. Önceki state'e dayalı geçişi updater'la ifade etmek bu iki durumda da sonucu açık tutar.

Bir state geçişi başka bir state'in mevcut değerine de bağlıysa iki ayrı updater'ın hangi snapshot'ları kullandığını dikkatle incele. Örneğin sepet toplamı ile ürün sayısı birbirinden hesaplanıyorsa toplamı ayrı state'te saklamak yerine kalemlerden render sırasında türetmek genellikle daha güvenlidir. Böylece iki kuyruğu senkron tutma sorumluluğu ortadan kalkar.

### Sonraki modüllerde bu fotoğraf

Effect içindeki callback bir render'ın `query` değerini yakaladığında dependency listesinin niçin önemli olduğunu bu fotoğrafla anlayacaksın. Formda iki alan aynı event'te güncellenirse yeni değeri handler'ın eski değişkeninde aramak yerine event'ten ya da updater'dan alacaksın. Query cache güncellendiğinde de cache verisinin ekranda görünmesi ayrı render ve commit gerektirir. Performans bölümünde aynı state değeriyle gelen güncellemelerin neden görünür DOM işi üretmeyebildiğini `Object.is` üzerinden yorumlayacaksın.

## Sınır durumları ve sık hatalar

:::mistake[Setter'dan hemen sonra eski değeri okumak]
Belirti → Setter'dan sonra yazdırılan değer bir render boyunca geride kalıyor.  
Neden → Setter closure'daki snapshot'ı değiştirmez; sonraki render için güncelleme kuyruğa ekler.  
Düzeltme → Yeni değeri hesaplayıp ihtiyaç duyduğun yerde kullan veya güncel değeri sonraki render'da göster; setter'ı senkron atama gibi kullanma.
:::

:::mistake[Biriken güncellemeyi değer formuyla yazmak]
Belirti → Aynı tıklamada alınması gereken bonuslardan yalnız sonuncusu görünüyor.  
Neden → Her `setPoints(points + bonus)` eski snapshot'tan hesaplanıp birbirini eziyor.  
Düzeltme → `setPoints(current => current + bonus)` kullanarak işlemleri kuyruğa sırayla bağla.
:::

:::mistake[Updater içinde yan etki çalıştırmak]
Belirti → Geliştirmede ödül bildirimi iki kez gönderiliyor.  
Neden → Updater saf state hesabı yerine yan etki de çalıştırıyor; React bu fonksiyonu kontrol amacıyla tekrar çağırabilir.  
Düzeltme → Updater yalnız yeni state'i döndürsün; bildirimi açık kullanıcı olayı ya da uygun dış sistem katmanında yönet.
:::

:::sector
Üretim kodunda bir state değeri üzerinden artış, ekleme veya sayaç azaltma yapılıyorsa ekipler genellikle updater biçimini tercih eder. Bu, event batching ve eşzamanlı güncellemelerde “hangi snapshot kullanıldı?” sorusunu ortadan kaldırır. Updater'ı küçük ve saf tutmak, birim test etmeyi ve kod incelemesini de kolaylaştırır.
:::

## Özet

- Her render'ın state'i sabittir; event handler o render'ın değerlerini kapatır.
- Setter anlık değişken ataması değildir; sonraki render için güncelleme kuyruğa koyar.
- Değer formu closure'daki değerden, updater formu sıradaki state'ten hesaplar.
- Biriken veya önceki state'e bağlı değişikliklerde updater kullan; updater içinde yan etki çalıştırma.

**Kendini yokla:** `n` sıfırken aynı handler'da üç kez `setN(n + 1)` çağrılırsa sonraki değer kaçtır?  
*Cevap:* 1; üç ifade de aynı snapshot'taki sıfırdan 1 üretir.

**Kendini yokla:** `setN(current => current + 1)` üç kez kuyruğa girerse updater'lar ne görür?  
*Cevap:* Sırayla 0, 1 ve 2; sonuç 3 olur.
