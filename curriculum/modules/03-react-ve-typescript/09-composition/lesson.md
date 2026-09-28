---
title: "Composition ile esnek bileşen kur"
minutes: 13
kind: concept
---

# Composition ile esnek bileşen kur

:::pain[Bileşen her yeni eylemde büyüyor]
Bir hava durumu kartı bazen “Yol tarifi”, bazen “Hatırlatıcı kur” düğmesi göstermeli. Kartın içine `showDirections`, `showReminder`, `showShare` gibi boolean prop'lar ekledikçe tüm kombinasyonlar ve koşullar büyüyor. Kartın görevi içerik yerleşimi; hangi eylemin gösterileceği ise çağıran ekranın kararı.
:::

## Çerçeveyi içerikten ayır

Composition, bir bileşeni başka bileşenleri ve render edilebilir içeriği bir araya getirerek kurmaktır. Genel çerçeve yerleşim, ortak semantik ve görsel düzeni sağlar; çağıran ekran değişken alanları JSX olarak verir. `children` ana içeriği temsil eder. Birden fazla değişken bölge varsa `header`, `actions`, `aside` gibi isimli slot prop'ları kullanılabilir.

Bu tasarımda şu kuralları uygula:

1. **Çerçevenin değişmeyen sorumluluğunu tanımla.** Kartın `article` olması, ana içeriği ve alt eylem alanını konumlandırması kartın işidir.
2. **Değişen görünür içeriği çağırana bırak.** Favori, yardım bağlantısı veya metin gibi farklı JSX'i `children` ya da isimli slot olarak al.
3. **Slot tipi olarak `ReactNode` kullan.** Bu tip metin, sayı, JSX elementi, fragment, dizi ve nullish içerikler dahil React'in render edebildiği değerleri kapsar.
4. **Opsiyonel slot'un varlığını içeriğin falsy olup olmadığıyla karıştırma.** `0`, geçerli bir ReactNode'dur. Yalnız `null` ve `undefined` slotun boş olduğu anlamına gelecekse `slot != null` kontrolü kullan.
5. **Çocuğun işini çerçevenin içine gömme.** Çerçeve slot'u nereye koyacağını bilir; eylemin ne yaptığı veya hangi state'i değiştirdiği çağıran bileşende kalır.

Slot isimleri, çağıranın hangi bölgeyi doldurduğunu açıkça gösterir. Tek çocuk alanı yeterliyse `children` kullanmak en sade API'dir. Başlık, gövde ve eylemler bağımsız değişiyorsa adlandırılmış alanlar anlamlıdır; her küçük fark için yeni boolean prop eklemekten kaçın.

![Çağıranın iki ReactNode alanını ortak çerçevenin farklı bölgelerine vermesi](diagrams/composition-slotlari.svg "Çerçeve ve slot'lar")

Önce kırık API'yi karşılaştıralım:

```tsx
type WeatherCardProps = {
  showDirections?: boolean
  showReminder?: boolean
}
```

Kart bu prop'ları kabul ettiğinde artık hem görünümü hem hangi uygulama eylemlerinin bulunduğunu bilir. Yeni bir eylem için yeni flag, JSX dalı ve olası flag kombinasyonu eklenir. Bu API yerine çağıran istediği içeriği açık alana verdiğinde çerçeve eylemin ürün anlamından bağımsız kalır.

## Slot alanını davranışla izle

Bir yardım paneli değişken açıklama ve araç alanı alabilir. `tools` isteğe bağlı olsun:

```tsx check
import type { ReactNode } from 'react'

type HelpPanelProps = {
  children: ReactNode
  tools?: ReactNode
}

function HelpPanel({ children, tools }: HelpPanelProps) {
  return (
    <article>
      <div>{children}</div>
      {tools != null && <footer>{tools}</footer>}
    </article>
  )
}

const panel = <HelpPanel tools={0}>Kısayolları görmek için ? tuşuna bas.</HelpPanel>
void panel
```

Burada `tools={0}` verildiğinde footer görünür ve içinde `0` yazar. `tools && <footer>` kullansaydık sol değer sıfır olduğunda React sayı 0'ı footer dışında gösterebilirdi. `tools != null` sadece nullish değerleri dışarıda bırakır; false veya boş string gibi ReactNode değerleri teknik olarak slot olarak gelebilir. Ekip API'si bunların anlamını istemiyorsa prop türünü veya sözleşmesini daraltabilir.

## İki kullanım, aynı çerçeve

Aynı `HelpPanel` bir ekranda düğme, başka ekranda bağlantı alabilir. Çerçevenin bu ayrımı bilmesine gerek yoktur:

```tsx
<HelpPanel tools={<button type="button">Klavye kısayolları</button>}>
  Kısayolları öğren
</HelpPanel>

<HelpPanel tools={<a href="/yardim">Yardım merkezini aç</a>}>
  Hesap ayarlarına göz at
</HelpPanel>
```

İlkinde eylem yerel etkileşim, ikincisinde gezinmedir. Parent hangi davranışın gerektiğini bilir ve uygun semantik elementi sağlar. `HelpPanel` `<button>` veya `<a>` seçimini kendi içine koymadığı için yeni bir kullanımda değişmeden kalır.

Composition, props kullanmayı bırakmak değildir. İçerik slot'u da prop'tur; burada fark, davranış veya veri açıklamak yerine render edilecek ReactNode taşımış olmasıdır. Callback prop'u ise etkileşimi yukarı bildirmek için kullanılır. Örneğin çerçevenin kendi kapatma düğmesi varsa `onClose: () => void` alabilir; içine yerleştirilen `tools` slot'u ise çağıranın sağladığı arbitrary UI'dır.

Bir `ReactNode` slot'u gerçekten arbitrary render edilebilir içerik taşır. Bileşen onu klonlamaz, iç prop'larını okumaya çalışmaz ve içine kendi callback'ini enjekte etmez. Eğer çerçevenin özel etkileşime ihtiyacı varsa, slot'tan ayrı, adlandırılmış callback sözleşmesi tanımla. Bu sayede slot'ın içindeki link veya düğme kendi doğal davranışını korurken dış component de kendi başına test edilebilir kalır.

Bir isimli slot'un gerekçesini kullanımdan okuyabilmelisin. `<HelpPanel tools={...}>Açıklama</HelpPanel>` satırında çocuk açıklama alanına, `tools` ise alt eylem alanına gider. Slot verilmezse footer hiç oluşmaz; slot verilirse footer içeriğin kendisini üretmez, yalnızca konumlandırır. Bu ayrım, yerleşim bileşeninin ürün davranışına bağımlı hale gelmesini önler.

## Ne zaman boolean prop uygun?

Boolean prop'lar her zaman kötü değildir. `disabled`, `compact`, `isLoading` gibi bir bileşenin sunumunu veya kullanılabilirliğini değiştiren, az sayıda ve anlamı net seçenekler boolean olabilir. Fakat her eylem türü için ayrı görünürlük flag'i eklemek, çerçeveyi ürün akışlarını tanıyan bir bileşene dönüştürür. İki bağımsız eylem için 2^2, beş flag için 2^5 olası kombinasyon vardır; çoğu kullanım bu kombinasyonların yalnız birkaçını geçerli sayar.

Değişken UI parçası bir ReactNode slot'u olarak geldiğinde çağıran semantiği, metni, event handler'ı ve erişilebilir etiketi kendi bağlamında belirler. Çerçeve de yalnız yapısal yeri korur. Slot içeriğini tekrar tekrar üretmek ve her durum için farklı wrapper gerekiyorsa, bu bir slot API'sinin fazla genel olduğuna işaret edebilir; daha açık named child component veya varyant API'si seçebilirsin.

## Sık hatalar

:::mistake[Her görünüm için boolean prop eklemek]
Belirti → Kart bileşeni onlarca koşullu dala ve geçersiz flag kombinasyonlarına sahip oluyor.  
Neden → Çağıranın sağlaması gereken UI bileşenin içine taşınmış.  
Düzeltme → Değişken render içeriğini `children` veya isimli `ReactNode` slot'u olarak al.
:::

:::mistake[Opsiyonel slot'u truthy kontrol etmek]
Belirti → `tools={0}` iken sıfır footer'a yerleşmiyor ya da yanlış yerde görünüyor.  
Neden → `0` falsy olmasına rağmen geçerli ve render edilebilir ReactNode'dur.  
Düzeltme → Slot yalnız nullish olduğunda yok sayılsın istiyorsan `tools != null` kontrol et.
:::

:::mistake[Her JSX'i tek children alanına sıkıştırmak]
Belirti → Kart başlığı, ana içerik ve alt araçların yerini çağıran tek başına belirleyemiyor.  
Neden → Birbirinden bağımsız bölgeler tek isimsiz slot'ta toplanmış.  
Düzeltme → Gerçek yerleşim bölgeleri için `heading`, `body`, `tools` gibi ayrı named slot'lar tanımla.
:::

:::mistake[Slot'tan gelen öğenin davranışını tahmin etmek]
Belirti → Kart, gelen her içeriği düğme varsayıp üzerine `onClick` ekliyor.  
Neden → Görünür içerik ile etkileşim sözleşmesi birbirine karıştırılmış.  
Düzeltme → Davranışın sahibi çağıran olsun; bileşen yalnız aldığı ReactNode'u render etsin veya açık callback prop'u tanımlasın.
:::

:::sector
Design system'lerde composition, ortak layout ile ürünün bağlama özgü eylemlerini ayrı tutar. Kart veya modal kabuğu yerleşim ve erişilebilir landmark sağlar; uygulama ekranı uygun buton, link ve metni slot'a verir. Bu, component API'sini her yeni ürün akışı için genişletmeden yeniden kullanım sağlar.
:::

## Özet

- Composition, ortak çerçeveyi değişken UI içeriğinden ayırır.
- `children` ana içerik; named `ReactNode` slot'ları başlık/eylem gibi ayrı bölgeler içindir.
- `ReactNode` içinde `0` geçerlidir; optional slot için nullish kontrol yap.
- Slot'un davranışı ve semantiği çağıran bileşende kalır; çerçeve yalnız yerini sağlar.

**Kendini yokla:** Farklı ekranlarda farklı buton veya link gösteren bir kart için neden slot uygundur?  
*Cevap:* Çağıran doğru etkileşimi seçer, kart ortak çerçeve ve yerleşimi korur.

**Kendini yokla:** `actions && <footer>{actions}</footer>` hangi ReactNode değerinde sorun çıkarabilir?  
*Cevap:* `actions` 0 ise falsy sayılır ve `&&` sonucu 0 olur; nullish kontrol slot'un geçerli sıfırını korur.
