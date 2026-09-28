---
title: "Bileşen API'sini kullanım yerine göre tasarla"
minutes: 17
kind: concept
---

# Bileşen API'sini kullanım yerine göre tasarla

:::pain[Problem]
Bildirim paneline `showTitle`, `showCount`, `showIcon`, `titleColor`, `emptyText`, `showFooter` ve `showDismiss` prop'ları ekledin. Bir ekranda boş durum çizimi, diğerinde yardım bağlantısı istenince yine `if (pathname...)` yazıyorsun. Kullanım yeri panelin ne göstereceğini değiştiremiyor.
:::

## Props, composition ve state sahipliği

Bir component'in API'si, başka bir component'in ona nasıl talimat vereceğini belirler. İyi API, yalnız kısa prop listesi değildir; çağrı yerinde okunan anlam, geçerli kombinasyonlar ve state'in sahibi açık olmalıdır. Sabit değer prop'la, serbest içerik composition ile, dışarıdan değişmesi gereken seçim controlled API ile modellenebilir.

![Controlled durumda değerin dış owner'dan geldiğini, uncontrolled durumda içeride yaşadığını gösteren diyagram](diagrams/state-sahipligi.svg)

Kesin kurallar:

1. **Kararlı, isimli seçenekleri prop olarak sun.** Başlık, ölçü (`size`), etiket veya `disabled` gibi anlamı açık veri component API'sidir.
2. **Serbest içerik için JSX composition kullan.** Bir kullanım yeri yardım bağlantısı, diğeri boş durum çizimi koyacaksa bütün ihtimalleri boolean prop'a çevirmek yerine `children` ya da adlandırılmış slot al.
3. **State'in sahibi dışarıdaysa controlled API kur.** `value`/`onValueChange` gibi çiftte dış değer görünümü belirler; component kullanıcı etkileşimiyle sahibine değişiklik isteği yollar.
4. **State yalnız component'e aitse uncontrolled API sun.** `defaultValue` başlangıç değeridir; component sonraki değişimleri kendi state'inde tutar. Dışarıdan sonradan değişen değer beklenmez.
5. **Controlled ve uncontrolled sahipliği aynı anda etkinleştirme.** `value` ile `defaultValue` birlikte kabul edilecekse davranışını açıkça tanımla; çoğu küçük component tek modu seçmeyi daha anlaşılır kılar.
6. **Controlled callback tek başına görünümü değiştirmez.** Dış owner yeni prop yollayana kadar component'in gösterdiği değer aynı kalır. Bu, parent'ın URL, form state veya başka bir kuralı uygulamasına izin verir.
7. **HTML semantiğini ve erişilebilir durum bilgisini koru.** `button` düğme olarak, seçilebilir alan doğru label ile görünür; genişletilebilir yüzey `aria-expanded` gibi gerçek durumu bildirir.

## Bildirim panelinin açılmasını izle

Örnekte “son olaylar” paneli normalde kendi içinde açılıp kapanır; ayarlar sayfası ise açılma durumunu URL'ye bağlamak ister. İki yerde aynı component'i kullanırken kimin state tutacağını açık seç:

| Kullanım | State sahibi | Component'e verilen değer | Tıklama sonrası |
| --- | --- | --- | --- |
| Sıradan dashboard | Panel | `defaultOpen={false}` | İç state tersine döner |
| Ayarlar sayfası | Sayfa/URL | `open={isOpen}` | Callback değişiklik ister |
| Salt içerik varyasyonu | Çağrı yeri | `children` | Panel state'i değişmez |

Composition, “her olasılığa prop” yaklaşımından farklı bir sözleşme kurar:

```tsx check
import { useState, type ReactNode } from 'react'

type DetailsPanelProps = {
  title: string
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (nextOpen: boolean) => void
}

export function DetailsPanel({
  title,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}: DetailsPanelProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const controlled = open !== undefined
  const visible = controlled ? open : internalOpen

  function toggle() {
    const next = !visible
    if (!controlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <section>
      <h2>
        <button type="button" aria-expanded={visible} onClick={toggle}>{title}</button>
      </h2>
      {visible ? children : null}
    </section>
  )
}
```

`children` herhangi bir node alır; component o içeriğin film listesi mi, açıklama mı olduğunu bilmiyor. Button `aria-expanded` değerini gerçek görünür durumdan hesaplar. `open` prop'u verilmişse component yalnız callback ile sahibine haber verir. Parent tekrar render edip `open`'u değiştirmeden görünüm sabit kalır. `open={false}` de kontrollü bir seçimdir; `undefined` kontrol edilmesi `false` değerinin yanlışlıkla uncontrolled sayılmasını önler.

## Boolean prop birikimini önce kır

Birçok varyantı ayrı bayraklarla ifade edince geçersiz kombinasyonlar oluşabilir:

```tsx
<Panel showEmptyArt showHelpLink showFooter={false} showDismiss />
```

Bu satırın kaç durumu geçerli? Boş içerik yokken `showEmptyArt` açık olabilir; yardım linki ama footer kapalı olması anlamlı mı? Her yeni varyant kombinasyon sayısını artırır. `children` çağrı yerinde gerçek içeriği taşır; sabit seçenekler ise açık prop olarak kalabilir.

Uncontrolled text input'ın `defaultValue`'su yalnız başlangıç içindir. Sayfa geri tuşuyla URL'den yeni bir arama metni yüklediğinde component dış değerini dinlemiyorsa alan eski metni tutabilir. Değer URL/form sahibine aitse `value` ve `onChange` ile controlled sözleşme kur. Parent her render'da `value`yı sağlar, input değişince callback ile yeni değeri alıp sahibinde günceller.

Her input'u controlled yapmak da otomatik olarak daha iyi değildir. Basit, formdan bağımsız bir açıklama panelinin kendi açık durumu component'e ait olabilir. Önemli olan iki kaynak yaratmamak: controlled kullanımda internal state değerini UI'ın alternatif doğruluk kaynağı yapma; uncontrolled kullanımda `defaultValue`'nun sonradan değişeceğini vaat etme.

Component'in kontrollü olup olmadığını belirleyen şey prop'un tipi değil, owner'ın kim olduğu ve update anlaşmasıdır. Örneğin sort dropdown dışarıdan seçimi alıyorsa kullanıcı seçince onChange('title') çağırır; parent URL'yi güncelleyip yeni seçimi geri verir. Parent seçimi reddedebilir, yetki kontrolü uygulayabilir veya başka filtrelerle birlikte güncelleyebilir. Bu turda dropdown kendi değerini değiştirmez; aldığı prop değişene kadar aynı seçenek görünür.

Uncontrolled kullanım, dışarıda senkron tutma gereği olmayan küçük disclosure veya menü durumunda daha az bağlayıcıdır. defaultOpen yalnız ilk render'da başlangıç belirler. Sonradan default prop değişse bile local state'i resetlemez; bu React'in useState(initialValue) davranışıyla aynıdır. Eğer yeni kayıt seçildiğinde form sıfırlanmalıysa bunu açık reset key'i veya controlled prop üzerinden tasarla, default'u sihirli biçimde takip ediyor sanma.

Composition API'si de kullanım yerinin sorumluluğunu korur. Container başlık, padding veya open/close davranışını yönetirken children kendi içeriğiyle ilgilenir. Slot sayısı çok artarsa header, footer gibi isimli slotlar okunabilirliği artırır; tek serbest alan için children genellikle yeterlidir. Public API yeni varyant geldikçe büyüyorsa önce içeriğin gerçekten sabit config mi yoksa çağrı yerine ait JSX mi olduğunu sor.

## Sınır durumları ve sık hatalar

:::mistake[Belirti: parent `open` değerini değiştirmeden panel açıldı]
**Belirti →** Controlled görünmesi gereken panel tıklayınca kendi görünümünü değiştiriyor. **Neden →** Callback'in yanında internal state de güncellenmiş. **Düzeltme →** `open !== undefined` ile modu seç; controlled modda yalnız callback çağır.
:::

:::mistake[Belirti: panel URL geri tuşunu izlemiyor]
**Belirti →** URL'de kapalıyken panel açık kalıyor. **Neden →** Yalnız `defaultOpen` verilmiş; default prop sonraki render'ları kontrol etmez. **Düzeltme →** Değer dış kaynağa aitse `open`/`onOpenChange` çifti kullan.
:::

:::mistake[Belirti: button açık olmasına rağmen ekran okuyucu kapalı diyor]
**Belirti →** Görselde bölüm açık, `aria-expanded="false"`. **Neden →** ARIA değeri başka state değişkeninden hesaplanmış. **Düzeltme →** Tek `visible` kararını hem render hem `aria-expanded` için kullan.
:::

:::mistake[Belirti: yeni varyant için component'e route koşulu eklendi]
**Belirti →** Genel panel URL yolunu okuyup özel footer seçiyor. **Neden →** Çağrı yeri sahip olması gereken içeriği component içine taşımış. **Düzeltme →** Özel içeriği `children` veya named slot ile dışarıdan ver.
:::

:::mistake[Belirti: başlık rengi değişti ama API karmaşıklaştı]
**Belirti →** Her stil ayrıntısı için boolean prop isteniyor. **Neden →** Kullanımın anlamı yerine iç markup'ın tüm kombinasyonları API'ye açılmış. **Düzeltme →** Ürün açısından gerçek varyantları küçük bir union/config altında tut; serbest içerikse composition seç.
:::

:::sector
Tasarım sistemi ekipleri component API'sinde controlled/uncontrolled seçenekleri ve composition noktalarını belgeler. Bu, uygulama ekibinin sayfa özelindeki state sahibini korurken görsel parçayı tekrar kullanmasını sağlar. API review'da geçerli durum kombinasyonları ve keyboard/ARIA davranışı props sayısından daha önemlidir.
:::

## Özet

- Sabit ayarı isimli prop ile, serbest JSX'i composition ile aktar.
- Dış owner varsa controlled `value`/callback; yerel etkileşimse uncontrolled default seç.
- Controlled değerin sahibi dışarıdadır; callback görünümü tek başına değiştirmez.
- `false` değerini kontrollü seçim, `undefined` değerini mod belirleyici olarak ayırt et.
- Görsel state ile `aria-expanded` aynı kaynaktan türesin.

**Kendini yokla:** URL değişince input da güncellenecek. `defaultValue` yeterli mi?  
*Cevap:* Hayır. URL state'i dış owner yapıp `value`/`onChange` controlled API kullan.

**Kendini yokla:** Her sayfa içeriği tamamen farklı bir panelde hangi API uygundur?  
*Cevap:* `children` veya named slot ile composition; her içerik için yeni boolean prop ekleme.
