---
title: "Ekran okuyucu ne görüyor?"
minutes: 14
kind: concept
---

# Ekran okuyucu ne görüyor?

:::pain[Belirti]
Film kartındaki yıldız düğmesi göze anlaşılır geliyor. Fakat klavyeyle Tab yaptığında odak halkası yıldızın üstünde beliriyor, ekran okuyucu yalnızca “düğme” diyor. Kullanıcı neyi değiştireceğini ve değişikliğin gerçekleşip gerçekleşmediğini anlayamıyor.
:::

## DOM'dan erişilebilirlik ağacına

Tarayıcı HTML'i yalnızca piksellere dönüştürmez. DOM'daki öğeleri, rolleri ve ilişkileri kullanarak yardımcı teknolojilere sunulan bir erişilebilirlik ağacı da kurar. Ekran okuyucu bu ağacı okur; klavye kullanıcısı da aynı öğelerin etkileşim davranışlarına dayanır. Erişilebilir arayüz, görünüş ile bu ağacın anlattığı şeyin tutarlı olmasını sağlar.

Bu ağaç bir uygulamanın bütün görsel ayrıntılarını taşımaz. Kenar boşluğu, renk tonu ve sütun genişliği gibi bilgiler genellikle kullanıcıya semantik olarak anlatılmaz. Buna karşılık “bu bir düğme”, “adı Favori”, “durumu basılı” gibi bilgiler görev için önemlidir. DOM'da görünür bir metnin bulunması, her zaman doğru adın üretildiği anlamına gelmez; özellikle simge, SVG ve gizli içeriklerde sonucu kontrol etmek gerekir.

![DOM öğelerinin rol, erişilebilir ad ve durum bilgisine dönüşerek erişilebilirlik ağacına aktarıldığını gösteren diyagram](diagrams/erisilebilirlik-agaci.svg "DOM → rol, ad, durum")

Kurallar:

1. **Önce doğru HTML öğesini seç.** Eylem için `<button>`, gezinme için `<a href>`, ana içerik için `<main>`, başlık için uygun `<h1>`–`<h6>` kullan. Semantik öğe hem rolü hem klavye davranışını verir.
2. **Rolü kullanıcıya göre seç.** Rol, öğenin ne olduğunu anlatır: `button`, `link`, `heading`, `dialog`, `tab`. Görünüşü değiştirmek rolü değiştirmez.
3. **Erişilebilir adı anlamlı yap.** Ad, kullanıcıya öğeyi diğerlerinden ayırt ettirir. Görünür metin çoğu zaman en iyi kaynaktır; yalnızca simge varsa `aria-label` veya görünür başlığa bağlanan `aria-labelledby` kullan.
4. **Değişen durumu ayrıca bildir.** Açık/kapalı durum için `aria-expanded`, seçim için `aria-selected`, toggle düğmesi için `aria-pressed` gibi özelliği ancak bileşenin rolü ve anlamı buna uyuyorsa kullan.
5. **Gereksiz ayrıntıyı ağaçtan çıkar.** Süs amaçlı simge ve SVG'lere `aria-hidden="true"` ver; bilgi taşıyan görsele anlamlı `alt` yaz.

Bu rol–ad–durum üçlüsü çoğu denetimde iyi bir başlangıç noktasıdır. Her öğeye ARIA eklemek hedef değildir. Yanlış ARIA, doğru doğal HTML'in verdiği bilgiyi bozabilir. Örneğin `<button role="link">` kullanmak öğeyi görsel olarak değiştirmese de tarayıcıya çelişkili bir mesaj verir.

Bir öğe devre dışıysa bunun da kullanıcıya ulaşması gerekir; doğal `disabled` özelliği button için etkileşimi durdurur ve durumu bildirir. Görsel olarak soluklaştırmak tek başına klavyeyi durdurmaz. Bazı durumlarda `aria-disabled="true"` gerekir; fakat bu özellik davranışı kendiliğinden kapatmadığı için click handler'ın da işlemi engellemesi gerekir. Semantiği sağlayan attribute ile uygulama davranışını ayrı düşün.

## Bir toggle'ı adım adım oku

Şu iki tasarımdan yalnızca biri sabit ad ile durum bilgisini birlikte kullanır:

| Kullanıcının gördüğü durum | Erişilebilir ad | `aria-pressed` | Duyurulan anlam |
| --- | --- | --- | --- |
| Favoride değil | Favori | `false` | Favori düğmesi, basılı değil |
| Favoride | Favori | `true` | Favori düğmesi, basılı |

Burada `aria-pressed` bir toggle olduğunu anlatır. Ad aynı kalır; kullanıcının eylemini değil kontrolün ne olduğunu söyler. Alternatif olarak ad eyleme göre değişebilir: “Favorilere ekle” ve “Favorilerden çıkar”. Bu tasarımda `aria-pressed` kullanma; ad zaten eylemin sonucunu anlatır. İki yaklaşım da uygundur, ancak ikisini karıştırmak “Favorilerden çıkar, basılı” gibi çelişkili bir duyuru üretir.

Yalnızca simge kullanan bir kontrolü düşün. DOM'da `<button>☆</button>` varsa tarayıcı çoğunlukla yıldız karakterini ada dahil eder. Bu ad görseli olmayan kullanıcıya “ne değişecek?” sorusunu yanıtlamaz. İçine `aria-hidden` bir simge koyup düğmeye “Favori” adını verdiğinde simge görünür kalır ama adı kirletmez. Eğer düğmede “Favorilere ekle” görünür metni olsaydı aynı metni tekrar `aria-label` ile vermen gerekmeyecekti.

## Önce kırık, sonra doğru

Kırık yaklaşımda tıklama davranışı var, ancak öğe bir düğme değil ve adı da yok:

```tsx check
export function SaveMark({ onSave }: { onSave: () => void }) {
  return <span onClick={onSave}>☆</span>
}
```

`span` Tab sırasına kendiliğinden girmez, Enter veya Space ile etkinleşmez. `role="button"` eklemek rolü değiştirir, klavye davranışını eklemez. Doğru çözüm doğal öğeyi seçer:

```tsx check
export function SaveMark({ saved, onToggle }: { saved: boolean; onToggle: () => void }) {
  return (
    <button type="button" aria-label="Okuma listesi" aria-pressed={saved} onClick={onToggle}>
      <span aria-hidden="true">{saved ? '★' : '☆'}</span>
    </button>
  )
}
```

İz sürelim: tarayıcı düğmeyi DOM'a ekler; erişilebilirlik ağacında rol `button`, ad `Okuma listesi`, başlangıç durumu `false` olur. Kullanıcı Space'e basınca tarayıcı doğal click davranışını üretir ve `onToggle` çağrılır. Ebeveyn yeni `saved` prop'u ile render edince aynı düğmenin durumu `true` olur. Görsel yıldız değişir; erişilebilir ad değişmez. Ekran okuyucu yeni durumu okuyabilir.

Bir başlık başka bir elementi adlandırıyorsa ilişkiyi id ile kurabilirsin. `useId` bileşen örnekleri arasında kararlı, çakışmayan bir değer üretir:

```tsx check
import { useId } from 'react'

export function NoticeDialog({ title }: { title: string }) {
  const titleId = useId()
  return (
    <section role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      <p>Bu duyuru akşam gösterimiyle ilgili.</p>
    </section>
  )
}
```

`aria-labelledby` görünen başlığı ad kaynağı yapar. Başlık değişince duyurulan ad da değişir. `aria-describedby` açıklama için kullanılabilir, fakat uzun içeriğin tamamını ad gibi okutmak için kullanma. Ad kısa ve ayırt edici; açıklama ek bilgi olmalı.

## Belirti, neden, düzeltme

:::mistake[Belirti: Ekran okuyucu yalnızca “düğme” diyor]
Belirti → Denetleyici simge düğmesine geldiğinde kontrolün adını söylemiyor.  
Neden → Simgenin görünüşü var, fakat anlamlı metin ya da erişilebilir ad yok.  
Düzeltme → Görünür metin kullan; simge-only kontrolde kısa `aria-label` ekle ve dekoratif simgeyi gizle.
:::

:::mistake[Belirti: “Favorilerden çıkar, basılı” duyuluyor]
Belirti → Toggle hem değişen eylem adı hem `aria-pressed` ile tanımlanmış.  
Neden → Ad ve durum aynı bilgiyi farklı, çelişkili biçimde iletiyor.  
Düzeltme → Sabit ad + `aria-pressed` ya da değişen ad + durum niteliği olmadan iki tasarımdan birini seç.
:::

:::mistake[Belirti: Görünmez SVG düğme adının sonuna ekleniyor]
Belirti → Ad “Okuma listesi yıldız” gibi gereksiz kelimeler içeriyor.  
Neden → Süs SVG'si erişilebilirlik ağacında kalmış.  
Düzeltme → SVG dekoratifse `aria-hidden="true"` yap; bilgi taşıyorsa `role="img"` ve ad ver.
:::

:::mistake[Belirti: Dialog başlığı bulunuyor ama dialogun adı boş]
Belirti → Ekran okuyucu başlığı okuyabiliyor, dialogu ada göre bulamıyor.  
Neden → Başlık ile `role="dialog"` arasında programatik ilişki yok.  
Düzeltme → Başlığın id'sini `aria-labelledby` değerine bağla; benzersiz id üret.
:::

:::sector
Tasarım sistemleri icon button bileşenlerinde erişilebilir adı zorunlu prop yapar. Kod incelemesinde ekipler “bu kontrolü VoiceOver/NVDA ne diye anons eder?” diye sorar ve RTL'de `getByRole` ile rol/ad arar. Otomatik testler ad, durum ve temel etkileşimi yakalar; ekran okuyucu ile gerçek deneme ise ses sırası ve bağlamı kontrol eder. WCAG değerlendirmesinde yalnızca otomatik tarayıcı raporuna güvenilmez.
:::

## Özet

- Erişilebilirlik ağacı DOM'daki semantik anlamı yardımcı teknolojilere taşır.
- Doğru doğal HTML öğesi rol ve klavye davranışını birlikte sağlar.
- Her etkileşimli öğenin ayırt edici bir adı ve gerektiğinde güncel durum bilgisi olmalı.
- Toggle için sabit ad ve `aria-pressed`, değişen ad yaklaşımından ayrı tutulur.
- İlişki kuran ARIA özellikleri görünür başlık ve açıklamayı programatik olarak bağlar.

**Kendini yokla:** Bir `<div onClick>` öğesine `role="button"` eklemek hangi eksiği bırakır?  
*Cevap:* Tab, Enter ve Space davranışını kendiliğinden vermez; doğal `<button>` kullanmak daha güvenlidir.

**Kendini yokla:** “Favorilere ekle” adı durum değiştikçe “Favorilerden çıkar” oluyorsa `aria-pressed` neden eklenmemeli?  
*Cevap:* Eylem adı zaten sonucu anlatır; ayrıca basılı durumu bildirmek çelişkili/tekrarlı mesaj üretir.
