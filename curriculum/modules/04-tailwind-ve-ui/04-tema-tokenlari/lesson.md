---
title: "Tema token'larıyla ortak karar"
minutes: 16
kind: concept
---

# Tema token'larıyla ortak karar

Sinema’daki poster başlıklarında kullandığın `text-sky-700` gibi class’lar, Tailwind’in hazır renklerinden birini seçer. Marka mavisi değişince bu class’ı farklı dosyalarda tek tek aramak istemezsin. Aynı tasarım kararını bir adla tanımlayıp, rengi değiştiğinde o adı kullanan yerleri olduğu gibi bırakabilirsin.

Bu ortak tasarım kararına **design token** denir: renk veya font gibi tekrar kullanılan bir değere anlamlı isim verir; böylece ne olduğunu ve nereden değişeceğini bilirsin. Tailwind v4’te `@theme`, bu isimleri Tailwind’in anlayacağı **namespace** denilen ad alanlarında tanımlar.

![Tasarım token'ından Tailwind utility'sine giden yol](diagrams/token-zinciri.svg)

## Önce tek bir renk adlandıralım

Bir başlığın renk class’ını Sinema markasının rengine bağlayalım. İlk adımda yalnız CSS’e bir renk adı ekliyoruz:

```css title="src/styles.css"
@import "tailwindcss";

@theme {
  --color-brand-700: #075985;
}
```

Burada `--color-` bölümü Tailwind’e bunun bir renk token’ı olduğunu söyler. Bu tanımdan `text-brand-700` metin rengi utility’si oluşur; **utility**, bir CSS kararını kısa bir class adıyla kullanmanı sağlayan Tailwind class’ıdır.

```tsx check
export function MovieTitle() {
  return <h2 className="text-brand-700">Kayıp Şehir</h2>
}
```

Başlıkta `text-brand-700` kullanınca metin `#075985` rengini alır. Aynı adı başka bir Sinema başlığında da kullanırsan, ikisi de ortak rengi paylaşır. Rengin nereden geldiği artık başlığın JSX’inde değil, CSS’te görülebilir.

## Bir isimden palete geçelim

Şimdi tek rengi biraz büyütüp marka renginin açık zemindeki metin ve koyu zemindeki metin için iki ton tanımlayalım. Her token adı hâlâ renktir; sondaki `700` ve `300` tasarım paletindeki ton adlarıdır.

```css title="src/styles.css"
@import "tailwindcss";

@theme {
  --color-brand-700: #075985;
  --color-brand-300: #7dd3fc;
  --font-display: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

`--font-display` de bir font ailesi tanımlar; Tailwind bunu `font-display` class’ına bağlar. Şimdi bölüm başlığında fontu ve rengi kullanabiliriz:

```tsx check
export function CollectionHeading() {
  return <h2 className="font-display text-brand-700">Bu haftanın seçkisi</h2>
}
```

İki class, iki ayrı tasarım kararını adla anlatıyor: `font-display` yazı ailesini, `text-brand-700` metin rengini seçiyor. Font token’ı font dosyasını indirmez; yalnızca font ailesinin adını kullanım class’ına bağlar. Gerçek font dosyasını yüklemek başka bir iştir.

CSS variable, CSS içinde saklanan ve başka kurallarda kullanılabilen bir değerdir. Örneğin `--brand-blue` diye sıradan bir variable tanımlayabilirsin; ama bu ad kendi başına `bg-brand-blue` utility’si üretmez. `@theme` içindeki `--color-*` ve `--font-*` adları Tailwind’e hangi utility’leri üretmesi gerektiğini söyler.

## Başlık ekrana gelirken hangi katman ne yapar?

Utility class’ın ekranda renge dönüşmesi birkaç ayrı adımda olur. Bu sırayı bilmek, class JSX’te durduğu hâlde rengin neden görünmediğini anlamana yardım eder.

| Adım | Ne olur? | Örneğimizde |
|---|---|---|
| CSS hazırlanırken | Tailwind kaynak class’larını bulup CSS kuralları üretir. | `text-brand-700` için kural çıkar. |
| React render ederken | React class adını öğeye yazar. | `<h2>` üzerinde `text-brand-700` olur. |
| Tarayıcı stili hesaplarken | CSS değişkeni gerçek değere çözülür. | `#075985` bulunur. |
| Tarayıcı çizerken | Çözülmüş stil ekranda görünür. | Başlık mavi görünür. |

Birinci satırdaki adım uygulamanın CSS’i hazırlanırken, yani build sırasında olur; son iki adım tarayıcıda gerçekleşir. Bu yüzden TypeScript class adının bir utility’ye karşılık geldiğini denetlemez: class yazımı geçerli görünse bile üretilmiş CSS’te eşleşen kural yoksa tarayıcı renk uygulamaz.

## Tema değişince class neden aynı kalabilir?

Bir **CSS custom property**—CSS variable için kullanılan standart ad—kapsamına göre farklı değer alabilir. `:root` genel belgeyi, `.dark` ise o class’ın bulunduğu öğeyi ve onun altındaki öğeleri kapsar. Aynı rengi iki kapsamda farklı verirsek, başlığın class adını değiştirmeden değerini değiştirebiliriz:

```css title="src/styles.css"
@import "tailwindcss";

@theme {
  --color-brand: #075985;
}

.dark {
  --color-brand: #7dd3fc;
}
```

```tsx check
export function NowShowingTitle() {
  return <h2 className="text-brand">Şimdi gösterimde</h2>
}
```

`text-brand` class’ı iki temada da aynıdır. Sayfanın üstündeki öğeye `.dark` geldiğinde, başlık bu kapsam içindeyse `--color-brand` için koyu tema değerini alır. Tema durumunu seçmek başka bir katmanın işidir; bu CSS yalnız seçilmiş temada hangi rengin kullanılacağını belirler.

| Durum | Başlıktaki class | Kullanılan değer |
|---|---|---|
| `.dark` yok | `text-brand` | `#075985` |
| Atada `.dark` var | `text-brand` | `#7dd3fc` |

Sinema’nın theme CSS’inde `.dark` class’ına bağlı `dark:` varyantı tanımlıdır; bu önek, ardından gelen class’ı koyu tema bağlamında uygular. İstersen değişken değerini aynı class altında değiştirebilirsin; istersen `dark:text-brand-300` yazarak koyu temada kullanılacak tonu açıkça seçebilirsin.

## Sinema başlığında yanlış rengi bul

Sık rastlanan hata, Tailwind’in özel ad alanı yerine rastgele isimli bir CSS variable yazmaktır:

```css
:root {
  --brand-blue: #075985;
}
```

Sonra JSX’te `bg-brand-blue` yazarsan, Tailwind bu eşleşmeden otomatik utility üretmez. Belirti, class’ın DOM’da görünmesine rağmen arka planın değişmemesidir. Rengin ortak bir Tailwind utility’si olmasını istiyorsan token’ı `@theme` içinde `--color-brand-blue` olarak adlandır; böylece `bg-brand-blue` ve `text-brand-blue` anlamlı karşılık bulur.

Benzer görünen iki renk her zaman aynı token’ı kullanmak zorunda değildir. Biri marka başlığında, öteki koyu bir butonun arka planındaysa metin kontrastı nedeniyle farklı değerler seçmen gerekebilir. Token adı ham rengi değil kullanım rolünü anlatır; rol gerçekten ortaksa paylaşmak değişikliği kolaylaştırır.

:::mistake[Belirti → neden → düzeltme]
`text-brand-700` ekranda rengi değiştirmiyor → `--brand-700` gibi Tailwind namespace'i olmayan bir variable tanımlanmış → `@theme` içinde `--color-brand-700` tanımla ve oluşturulan class adını kontrol et.
:::

:::mistake[Belirti → neden → düzeltme]
Bir tema değişikliğinde başlıkların bir kısmı eski renkte kalıyor → bazı kullanımlar token yerine sabit hazır renk class’ı taşıyor → ortak marka rolü olan yerlerde aynı token class’ını kullan.
:::

Her küçük aralık veya tek kullanımlık dekorasyon için token açmak da iyi bir çözüm değildir. Bir değer birden fazla yerde aynı tasarım kararını temsil ediyorsa veya tasarım dilinde bir adı varsa token fayda sağlar; aksi hâlde yeni adlar aramayı zorlaştırır.

:::info[Derinlemesine (isteğe bağlı)]
Tailwind v4’te `@utility` ile özel utility de tanımlayabilirsin. Bu, tekrar kullanılan CSS davranışına class adı verir; `@theme` ise renk veya font gibi tasarım değerini ve ondan üretilecek utility adlarını tanımlar. Tek yerde kullanılan iki CSS bildirimi için özel utility açmak çoğu zaman gereksizdir.
:::

## Özet

- Design token, tekrar kullanılan tasarım değerini anlamlı bir adla paylaşır.
- `@theme` içindeki `--color-*` renk, `--font-*` font utility’lerine bağlanır.
- JSX class adını verir; Tailwind CSS kuralını üretir, tarayıcı değişkenin değerini çözüp çizer.
- CSS variable kapsamı, `.dark` gibi bir üst öğede değişebilir; JSX class’ı aynı kalabilir.

**Yeni terimler**

- **Design token:** Tasarımda tekrar kullanılan değerin anlamlı adı.
- **Namespace:** İlgili değer türlerini adlandıran ad alanı; Tailwind’de `--color-*` gibi.
- **Utility:** CSS kararını kısa bir Tailwind class’ıyla kullanma yolu.
- **CSS custom property:** CSS içinde saklanıp kapsama göre kullanılabilen değişken değer.

**Kendini yokla:** `@theme` içinde `--color-brand-700` varsa `text-brand-700` neyi değiştirir? Metin rengini.

**Kendini yokla:** `.dark` başlıkta `text-brand` varken neyi değiştirebilir? Başlığın kullandığı `--color-brand` değerini; class adını değil.
