---
title: "Eski React pattern'lerini okuyabilmek"
minutes: 15
kind: concept
---

# Eski React pattern'lerini okuyabilmek

Sinema'nın film kartında süreyi ve yönetmen adını gösterdiğini düşün. Bu bilgiyi başka bir ekranda da kullanmak istiyorsun, ama iki ekranın görünümü farklı. Bunu paylaşmanın iki eski yolu, veriyi bir callback'e veren **render prop** ve bir component'i sarmalayan **Higher-Order Component (HOC)**. İsimleri uzun; ikisinin yaptığı işi küçük örneklerde göreceğiz.

## Veriyi al, görünümü sen çiz

Önce render prop'un en küçük hali: `FilmInfo` bir film veriyor, `render` fonksiyonu bu veriyi alıp JSX üretiyor.

```tsx check
import type { ReactNode } from 'react'

type Film = { title: string }
function FilmInfo({ render }: { render: (film: Film) => ReactNode }) {
  return <>{render({ title: 'Kayıp Şehir' })}</>
}
```

`render` burada sıradan bir JavaScript fonksiyonu: film nesnesini alıp React'in ekrana çizebileceği bir değer döndürüyor. Veri sağlayan component filmi biliyor; onu hangi HTML ile göstereceğine karar vermiyor. Bu ayrım, iki ekran aynı veriyi kullanırken farklı görünüm istediğinde işine yarar.

İkinci adımda aynı veriyi iki ayrı görünümle kullan. Yeni fikir yalnızca callback'in çağrıldığı yerdir:

```tsx check
import type { ReactNode } from 'react'

type Film = { title: string; director: string }
function FilmInfo({ render }: { render: (film: Film) => ReactNode }) {
  return <>{render({ title: 'Kayıp Şehir', director: 'Ece Yalın' })}</>
}

export function FilmRow() {
  return <FilmInfo render={(film) => <p>{film.title}</p>} />
}
```

Burada `FilmInfo` yeni bir yönetmen alanı sundu; `FilmRow` yalnızca başlığı gösteriyor. Başka bir çağıran aynı callback'te yönetmen adını veya bir düğmeyi gösterebilir. Görünüm seçimi çağıranda olduğu için render prop'un kısa özeti “veri bende, çizim sende”dir.

Üçüncü örnek, callback'i adlandırılmış `render` prop'u yerine `children` olarak alıyor. Bu da aynı fikirdir; prop adı farklı olsa bile değer yine bir fonksiyondur.

```tsx check
import type { ReactNode } from 'react'

type Film = { title: string }
function FeaturedFilm({ children }: { children: (film: Film) => ReactNode }) {
  return <>{children({ title: 'Gece Seansı' })}</>
}

export function FeaturedCard() {
  return <FeaturedFilm>{(film) => <strong>{film.title}</strong>}</FeaturedFilm>
}
```

`children` fonksiyonuna da veri verildi ve çağıran JSX döndürdü. Bazı eski kütüphanelerde bunu görürsün. Callback'in kendisi bir component değildir; bu yüzden callback'in içine Hook koyma. Callback'i çağıran kod onu koşullu ya da bir render'da birden fazla kez çalıştırabilir; Hook'lar ise component gövdesinde sabit sırada çağrılmalıdır.

## Davranışı component'e ekle

Şimdi farklı bir ihtiyaca bakalım: birkaç film sayfasına aynı oturum kontrolünü eklemek istiyorsun. Bir **Higher-Order Component (HOC)**, component alan ve yeni bir component döndüren JavaScript fonksiyonudur. Aşağıdaki örnekte HOC henüz oturum denetlemiyor; yalnızca sarmalama biçimini gösteriyor.

```tsx check
import type { ComponentType } from 'react'

type FilmProps = { title: string }
function withFilmLabel(Component: ComponentType<FilmProps>) {
  return function LabeledFilm(props: FilmProps) {
    return <Component {...props} />
  }
}
```

`withFilmLabel` component tipi alıp başka bir component tipi döndürdü. Gerçek bir HOC, wrapper içinde erişim denetimi yapabilir veya ek prop sağlayabilir. Bir **wrapper**, başka bir component'i çevreleyip onun öncesinde ya da çevresinde iş yapan sarmalayıcı component'tir.

Şimdi HOC sonucunu component gövdesinin dışında, bir kez üret:

```tsx check
import type { ComponentType } from 'react'

type FilmProps = { title: string }
function Poster({ title }: FilmProps) {
  return <h2>{title}</h2>
}
function withFilmLabel(Component: ComponentType<FilmProps>) {
  return function LabeledFilm(props: FilmProps) {
    return <Component {...props} />
  }
}

const LabeledPoster = withFilmLabel(Poster)
export function FilmPage() {
  return <LabeledPoster title="Gece Seansı" />
}
```

`LabeledPoster` aynı component tipi olarak kalır. **Component tipi**, React'in hangi component'i çizdiğini belirleyen component fonksiyonudur; bu kimlik sabitse React tekrar render sırasında aynı component'i tanır. State bu yüzden korunur: React state'i aynı component tipinin ağaçtaki aynı konumunda tutar; tipi değişmiş gibi görünürse önceki component kaldırılıp yenisi eklenir.

## HOC render sırasında kurulursa ne olur?

Şu hatalı biçimde HOC çağrısı `FilmPage` gövdesinin içinde duruyor:

```tsx
function FilmPage() {
  const LabeledPoster = withFilmLabel(Poster)
  return <LabeledPoster title="Gece Seansı" />
}
```

`FilmPage` her render olduğunda `withFilmLabel` yeni bir fonksiyon üretir. Bu fonksiyon yeni component tipi olduğu için React eski ağacı kaldırıp yenisini kurar; içindeki input veya oynatıcı state'i başlangıç değerine dönebilir. Belirti, favoriye bastığında oyuncunun ses düzeyinin sıfırlanması gibi görünür. Çözüm HOC sonucunu component gövdesinin dışına taşımaktır; `useMemo` ile gizlemek yerine component tipini gerçekten sabit yerde tanımla.

![State aynı ağaç konumu ve key ile korunur, component tipi ya da konum değişince sıfırlanır](diagram:agac-ve-kimlik)

Sıra şöyle ilerler:

| Adım | Ne çalışır? | React ne görür? |
| --- | --- | --- |
| Modül ilk yüklendiğinde | `withFilmLabel(Poster)` bir kez çağrılır | `LabeledPoster` tipi oluşturulur |
| `FilmPage` ilk render | `<LabeledPoster />` çizilir | Alt ağacın state'i kurulur |
| `FilmPage` tekrar render | Aynı `LabeledPoster` kullanılır | Alt ağacın state'i korunur |
| HOC `FilmPage` içinde çağrılır | Yeni `LabeledPoster` fonksiyonu çıkar | Eski alt ağaç kaldırılır, state sıfırlanır |

Bu sıra, sorunun neden hata mesajı vermeden ortaya çıktığını açıklar: JavaScript kodu çalışır, ama React component tipinin değiştiğini görür.

## Eski kodu okurken neye bakmalı?

Render prop'ta verinin callback'e nasıl verildiğini ve callback'in ne döndürdüğünü izle. HOC'de ise wrapper'ın ne eklediğine ve HOC çağrısının nerede yapıldığına bak. İkisi de kendi başına global state değildir; veri component'ler arasında taşınabilir ama görünüm ve state'in sahibi hâlâ component ağacındadır.

Hook'lar bu iki pattern'in pek çok kullanımını daha kısa hale getirdi. Örneğin veri okumak için `useFilm(id)` çağırıp JSX'i aynı component'te yazabilirsin. Yeni bir component gerekmiyorsa custom hook daha düz bir akış verir; fakat eski kodu yalnızca sözdizimi farklı diye taşımak gerekmez. Somut bir hata veya bakım ihtiyacı varsa değiştir, yoksa davranışı koru.

:::mistake[Belirti: Alt component'in state'i kayboluyor]
Belirti → Ebeveyn render'ından sonra oynatıcı başa dönüyor ya da input temizleniyor.  
Neden → HOC her render'da yeni component tipi üretiyor.  
Düzeltme → HOC sonucunu component tanımının dışında bir kez oluştur.
:::

:::mistake[Belirti: Hook sırası uyarısı alıyorsun]
Belirti → Render prop callback'inde Hook çağırınca Hook sırası değişebiliyor.  
Neden → Callback'in ne zaman ve kaç kez çağrılacağını component'in Hook sıralaması gibi düşünmüşsün.  
Düzeltme → Hook'u gerçek component'in gövdesinde çağır veya paylaşılacak mantığı custom hook'a taşı.
:::

:::info[Derinlemesine (isteğe bağlı)]
Eski TypeScript paketlerinde **declaration merging** (aynı adlı `interface` bildirimlerinin alanlarını birleştirme) ve **module augmentation** (bir modülün tip bildirimini genişletme) görebilirsin. Bunlar runtime'daki component davranışını değiştirmez. HOC'lerde `ref` aktarımı, prop isimlerinin çakışması ve `displayName` (debug araçlarında görünen component adı) da ek ayrıntılardır; kütüphane sözleşmesini okurken kontrol et, ilk okuman için bu ayrıntılar şart değil.
:::

## Özet

- Render prop veriyi callback'e verir; çağıran JSX'i seçer.
- HOC component alır ve wrapper component döndürür.
- HOC sonucunu component render'ında üretmek component tipini değiştirip alt state'i sıfırlayabilir.
- Hook'lar aynı paylaşım ihtiyacını çoğu zaman daha basit biçimde çözer; çalışan eski kodu gerçek bir ihtiyaç olmadan taşıma.

**Yeni terimler:** Render prop — veriyi bir render callback'ine veren prop; HOC — component alıp yeni component döndüren fonksiyon; wrapper — başka component'i çevreleyen sarmalayıcı; component tipi — React'in ağaçtaki component kimliğini belirleyen fonksiyon.

**Kendini yokla:** Render prop ile HOC arasındaki görünür fark nedir?  
*Cevap:* Render prop çağırana callback içinde JSX seçtirir; HOC çağırana sarmalanmış component verir.

**Kendini yokla:** HOC sonucunu neden component gövdesinde üretmemelisin?  
*Cevap:* Her render'da yeni component tipi çıkabilir ve React alt ağaç state'ini sıfırlayabilir.
