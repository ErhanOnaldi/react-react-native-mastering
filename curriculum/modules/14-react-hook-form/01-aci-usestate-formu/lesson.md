---
title: "Controlled form her tuşta ne yapar?"
minutes: 14
kind: concept
---

# Controlled form her tuşta ne yapar?

:::pain[Liste ekranındaki sayaç]
Sinema'da sekiz alanlı liste formunda ada tek harf yazınca render sayacı artıyor. Kaydet'e basınca form çalışıyor; ama her alan için ayrı state, change handler ve submit nesnesi taşıyorsun. Yeni bir input eklemek üç ayrı yere dokunmayı gerektiriyor.
:::

## Bir tuşun React içindeki yolu

Controlled input'ta React state alanın değerinin kaynağıdır. `value` ekrana yazılacak değeri, `onChange` ise yeni değeri React'e geri taşır. Bu bağ açıkça kuruludur; maliyeti de açıktır: her değer değişimi state güncellemesi, dolayısıyla ilgili bileşen ağacı için yeni bir render isteğidir.

![Tetikleme, render, commit ve effect sırasını gösteren diyagram](diagram:render-commit)

Kesin model şöyle işler:

1. Tarayıcı input'a karakter ekler ve `onChange` olayını çağırır.
2. Handler, o render'ın state fotoğrafını okuyup `setState` ile güncelleme kuyruğa koyar.
3. React bileşeni yeni state ile yeniden çalıştırır. Bu aşama UI ağacını hesaplar; DOM'u henüz değiştirmez.
4. React hesaplanan farkı DOM'a uygular (commit). Input'un `value` prop'u yeni karakteri içerir.
5. Bu işlem için effect yazdıysan commit'ten sonra çalışır. Form değerini state'ten türetmek için effect gerekmez.

![Her render'ın kendi state fotoğrafını gösteren diyagram](diagram:state-snapshot)

Her render kendi değişken değerlerini görür. `setName(name + '!')` çağrısı o anda ekrandaki `name` değişkenini değiştirmez; yeni render için güncelleme kuyruğa ekler. React bazı olaylardaki birden çok güncellemeyi gruplayabilir. Bu yüzden “sekiz state var, sekiz render olur” sonucu çıkmaz; bir tuşta tek handler çalışır, React render'ı uygun zamanda planlar.

## Sekiz alanın bakım maliyeti

Aşağıdaki küçük gezi planı formu farklı alanlara sahip; ama her controlled metin alanında aynı döngüyü görebilirsin:

```tsx
import { useState } from 'react'

type TripDraft = { city: string; nights: string }

export function TripForm({ onSave }: { onSave: (draft: TripDraft) => void }) {
  const [city, setCity] = useState('')
  const [nights, setNights] = useState('')

  return (
    <form onSubmit={(event) => {
      event.preventDefault()
      onSave({ city, nights })
    }}>
      <label htmlFor="trip-city">Şehir</label>
      <input id="trip-city" value={city} onChange={(event) => setCity(event.target.value)} />
      <label htmlFor="trip-nights">Gece</label>
      <input id="trip-nights" value={nights} onChange={(event) => setNights(event.target.value)} />
      <button type="submit">Planla</button>
    </form>
  )
}
```

Bu örnek iki alanlıdır; değerlerin nasıl akıp geri döndüğünü saklamaz. Sekiz alanlı formda aynı bağlantıyı sekiz kez kurarsın. Form bileşeninde başlık, yardım metni ve tüm alanlar varsa bu bileşen her tuşta tekrar çalışır. React DOM'da yalnızca gereken input değerini güncelleyebilir; render hesabı yine yapılmıştır.

Bir render sayacı bunu görünür kılar ama performans ölçüm aracı değildir. Geliştirme StrictMode'u render çağrılarını fazladan gösterebilir; üretim ve geliştirme sayıları birebir karşılaştırılmaz. Doğru soru sayaç kaç yazdı değil, yazma olayının hangi bileşenleri yeniden çalıştırdığı ve bunun gerçek kullanıcı gecikmesi yaratıp yaratmadığıdır.

## Sayı ve metin alanlarının farkı

`input type="number"` bile `event.target.value` üzerinden metin verir. Kullanıcı alanı boş bırakabilir, ara bir değer yazabilir veya tarayıcıya göre geçersiz bir metin oluşturabilir. Bu yüzden sayı olarak kullanacağın bir alanı form state'inde string tutup submit sırasında dönüştürmek çoğu zaman daha güvenlidir. Sayı dönüşümünde boş metni ayrıca ele al; `Number('')` sıfırdır ve bu sonuç çoğu formda istenmez.

Checkbox için `checked` boolean değerdir; metin input'undaki `value` ile aynı alanı kullanmazsın. Select de çoğunlukla string değer üretir. Alan başına tipleri doğru seçmek, submit nesnesindeki veriyi öngörülebilir kılar.

## Önce kırık örnek, sonra düzeltme

Controlled input'ta `value` verip değişim handler'ı eklememek alanı yazılamaz yapar. React her render'da eski değeri geri koyar:

```tsx
function FrozenCity() {
  return <input aria-label="Şehir" value="İzmir" />
}
```

Bu örnek bilerek kırık; konsolda controlled input için uyarı da görürsün. Kullanıcıya yazma izni vereceksen değişen değeri state'e geri bağla:

```tsx check
import { useState } from 'react'

export function EditableCity() {
  const [city, setCity] = useState('İzmir')
  return <input aria-label="Şehir" value={city} onChange={(event) => setCity(event.target.value)} />
}
```

İkinci parça tek başına derlenir. `onChange` olayı input değerini alır; setter yeni render ister; yeni `value` ekrana yazılır. Bu çevrimin her tuşta tekrarlanması kontrollü yaklaşımın davranışıdır, bug değildir.

## Sık karşılaşılan sapmalar

:::mistake[Input her tuşta eski harfe dönüyor]
**Belirti:** Yazdığın harf görünür görünmez kayboluyor. → **Neden:** `value` sabit veya state'e bağlı, ama `onChange` yok ya da yanlış alanı güncelliyor. → **Düzeltme:** Her controlled alanda `value` ile aynı alanı güncelleyen handler kur.
:::

:::mistake[Render sayısı sekiz kat arttı sanılıyor]
**Belirti:** Sekiz state olduğu için her tuşta sekiz ayrı render bekleniyor. → **Neden:** State değişkeni sayısı render sayısını belirlemez; güncelleme ve React'in batching kararı belirler. → **Düzeltme:** Tek etkileşim öncesi/sonrası sayacı karşılaştır; sonucu StrictMode ve bileşen sınırlarıyla birlikte yorumla.
:::

:::mistake[Kaydet'te eski değer gidiyor]
**Belirti:** Son yazılan karakter submit verisinde yok. → **Neden:** Olay içinde eski render'dan gelen bir değer başka bir state güncellemesiyle birleştirilmiş olabilir. → **Düzeltme:** Alanların güncel state'ini submit anında oku; çoklu güncellemelerde önceki state'e dayalıysa updater biçimini kullan.
:::

:::sector
Ekipler form performansını “state kullanıyor” diye değil, gerçek etkileşim ve Profiler kaydıyla değerlendirir. Küçük formda controlled yaklaşım basit ve yerindedir. Alan sayısı, doğrulama ve hata durumları arttığında tekrarlanan bağlama kodu ayrı bir form aracını değerlendirmek için somut gerekçe verir.
:::

## Render maliyetini nasıl yorumlamalı?

Bir render, React bileşen fonksiyonunun tekrar çalışmasıdır; commit ise React'in DOM'a gerekli değişikliği uygulamasıdır. Her render'da tarayıcı tüm sayfayı yeniden boyamaz. Yine de büyük bir form bileşeninde pahalı hesaplama, çok sayıda alt bileşen veya binlerce seçeneği yeniden üretmek varsa yazma başına render hissedilebilir gecikmeye dönüşebilir. Render sayacı bu zincirin yalnız ilk bölümünü gösterir; kullanıcı deneyimini Profiler ve gerçek cihaz ölçümüyle değerlendir.

State'i dar bir alan bileşenine taşımak bazı küçük formlarda hesaplamayı azaltabilir. Fakat alan değerleri ortak bir submit nesnesinde toplanacak, alanlar birbirini doğrulayacak ve reset edilecekse state'i parçalara ayırmak veri akışını da karmaşıklaştırabilir. Her render'ı kusur saymak yerine bileşen sınırı ve veri sahibi üzerinden karar ver. RHF'nin kaydedilmiş input yaklaşımı, özellikle çok sayıda alanda ortak toplama/doğrulama ihtiyacını azaltır; küçük arama kutusuna sırf render oluyor diye form kütüphanesi eklemen gerekmez.

Bu ayrım `useEffect` ihtiyacını da netleştirir. Input state'inden başka bir değeri hesaplamak için effect eklemek render → commit → effect → state update biçiminde fazladan tur yaratabilir. Örneğin karakter sayısı `text.length` ile doğrudan hesaplanabilir. Effect dış sistemle eşleşmek içindir; input değişikliğini tekrar state'e kopyalayan mekanizma değildir.

Controlled yaklaşımın bir başka yararı, React'in her anda hangi değeri göstereceğini bilmesidir. Anlık biçimlendirme, koşullu alan veya yazı yazarken filtreleme gerektiğinde bu kontrol işe yarar. Maliyet, state'in formun ihtiyaç duyduğu her davranış için ayrıca düzenlenmesidir. Bir araç seçerken kontrolün getirdiği faydayı tekrar eden kod ve render sınırıyla birlikte tart.
Render'ı çocuklara bölmek de maliyeti sihirli biçimde yok etmez. Üst form state'i değişince üst bileşen tekrar çalışır; normal koşulda çocuk bileşen fonksiyonları da parent render zincirinin parçasıdır. `memo` gibi sınırlar ancak props değişmiyorsa bazı çocukların işini atlayabilir ve gereksiz memo kullanımı bakım maliyetini artırır. Formu parçalamadan önce Profiler'da gerçekten pahalı olan kısmı belirle.

Bu nedenle “RHF daha hızlıdır” gibi mutlak bir cümle kurmak doğru olmaz. Daha az kontrollü state güncellemesi çoğu büyük formda gereksiz render işini azaltabilir; ama bütün form state'ini `watch` ile üst seviyede okuyup her harfte tüm ekranı güncellersen bu avantajı kendin geri alırsın. Abonelikleri kullanan bileşenin yakınında tutmak önemlidir.

## Hatırla ve kendini yokla

- Controlled input'ta React state değerin kaynağıdır; `onChange` yeni değeri state'e döndürür.
- Her tuşta state güncellemesi render planlar, fakat DOM'da yalnız gereken fark commit edilebilir.
- Render sayısı, state adediyle çarpılmaz; sayı alanları da çoğunlukla metin olarak başlar.

**Kendini yokla:** `value` verilip `onChange` eklenmeyen input neden yazılamaz? Çünkü her render eski değeri tekrar verir. `type="number"` alanında neden boş metni `Number`'a çevirmeden kontrol edersin? Çünkü boş metin sıfıra dönüşür.
