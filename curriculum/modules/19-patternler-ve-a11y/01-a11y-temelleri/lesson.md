---
title: "Ekran okuyucu ne görüyor?"
minutes: 17
kind: concept
---

# Ekran okuyucu ne görüyor?

Bir film kartında `onClick` olan bir `span` düşün. Fareyle tıklanabilir görünür; ama Tab ile oraya gelemezsin. Ekran okuyucu da öğenin adını ve ne işe yaradığını çıkaramayabilir. Bu, görünüş ile HTML'in anlattığı şeyin farklı olabildiği küçük ama gerçek bir örnek.

## Önce tarayıcının tanıdığı düğme

HTML'deki **semantik öğe**, görünüşünden bağımsız olarak ne işe yaradığını anlatan öğedir. Örneğin `<button>` bir eylem, `<a href>` başka bir yere gitmek, `<main>` sayfanın ana içeriği demektir. Tarayıcı bu öğelerin klavye davranışını ve temel rolünü zaten bilir.

```tsx check
export function PlayButton({ onPlay }: { onPlay: () => void }) {
  return <button type="button" onClick={onPlay}>Oynat</button>
}
```

Burada tarayıcı rolü `button`, adı görünür metin olan “Oynat” diye anlar. Tab ile düğmeye gelirsin; Enter veya Space ile etkinleştirirsin. Aynı görünüşte bir `span` bu davranışları kendiliğinden kazanmaz. Bu yüzden eylem için gerçek düğme seçmek, daha sonra ARIA ile taklit etmeye çalışmaktan daha az hata çıkarır.

## İkonun ne anlama geldiğini ekle

Şimdi oynatma listesine ekleme kontrolünü düşün. Yalnızca yıldız koyarsak ekran okuyucu yıldız karakterini okuyabilir, ama kullanıcının ne yapacağını söylemeyebilir. Görseli koruyup adı ayrıca verebiliriz:

```tsx check
export function QueueButton({ onAdd }: { onAdd: () => void }) {
  return (
    <button type="button" aria-label="Sıraya ekle" onClick={onAdd}>
      <span aria-hidden="true">＋</span>
    </button>
  )
}
```

`aria-label` düğmenin erişilebilir adını “Sıraya ekle” yapar. `aria-hidden="true"` yalnızca süs olan artı işaretini erişilebilirlik bilgisinden çıkarır; görsel olarak ekranda kalır. Görünür metin varsa çoğunlukla onu ad olarak kullanmak daha iyidir; aynı metni bir de `aria-label` ile tekrarlaman gerekmez.

Tarayıcı HTML'den öğelerin rolünü, adını ve durumunu çıkarıp yardımcı teknolojilere sunduğu bir **erişilebilirlik ağacı** kurar. Ekran okuyucu bu ağacı kullanır; görsel düzenin her pikselini değil, kullanıcının işine yarayan anlam ve ilişkileri duyar. DOM'da metin bulunması, özellikle simge ve gizli içeriklerde, doğru adın çıkacağını tek başına garanti etmez.

![DOM öğesinin rol, erişilebilir ad ve durumu erişilebilirlik ağacına aktarılır](diagrams/erisilebilirlik-agaci.svg "DOM → rol, ad, durum")

## Durum da değişiyorsa

Bir kontrol açılıp kapanabiliyorsa adı ile o anki durumu ayrı ayrı düşün. Örneğin altyazı düğmesinin adı hep “Altyazılar” kalabilir; açık/kapalı bilgisi ise `aria-pressed` ile duyurulur:

```tsx check
export function CaptionsButton({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button type="button" aria-pressed={enabled} onClick={onToggle}>
      Altyazılar
    </button>
  )
}
```

Başlangıçta `enabled` false ise düğme “Altyazılar, basılı değil” anlamını taşır. Kullanıcı etkinleştirince ebeveyn yeni prop gönderir; aynı ad korunur, basılı durumu true olur. `aria-pressed` bir toggle düğmesinin durumunu bildirir; kendisi state değiştirmez. State'i yine React kodun günceller.

Favori gibi bir eylemin adı “Favorilere ekle”den “Favorilerden çıkar”a değişiyorsa, bu da geçerli bir yaklaşımdır. Bu tasarımda `aria-pressed` ekleme: değişen ad eylemi zaten anlatır. Sabit ad + durum veya değişen ad kullan; ikisini karıştırırsan “Favorilerden çıkar, basılı” gibi kafa karıştıran bir anons duyulabilir.

## Görünür başlığı ilişkilendir

Bir dialogun görünen başlığı varsa, onu dialogun adı olarak kullanmak başlık ile anonsu aynı tutar. `useId`, bileşen örnekleri arasında çakışmayan bir id üretir; böylece ilişkiyi sabit ve elle seçilmiş bir id'ye bağlamak zorunda kalmazsın:

```tsx check
import { useId } from 'react'

export function RatingNotice({ message }: { message: string }) {
  const headingId = useId()
  return (
    <section role="dialog" aria-labelledby={headingId}>
      <h2 id={headingId}>Puanın kaydedildi</h2>
      <p>{message}</p>
    </section>
  )
}
```

Başlığın `id` değeri ile `aria-labelledby` birbirine bağlandığı için dialogun adı “Puanın kaydedildi” olur. İkinci bir bildirim eklenirse `useId` her örnek için ayrı değer üretir; iki başlık aynı id'yi paylaşmaz. `aria-describedby` ise dialogun adını değil, ek açıklamasını ilişkilendirmek içindir.

## Rol, ad ve durumla düşün

Örneklerde aynı sorular tekrar ediyor: Bu öğe nedir, kullanıcı onu nasıl ayırt eder, değişen bir durumu var mı? Bunlar rol, erişilebilir ad ve durumdur. Her öğeye ARIA eklemek amaç değildir. Doğal HTML doğru rolü ve davranışı zaten verir; ARIA'yı eksik anlamı tamamlamak için kullan.

Bu yaklaşım **WCAG** (Web Content Accessibility Guidelines) ile uyumlu arayüzler kurmaya yardım eder. WCAG, web içeriğini engelli kişilerin de kullanabilmesi için yayımlanan erişilebilirlik yönergeleridir. Bir düğmenin adının ve durumunun anlaşılır olması bu geniş hedefin küçük, ölçülebilir parçalarından biridir; tek başına WCAG uyumluluğu anlamına gelmez.

Bir öğeyi devre dışı bırakırken doğal `disabled` niteliği hem button etkileşimini durdurur hem durumunu bildirir. `aria-disabled="true"` ise tek başına tıklamayı engellemez; kullanıyorsan davranışı da kodda durdurmalısın. Yalnızca rengi soldurmak klavye davranışını değiştirmez.

## Gerçek bir hata ve düzeltmesi

Bu kod fareyle çalışıyor gibi görünür, ama klavyeyle ulaşmak ve etkinleştirmek mümkün değildir:

```tsx
<span onClick={onPlay}>Oynat</span>
```

Belirti şudur: Tab ile “Oynat”a gelemezsin. Sebebi `span`in etkileşimli bir semantik öğe olmamasıdır. `role="button"` eklemek yalnızca rolü değiştirir; Tab, Enter ve Space davranışlarını eklemez. Düzeltme, eylemi gerçek `<button type="button">` içine almaktır. Bu, hem klavye kullanıcılarına hem ekran okuyucuya tarayıcının yerleşik davranışını verir.

:::mistake[Belirti: ekran okuyucu yalnızca “düğme” diyor]
Simge-only düğmenin anlamlı adı yoktur. Görünür metin ekle ya da simge tek başına kalıyorsa kısa bir `aria-label` ver; dekoratif simgeyi `aria-hidden` yap.
:::

:::mistake[Belirti: “Favorilerden çıkar, basılı” duyuluyor]
Ad değişerek eylemi anlatırken `aria-pressed` ikinci bir durum bildirir ve iki mesaj çelişebilir. Sabit ad + `aria-pressed` veya değişen ad yaklaşımından birini seç.
:::

:::mistake[Belirti: aynı sayfadaki dialoglar aynı başlığa bağlanıyor]
Elle yazılmış sabit id'ler kopyalanınca çakışabilir. `useId` ile her bileşen örneğine ayrı id üret ve başlığı bu id üzerinden bağla.
:::

:::sector
Tasarım sistemlerindeki icon button bileşenleri genellikle anlamlı bir ad ister; böylece simge çizilse bile kontrolün amacı kaybolmaz. Otomatik testler rolü, adı ve temel etkileşimi denetleyebilir. Gerçek ekran okuyucu ve klavye kullanımı ise anonsun bağlamını ve akışını da kontrol eder.
:::

## Özet

- Eylemler için `<button>`, gezinme için `<a href>` gibi semantik öğeleri seç; tarayıcı rol ve klavye davranışını sağlar.
- Erişilebilirlik ağacı rolü, adı, durumu ve anlamlı ilişkileri yardımcı teknolojilere aktarır.
- Simge-only kontrole ad ver; dekoratif simgeyi erişilebilirlik bilgisinden çıkar.
- Toggle'da sabit ad + `aria-pressed` ya da değişen ad kullan; ikisini karıştırma.
- Görünür başlığı `aria-labelledby` ile bağla; örnekler çoğalabiliyorsa `useId` kullan.

**Yeni terimler**

- **Semantik öğe:** Amacını HTML düzeyinde anlatan öğe; doğru klavye davranışını da çoğu zaman tarayıcı sağlar.
- **Erişilebilirlik ağacı:** Tarayıcının yardımcı teknolojilere sunduğu rol, ad, durum ve ilişki bilgileri.
- **WCAG:** Web içeriğinin erişilebilir olması için yayımlanan yönergeler.
- **`useId`:** Bir bileşen örneğinde ilişkilendirme için benzersiz id üretmeye yarayan React Hook'u.

**Kendini yokla:** `role="button"` eklenmiş bir `span` neden gerçek button kadar kullanışlı değildir?

*Cevap:* Rolü anlatır ama Tab, Enter ve Space davranışlarını kendiliğinden eklemez.

**Kendini yokla:** Bir toggle'ın adı “Altyazılar” olarak sabitse hangi bilgi durum değiştikçe güncellenir?

*Cevap:* `aria-pressed` değeri; adı sabit kalır, React state'i yine uygulama günceller.
