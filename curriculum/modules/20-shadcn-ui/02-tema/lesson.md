---
title: "Tema: aynı rol, iki görünüm"
minutes: 14
kind: concept
---

# Tema: aynı rol, iki görünüm

Bir film kartının arka planını doğrudan `zinc-900`, yazısını da `white` seçtiğini düşün. Koyu ekranda iyi görünür ama açık temada koyu bir kart kalır. Rengi tek tek bileşenlere yazmak yerine, kartın ne işe yaradığını adlandırıp o role karşılık gelen rengi tema dosyasından seçebilirsin.

Token rolü dışarıdan class eklemeyi engellemez. Örneğin bir `ShelfNotice` varsayılan olarak yuvarlak köşeli olabilir, ama çağıran ekran yatay listede keskin köşeler isteyebilir. İki class birleştirilirken çakışan Tailwind utility'lerinin hangisinin kalacağı da belirlenmelidir.

## Renk adından önce rolü seç

`bg-card` ve `text-card-foreground` sınıfları “kart yüzeyini kullan, üzerindeki metni de onun için tanımlanan renkte göster” der. Bu anlamsal token'lar bileşene renk kodu ezberletmez. Önce tek bir görünümle başlayalım:

```css
:root {
  --card: oklch(0.98 0.01 250);
  --card-foreground: oklch(0.2 0.02 250);
}
```

Buradaki `--card` gibi **custom property**, CSS'te `--` ile başlayan ve `var(--card)` biçiminde kullanılan değişkendir. İsim yüzeyin rolünü anlatır; değeri CSS'te tutulduğu için aynı bileşen farklı temalarda farklı değer alabilir. Arka plan ile üzerinde okunacak yazının ayrı adları olması, ikisini birlikte tasarlamana yardım eder.

Bir ikinci rol olarak ana eylemi ekleyelim:

```css
:root {
  --card: oklch(0.98 0.01 250);
  --card-foreground: oklch(0.2 0.02 250);
  --primary: oklch(0.52 0.18 250);
  --primary-foreground: oklch(0.98 0 0);
}

@theme inline {
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

Tailwind v4'te `@theme inline`, bu değişkenleri `bg-card`, `text-card-foreground` gibi utility class adlarına bağlar. Film kartı `card` rolünü, eylem düğmesi `primary` rolünü seçer. Kartı mavi yapmak istersen `primary`'a çevirmek doğru olmaz; kartın yüzeyi ile eylem vurgusu farklı görevler görür.

Gelen class'ı varsayılanla birleştirmek için `clsx` koşullu class değerlerini toplar, `tailwind-merge` de aynı gruptaki çelişen Tailwind class'larından sonuncusunu bırakır:

```tsx
function ShelfNotice({ className }: { className?: string }) {
  return (
    <aside className={twMerge(clsx('rounded-lg bg-card p-4 text-card-foreground', className))}>
      İzleme listene eklendi
    </aside>
  )
}
```

Çağıran `rounded-none` verirse kartın geri kalan rol ve boşluk class'ları korunur, `rounded-lg` yerine `rounded-none` kalır. Yalnız string'leri yan yana eklemek bu çakışmayı çözmez; sonuç sınıfların HTML'deki sırasına göre beklediğin gibi olmayabilir. Token seçimi tema rengini, class birleştirme ise bileşenin yerel görünümünü yönetir.

## Açık ve koyu değeri aynı anahtarla değiştir

Şimdi aynı custom property adlarına koyu tema değerlerini ekleyelim:

```css
.dark {
  --card: oklch(0.25 0.02 250);
  --card-foreground: oklch(0.94 0.01 250);
  --primary: oklch(0.76 0.13 250);
  --primary-foreground: oklch(0.18 0.02 250);
}
```

Component JSX'i hâlâ `bg-card text-card-foreground` kullanır. Tarayıcı DOM'daki en yakın tema tanımını bulur; `.dark` atası varsa koyu değerleri, yoksa `:root` değerlerini alır. Bu yüzden yüzey ve onun foreground rengini birlikte ayarlarsın: koyu zeminde beyaz yazı okunur olabilir, ama açık zeminde aynı beyaz yazı kaybolabilir.

Değerlerin biçimi de bir ipucu taşır. **OKLCH**, rengi algısal açıklık, renk yoğunluğu ve renk tonu olarak ifade eden renk biçimidir: `L` açıklık (lightness), `C` yoğunluk (chroma), `H` renk tonu (hue) anlamına gelir. Buradaki örnekte `L`, 0'a yakınken siyaha, 1'e yakınken beyaza yaklaşır; `C` büyüdükçe renk daha canlı olur, `H` renk ailesini değiştirir. Bu değerler görsel tasarımda işini kolaylaştırır; tek başına okunabilirliği garanti etmez.

Bir film detay dialog'u temadan kopuk görünürse DOM'daki sınıfın yerini de düşün. Portal, içeriği trigger'ın bulunduğu kartın içine değil çoğunlukla `document.body` altına yerleştirir. Tema sınıfı yalnız `#app` üzerindeyse, `body` altındaki portal o sınıfın çocuğu değildir. `.dark` sınıfını `<html>` üzerinde tutarsan hem uygulama hem portal aynı tema atalarını görür.

| DOM öğesi | Tema sınıfının yeri | `--card` değeri |
| --- | --- | --- |
| Film kartı | `<html class="dark">` | Koyu tema |
| Dialog portalı | `<html class="dark">` | Koyu tema |
| Film kartı | Yalnız `#app.dark` | Koyu tema |
| Dialog portalı | Yalnız `#app.dark` | Kök tema |

Tablo, portalın neden tema dışında kalabildiğini gösterir: CSS custom property'leri atadan alt öğeye miras kalır. Portal `#app` altında olmadığı için `#app`'in özel değerini alamaz.

## Kullanıcının tema seçimi DOM'a nasıl ulaşır?

Bir ayar düğmesinde `classList`, bir DOM öğesinin CSS sınıflarını ekleyip kaldırmanı sağlar. Örneğin küçük bir önizlemede kullanıcı “Koyu görünümü dene” dediğinde `document.documentElement.classList.add('dark')` çağrısı `.dark` token'larını etkinleştirir; `remove('dark')` kök değerlerine döndürür. `document.documentElement`, sayfanın `<html>` öğesidir; bu noktayı seçmek portalı da aynı kapsamda tutar.

Burada iki değer eş zamanlı görünür: React arayüzde hangi seçeneğin aktif olduğunu tutar, DOM sınıfı ise CSS'e hangi token değerlerini kullanacağını söyler. Eğer React düğmesi “Koyu görünümü kapat” derken `<html>` üzerinde `dark` yoksa bu iki görünüm birbirinden kopmuştur. Sınıf değişimini seçimin gerçekleştiği olayla birlikte yapmak, ekranda çelişkili bir an oluşmasını önler.

Tema değişikliğinin sonucu şu sırayla anlaşılabilir:

| Adım | Ne olur? | Ekrandaki sonuç |
| --- | --- | --- |
| 1 | Kullanıcı tema seçimini değiştirir. | Düğmenin durumu değişir. |
| 2 | `<html>` öğesine `dark` eklenir veya kaldırılır. | CSS başka token değerlerini seçer. |
| 3 | Kart ve portal aynı ortak atadan değerleri okur. | İkisi aynı temada görünür. |

İlk açılışta yanlış temanın bir an görünmesi ayrı bir zamanlama sorunudur: sınıf uygulamanın ilk çiziminden sonra ekleniyorsa tarayıcı önce kök temayı çizebilir. Kalıcı tema tercihini ilk çizimden önce uygulamak bu parlamayı önler; basit bir kullanıcı geçişinde ise düğme olayı sınıfı değiştirmek için yeterlidir.

## Kontrastı tahmin etmek ile ölçmek aynı şey değil

Bir metnin okunabilirliği, yazı ile arka planın ne kadar farklı göründüğüyle ilgilidir. **Luminance**, ışığın bir yüzeyden algılanan göreli parlaklığıdır; WCAG kontrast oranı bu parlaklıkları kullanır. **WCAG**, web içeriğinin erişilebilirliği için yayımlanan yönergeler bütünüdür. Açık ve koyu token'ları gözle karşılaştırmak iyi bir ilk kontroldür, ancak küçük metin için yeterli olduğunu kanıtlamaz.

OKLCH lightness değerlerinin farkını hesaplamak (`|L₁ - L₂|`) zayıf görünen çiftleri bulmaya yarayan kaba bir taramadır. Bu fark, luminance tabanlı WCAG kontrast oranı değildir; bu nedenle eşik aşıldı diye çifti “erişilebilir” ilan etme. Gerçek metin ve zemin çiftini kontrast ölçeriyle kontrol et; ayrıca hata ve seçili durumu yalnız renkle anlatma, metin veya simge gibi ikinci bir işaret ekle.

## Sık rastlanan üç görünüm hatası

:::mistake[Ana düğmenin yazısı kayboluyor]
Belirti → Koyu `primary` yüzeyde metin zor okunuyor. Neden → Yalnız `--primary` değişmiş, `--primary-foreground` açık temaya uygun kalmış. Düzeltme → Her temada yüzey ve metin token'larını çift olarak ayarla, ardından gerçek kontrastı ölç.
:::

:::mistake[Dialog açık tema renginde kalıyor]
Belirti → Sayfa koyu ama dialog açık renkte. Neden → `.dark` yalnız portalın atası olmayan bir uygulama `div`'ine konmuş. Düzeltme → Tema sınıfını ortak üst öğeye, genellikle `<html>` üzerine koy.
:::

:::mistake[Lightness farkı yüksek ama metin yine zor okunuyor]
Belirti → Hızlı renk kontrolü iyi görünüyor, küçük yazı ise seçilemiyor. Neden → OKLCH lightness farkı WCAG kontrast hesabı değildir. Düzeltme → Ön plan/arka plan çiftini ölç ve küçük metinle görünümü ayrıca incele.
:::

:::info[Derinlemesine (isteğe bağlı)]
Bir renk çifti için `|L₁ - L₂|` hesaplayan küçük bir parser yazmak ilk tarama sağlayabilir; hex'i RGB'ye, ardından luminance'a çevirmek ise gamut, alfa ve renk dönüşümü ayrıntıları getirir. Bu tür bir kontrol gerçek kontrast aracının yerine geçmez. Tema değişkeni ilk render'dan önce ayarlanmadığında görülen kısa yanlış renk karesi de uygulama başlangıcında tema tercihini okuma konusudur.
:::

## Özet

- Component sınıfı rengi değil rolü seçer; CSS custom property bu rolün tema değerini verir.
- Açık ve koyu tema aynı token adlarını farklı değerlerle tanımlar; yüzey ve metin çiftini birlikte ayarla.
- Tema sınıfı portalın ortak DOM atasında bulunmalı; `<html>` bunu çoğunlukla sağlar.
- `classList` sınıfı değiştirir; React seçimi ve DOM sınıfı aynı durumu göstermelidir.
- Renk biçiminden veya gözle bakmaktan kontrast sonucu çıkarma; gerçek metin/zemin çiftini ölç.

**Yeni terimler**

- **Custom property:** CSS'te `--ad` biçiminde tanımlanan ve `var()` ile okunan değişken.
- **OKLCH:** Rengi açıklık (`L`), yoğunluk (`C`) ve ton (`H`) ile ifade eden renk biçimi.
- **Lightness:** OKLCH'de rengin algısal açıklık bileşeni.
- **Luminance:** WCAG kontrast hesabında kullanılan göreli parlaklık.
- **WCAG:** Web erişilebilirliği için yönergeler bütünü.

Kendini yokla: `<html>` üzerinde `.dark` olması portalı nasıl etkiler? Cevap: Portal `body` altına taşınsa da aynı kök tema değişkenlerini miras alır.

Kendini yokla: OKLCH `L` farkı büyükse kontrast kesin olarak yeterli midir? Cevap: Hayır; WCAG kontrast oranını gerçek metin ve zemin renkleriyle ayrıca ölçmelisin.
