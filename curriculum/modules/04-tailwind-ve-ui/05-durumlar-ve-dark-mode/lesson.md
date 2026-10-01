---
title: "Etkileşim durumlarını ve temayı göster"
minutes: 16
kind: concept
---

# Etkileşim durumlarını ve temayı göster

Bir React `<button>` bileşenine zaten `className` verip görünümünü düzenleyebiliyorsun. Örneğin `hover:bg-sky-800`, imleç butonun üstündeyken arka plan rengini değiştirir. `hover:` bir Tailwind **state variant**’ıdır: belirli bir durum gerçekleştiğinde class’ı uygular; butona tıklamaz ve React state’ini değiştirmez.

## Fareyle üzerine gelince

Önce yalnızca fareyle görülen bir değişikliği ekleyelim:

```tsx check
export function TrailerButton() {
  return <button className="rounded-lg bg-sky-700 px-3 py-2 text-white hover:bg-sky-800">Fragmanı izle</button>
}
```

İmleç butonun üstünde değilken `bg-sky-700`, üstündeyken `hover:bg-sky-800` görünür. Bu küçük işaret fare kullanan kişiye geri bildirim verir; fakat klavyeyle gezen biri hover kullanmadığı için henüz butonun yerini göremez.

## Klavye odağını ve gerçek durumu ekle

![Etkileşim durumu ile onu gösteren Tailwind class'larının ilişkisi](diagrams/durum-ve-gorunum.svg)

Klavye kullanan biri Tab ile sayfadaki öğeler arasında ilerler. Bir öğenin klavyeyle seçilmiş olmasına **focus** denir; `focus-visible:` bu durumda görünen bir işaret çizer. Aynı buton bir eylem için kullanılamıyorsa yalnızca soluk görünmesi yetmez: HTML’in `disabled` niteliği tıklamayı gerçekten kapatır.

```tsx check
type ScreeningButtonProps = { disabled?: boolean }

export function ScreeningButton({ disabled = false }: ScreeningButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="rounded-lg bg-indigo-700 px-3 py-2 text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Seans bilgisini aç
    </button>
  )
}
```

Şimdi iki ayrı şey oldu: `disabled` gerçek HTML davranışını, `disabled:opacity-50` bu davranışın görünüşünü belirliyor. `focus-visible:outline-*` ise klavye odağında bir halka gösteriyor. Sadece `opacity-50` yazsaydık buton soluk görünür ama çalışmaya devam ederdi; CSS görünümü HTML davranışının yerine geçmez.

Bir düğmenin aç/kapat türü seçili durumu varsa bu durumu HTML’e `aria-pressed` ile bildirebilirsin. **ARIA attribute**, öğenin durumunu ekran okuyucu gibi yardımcı araçlara anlatan bir HTML bilgisidir. Örneğin `aria-pressed={selected}` seçili bir kontrolün açık olduğunu söyler; kendiliğinden state güncellemez ve rengi de değiştirmez.

## Üç ayrı durumu izleyelim

Bir butonun üstünde olma, klavye odağı ve devre dışı olma durumları birbirinin yerine geçmez. Hangilerinin etkin olduğunu adım adım düşünelim:

| An | Gerçek DOM durumu | Uygulanan class ailesi | Görünen sonuç |
|---|---|---|---|
| Sayfa ilk açıldı | Odak yok, etkin | Temel class’lar | Normal buton |
| İmleç üstünde | Hover | `hover:*` | Hover rengi |
| Tab ile butonda | Focus görünür | `focus-visible:*` | Odak halkası |
| `disabled` true | HTML niteliği var | `disabled:*` | Soluk görünüm; tıklama kapalı |

Son satırda belirleyici olan class değil, DOM’daki `disabled` niteliğidir. Benzer biçimde `aria-pressed` durumu bildirir ama React’teki state’i değiştirmez; tıklamaya ne olacağını bileşen veya onu kullanan kod belirler.

## Koyu tema hangi kararı değiştirir?

Önceki derste tema değerini `@theme` token’ıyla adlandırdın. Koyu tema için `dark:` state variant’ı, aynı öğede başka renk utility’si seçebilir. Tailwind v4’te `.dark` class’ına göre çalışan bu varyantı CSS’te tanımlarsın:

```css title="src/theme.css"
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

```tsx check
export function NextScreeningButton() {
  return (
      <button className="rounded-lg bg-indigo-700 px-3 py-2 text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-amber-300 dark:bg-slate-800 dark:text-slate-100">
      Seans saatlerini gör
    </button>
  )
}
```

`.dark` atası olmayan butonda temel `bg-sky-700` rengi görünür. Uygun bir üst öğeye `.dark` eklendiğinde `dark:bg-sky-500` ve `dark:text-slate-950` çalışır. Değişen şey görsel kuraldır; `dark:` kullanmak kullanıcının tercihini saklamaz veya `.dark` class’ını kendiliğinden eklemez.

| Koşul | Butonda seçilen zemin | Kararı kim verir? |
|---|---|---|
| Koyu tema yok | `bg-indigo-700` | Temel utility |
| Atada `.dark` var | `dark:bg-slate-800` | `dark:` varyantı |

Metin ve zemin renklerini birlikte seç. Koyu temada arka planı açıp beyaz metni aynen bırakırsan okunabilirlik azalabilir; Tailwind seçtiğin renklerin yeterli kontrastta olup olmadığını senin yerine ölçmez. Aynı kontrolü odak halkası için de yap: iki temada da çevresinden ayırt edilebilsin.

## Gerçek bir hata ve düzeltmesi

Şöyle yazılmış bir buton soluk görünüyor ve mouse üzerine gelince koyulaşıyor:

```tsx
export function BrokenScreeningButton() {
  return <button className="hover:bg-sky-800 opacity-50">Seans bilgisini aç</button>
}
```

Ama bu kod ne klavye odağı gösterir ne de etkileşimi kapatır. `opacity-50` yalnız görseli soldurur. Eğer buton gerçekten kullanılamıyorsa `disabled` niteliğini ekle; klavye odağı için de görünür `focus-visible:` class’ı bırak. Böylece belirtiye göre doğru katmanı düzeltmiş olursun.

Bir başka sık hata, görünen class’ı HTML davranışı sanmaktır. `disabled:opacity-50` class’ı DOM’da bulunabilir ama `disabled` prop’u false ise tıklama hâlâ çalışır. `aria-pressed="false"` gibi metin de boolean yerine string vermek olur; JSX’te durumu `{selected}` gibi boolean olarak aktar.

:::mistake[Belirti → neden → düzeltme]
Buton disabled gibi görünüyor ama tıklanıyor → yalnız opacity class’ı eklenmiş → gerçek `disabled` prop’unu HTML butonuna ilet.
:::

:::mistake[Belirti → neden → düzeltme]
Tab ile gezerken hangi öğede olduğunu göremiyorsun → yalnız `hover:` kuralı var veya focus outline kaldırılmış → görünür bir `focus-visible:` işareti tanımla.
:::

:::mistake[Belirti → neden → düzeltme]
`.dark` eklenmesine rağmen koyu class seçilmiyor → Tailwind’e `.dark` koşulunu bildiren varyant yok veya class uygun üst öğede değil → `@custom-variant dark` tanımını ve DOM’daki konumu kontrol et.
:::

:::info[Derinlemesine (isteğe bağlı)]
`prefers-color-scheme` tarayıcının işletim sistemi tema tercihini okur; burada kullandığımız `.dark` class’ı ise uygulamanın seçtiği CSS koşuludur. `group-hover:` ve `group-focus-within:` bir üst öğenin durumuna göre alt öğeyi biçimlendirebilir, ama önemli eylemi yalnız hover ile görünür yapma; klavyede ve dokunmatik ekranda da bulunabilir olmalı.
:::

## Özet

- `hover:`, `focus-visible:`, `disabled:` ve `dark:` class’ları farklı koşullara göre görünümü seçer.
- `disabled` tıklamayı kapatır; `disabled:opacity-*` yalnız o durumu görünür yapar.
- `aria-pressed` seçili durumunu yardımcı araçlara iletir, state güncellemez.
- `dark:` koyu tema CSS’ini seçer; tema tercihini saklamak uygulamanın ayrı sorumluluğudur.
- Metin, zemin ve focus renkleri açık ve koyu temada okunur kalmalı.

**Yeni terimler**

- **State variant:** Bir durum oluştuğunda utility class’ı uygulayan önek, örneğin `hover:`.
- **Focus:** Klavyeyle ulaşılan ve şu an etkileşim alacak öğenin durumu.
- **ARIA attribute:** Arayüz durumunu yardımcı araçlara ileten HTML bilgisi.
- **Kontrast:** Metin veya işaretin arka plandan ne kadar kolay ayırt edildiği.

**Kendini yokla:** `opacity-50` butonu devre dışı bırakır mı? Hayır; gerçek davranış için `disabled` gerekir.

**Kendini yokla:** `dark:bg-sky-500` ne zaman seçilir? Uygun üst öğede `.dark` varken.
