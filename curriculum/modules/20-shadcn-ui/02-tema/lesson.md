---
title: "Tema: aynı rol, iki görünüm"
minutes: 12
kind: concept
---

# Tema: aynı rol, iki görünüm

:::pain[Problem]
Sinema'nın birincil düğmesi açık temada okunuyor. Koyu temaya geçince arka plan açılıyor ama beyaz metinle kontrastı azalıyor; aynı sabit gri sınıfı da modal ve kartlarda marka renginden kopuk duruyor.
:::

## Renk değeri yerine yüzeyin rolünü adlandır

Bir bileşen `bg-zinc-900 text-white` derse hem hangi rengi istediğini hem de açık/koyu zemindeki görünümünü kendi içine gömer. Bu karar her kartta tekrarlanır. Semantik token kullanan bileşen ise `bg-card text-card-foreground` der: “kart yüzeyini ve onun üzerinde okunacak metni ver.” Değerler merkezi CSS'te durduğu için tema değişikliği bileşen sınıflarını değiştirmez.

:::model[Tema token'ları]
4. modülde `@theme` ile utility sınıflarını CSS değişkenlerine bağladın. Burada aynı kuralı daha anlamsal adlarla kullan: component yüzey rolünü, CSS ise o rolün tema içindeki rengini bilir. Arka plan ve üstündeki metin token'ları çift olarak değişir.
:::

Kural seti şöyle:

1. **Rolü bileşende seç.** Kart `card`, birincil eylem `primary`, hata durumu `destructive` rolünü kullanır.
2. **Değeri tema katmanında tanımla.** `:root` açık tema değerlerini taşır; `.dark` aynı custom property adları için koyu tema değerlerini verir.
3. **Yüzey ve metni birlikte eşleştir.** `--card` ile `--card-foreground` aynı yüzey çiftidir. Sayfanın özel çifti `--background` ve `--foreground` olarak adlandırılır.
4. **Tema kapsamını portalı da içine alacak yere koy.** `.dark` sınıfı dialog portalının atasındaysa token'lar portala miras kalır; sadece uygulama içindeki bir `div` üzerinde kalırsa `document.body` altındaki portal dışında kalabilir.
5. **Algısal bir kontrolü kontrast testi sanma.** OKLCH lightness farkı zayıf çiftleri işaret edebilir ama WCAG oranının yerine geçmez; gerçek foreground/background çiftini kontrast aracıyla ölç.

```css title="src/index.css"
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --card: oklch(0.98 0.01 250);
  --card-foreground: oklch(0.2 0.02 250);
  --primary: oklch(0.52 0.18 250);
  --primary-foreground: oklch(0.98 0 0);
}

.dark {
  --card: oklch(0.25 0.02 250);
  --card-foreground: oklch(0.94 0.01 250);
  --primary: oklch(0.76 0.13 250);
  --primary-foreground: oklch(0.18 0.02 250);
}

@theme inline {
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

`@theme inline` Tailwind utility adını CSS custom property'ye bağlar. JSX'te `bg-card` ve `text-card-foreground` çıktısı aynı adlandırma düzenini izler. OKLCH'deki `L` değeri algısal açıklığı yaklaşık 0 (siyaha yakın) ile 1 (beyaza yakın) arasında belirtir; `C` yoğunluğu, `H` tonu belirtir. Bu değerler tasarım kararıdır; eşit lightness farkı her renk ailesinde eşit kontrast anlamına gelmez.

CSS custom property'leri miras alınır. Bir kartın içindeki başlık ayrı token tanımı yapmadıysa, kartın atalarından gelen değişkeni kullanır. Bu durum alt bileşenleri sabit renklerden kurtarır; fakat token'ı yanlış DOM kapsamına koyarsan sonuç da tüm alt ağaç için yanlış olur. Portal davranışı bu yüzden yalnız teorik bir ayrıntı değildir: dialogun DOM'daki atası tema sınıfını gerçekten taşımalıdır.

Token eklerken önce tasarım rolünü tanımla, ardından hem aydınlık hem karanlık değerini birlikte değiştir. Marka rengini `primary` olarak kullanan kartı `card` rolüne çevirmek doğru çözüm değildir; yüzey rolü ile etkileşim vurgusu farklı sorulara yanıt verir. Aynı şekilde disabled görünümü için yüzey token'ını değiştirmek yerine component'in durum stilini tasarla. Semantik token sözlüğü büyüdükçe anlamları tutarlı kalmalı; her sayfa kendi token adını icat ederse merkezi tema tekrar dağılır.

## Koyu sınıfın kapsamını izleyelim

Portal bileşeni DOM'da tetikleyicinin bulunduğu kartın altına değil, genellikle `document.body` altına yerleşir. `.dark` sınıfının bulunduğu atayı takip et:

| DOM yeri | `.dark` nerede? | `--card` hangi değer? |
| --- | --- | --- |
| Kart | `html` üzerinde | Koyu tema değeri |
| Dialog portalı | `html` üzerinde | Koyu tema değeri |
| Kart | yalnız `#app` üzerinde | Koyu tema değeri |
| Dialog portalı | yalnız `#app` üzerinde | Kök/açık tema değeri |

Bu yüzden tema sınıfını uygulama köküne değil `document.documentElement`'e uygulamak, `body` altındaki portalı da kapsar. Tema yüklenirken yanlış renk parlaması oluyorsa sınıfı uygulamanın ilk çiziminden önce ayarlamak gerekir; effect ile sonradan eklemek kısa bir açık tema karesi gösterebilir.

## İz sürme: class'tan piksele

Render edilen kartın sınıfları `bg-card text-card-foreground` olsun. Tarayıcı bu utility adlarını CSS kuralına eşler. Kural `var(--card)` ve `var(--card-foreground)` okur. Ardından DOM ağacında ilgili öğenin üstlerine çıkarak her değişken için en yakın tanımı bulur. Tema sınıfı `html` üzerinde `.dark` seçicisini etkinleştiriyorsa, koyu değerler kullanılır. Tema değişince yalnız custom property değerleri değişir; kartın JSX'i ve rol adı aynı kalır.

Bu model sayısal bir ön kontrolü de mümkün kılar. Bir renk çifti için lightness `L₁` ve `L₂` ise fark `|L₁ - L₂|` hesaplanır. Eşik altındaki fark, insanın daha yakından incelemesi için uyarıdır. Renk kanalları, alpha, yazı boyutu ve gerçek luminance hesabı dahil olmadığı için “geçti” sonucunu erişilebilirlik onayı gibi yorumlama.

## Önce kırık, sonra doğru

Kırık kart, tek temaya ait değerleri bileşene sabitler:

```tsx
function ShelfCard({ title }: { title: string }) {
  return <article className="rounded-lg bg-zinc-900 text-white">{title}</article>
}
```

Koyu temada uygun görünse de açık tema için ayrı bir rol seçimi yoktur. Her kartın rengini ayrı override etmek bu bilgiyi dağıtır.

Doğru yönde, kart rolü CSS teması tarafından çözülür ve gelen ek utility'ler çakışmayı bilinçli yönetir:

```tsx check
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function classes(...values: string[]) {
  return twMerge(clsx(values))
}

export function ShelfCard({ title, className }: { title: string; className?: string }) {
  return (
    <article className={classes('rounded-lg bg-card text-card-foreground', className ?? '')}>
      <h2>{title}</h2>
    </article>
  )
}
```

`clsx` koşullu değerleri birleştirir; `tailwind-merge` aynı utility grubundaki çelişen sınıfları çözer. `className="rounded-none"` verilince son değer varsayılan `rounded-lg` yerine geçer. Token rolünü dışarıdan rastgele hex ile değiştirmek yerine, layout override gibi yerel kararlara izin ver.

## Sınır durumları ve sık hatalar

:::mistake[Metin tonu temayla ayrışıyor]
Belirti → Koyu primary yüzeyde yazı kayboluyor. Neden → Yalnız `--primary` değişmiş, `--primary-foreground` açık renkte kalmış. Düzeltme → Yüzey ve metin token'ını aynı temada birlikte ayarla; sonra kontrastı ölç.
:::

:::mistake[Dialog açık temada kalıyor]
Belirti → Sayfa koyu, dialog veya menü açık renkte. Neden → `.dark` sadece portalın dışında kalan bir `div` üzerinde. Düzeltme → Tema sınıfını `<html>` öğesinde tut.
:::

:::mistake[Token kontrolü geçiyor, kontrast düşük]
Belirti → Lightness farkı yüksek olduğu halde küçük metin okunmuyor. Neden → OKLCH lightness farkı WCAG contrast ratio değildir ve font ölçüsünü hesaba katmaz. Düzeltme → Tarayıcı erişilebilirlik araçlarında metin/zemin çiftini ayrıca denetle.
:::

:::mistake[Utility override çalışmıyor]
Belirti → `rounded-none` eklendi ama kartın köşesi değişmedi. Neden → Sınıflar birleştirildi ama çakışma çözümü yapılmadı; CSS üretim sırası beklenmedik sonucu verdi. Düzeltme → Projedeki `cn` yardımcısının `tailwind-merge` kullandığını doğrula.
:::

Bir token değişikliği öncesinde ve sonrasında aynı üç görünümü karşılaştır: normal kart, üzerinde primary eylem bulunan kart ve hata durumu içeren form alanı. Bu örnekler farklı rollerin yanlışlıkla aynı renge bağlanıp bağlanmadığını gösterir. Tarayıcı zoom'unu artırıp küçük metni de kontrol et; geniş ekranda rahat görünen düşük kontrastlı yazı, büyütülmüş ya da düşük kaliteli ekranda okunmaz hale gelebilir. Renk tek geri bildirim olmamalı: hata için metin veya simge, seçili durum için biçim gibi ek işaretler kullan.

:::sector
Tasarım sistemlerinde token adı marka rengini değil bileşenin rolünü anlatır. Tasarımcı “kart yüzeyini biraz koyulaştır” dediğinde ekip tek token çiftini değiştirip tüm temaları inceler. Pull request incelemesinde token değişikliği kontrast ölçümü ve açık/koyu ekran görüntüsüyle değerlendirilir.
:::

## Özet

- Component sınıfı rolü söyler; CSS custom property rolün tema değerini verir.
- Her yüzeyin metin rengiyle birlikte değişen eş token'ı vardır.
- Portalın temayı görmesi için `.dark` ortak DOM atasına, çoğunlukla `<html>` öğesine konur.
- `cn` sınıfları birleştirir ve çakışan utility'leri çözer.
- OKLCH lightness kontrolü yalnız uyarıdır; gerçek kontrast ayrıca ölçülür.

Kendini yokla: `.dark` sadece uygulama `div`'indeyken `body` portalı neden açık kalabilir? Cevap: Portal o `div`'in çocuğu değildir, dolayısıyla onun custom property kapsamını miras almaz.

Kendini yokla: `--primary` değişirken hangi değeri de kontrol edersin? Cevap: Metin rolünü tanımlayan `--primary-foreground` değerini ve ikisinin gerçek kontrastını.
