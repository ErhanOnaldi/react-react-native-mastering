---
title: "Eski kodu okuyabilmek"
minutes: 14
kind: concept
---

# Eski kodu okuyabilmek

:::pain[Belirti]
Sinema'ya eski bir UI paketinden video oynatıcı geldi. Bir yerde `<ClipData render={(clip) => ...} />`, başka yerde `withSession(Player)` görüyorsun. Bir arkadaşın `withSession(Player)` çağrısını component gövdesine taşıdı. Favoriye her tıklamada oynatıcı başa dönüyor ve ses düzeyi sıfırlanıyor.
:::

## Mantığı paylaşmanın eski biçimleri

React ekosistemi zaman içinde aynı ihtiyaca farklı API'ler geliştirdi: ortak davranışı birden çok ekranda kullanmak, görünümü uygulamaya bırakmak veya component'e yeni bir yetenek eklemek. Render props ve Higher-Order Component (HOC) eski kodda sık görünür. Yeni her yerde bunları kullanman gerekmez; fakat bir kod tabanında hook'larla birlikte bulunabilirler. Bir pattern'in yaşlı olması onun hatalı olduğu anlamına gelmez.

:::model[State ağaçtaki konum ve key'e bağlıdır]
React state'i aynı component tipinin aynı ağaç konumunda sürmesini bekler. Her render'da farklı component tipi üretirsen React önceki alt ağacı unmount eder, yenisini mount eder ve yerel state'i sıfırlar. Bu bağlamda HOC'nin oluşturduğu component kimliğine dikkat et.
:::

![State'in ağaç konumu ve key'e göre korunması ya da sıfırlanması](diagram:agac-ve-kimlik)

Kurallar:

1. **Render prop bir fonksiyondur.** Data sağlayan component, veriyi `render` veya `children` callback'ine verir; çağıran taraf JSX'i seçer.
2. **Render prop içinde state sahibi görünümü üretir.** Fonksiyon sıradan JavaScript callback'idir; kendi başına Hook değildir.
3. **HOC component alıp component döndürür.** `withSession(Page)` gibi bir sarmalayıcı dışarıda oluşturulur ve ek prop ya da davranış ekler.
4. **HOC çağrısını component render'ında yapma.** Her çağrıda yeni fonksiyon/component tipi üretilebilir; alt ağacın kimliği değişip state sıfırlanır.
5. **Bugünkü karşılığı ihtiyaca göre seç.** Mantık/veri paylaşımı çoğu zaman custom hook ile; ağaç düzeyinde yetki/tema çevreleme ise layout, Context veya açık composition ile çözülür.
6. **Çalışan eski kodu biçim uğruna taşıma.** Değişiklikten önce davranışı sabitle ve somut problem olup olmadığını belirle.

Render prop şu anlama gelir: “veriye ben ulaşırım, görünümü sen çizersin.” Örneğin `ClipData` detay endpoint'ini yükleyip bir `clip` değeri sunar. Callback bir `<h2>` döndürebilir; aynı veriyle liste satırı veya boş durum tasarımı da üretilebilir. Bu esneklik kullanışlıdır, fakat callback katmanı JSX'i iç içe geçirerek okuması zor hale getirebilir.

Hook'lar birçok render prop kullanımını sadeleştirdi. `useClip(id)` gibi bir hook veriyi component'e döndürür, JSX ise aynı component'te açık kalır. Hook çağrısı her render'da aynı sırada olmalı; render prop callback'i içinde hook çağırmak güvenli bir pattern değildir. Eski kodu taşırken render prop fonksiyonunun koşullu çağrılıp çağrılmadığını ve hook kurallarının ihlal edilip edilmediğini incele.

## Component kimliğini adım adım izle

HOC bir `Player` component'ini alıp `SessionPlayer` sarmalayıcısını üretir. Bu fonksiyon aynı yaşam süresince aynı referans olmalıdır:

| Yer | `withSession(Player)` sonucu | React yorumu |
| --- | --- | --- |
| Modül yüklenirken bir kez | `SessionPlayer` referansı oluşturulur | Component tipi sabit |
| Ebeveyn ilk render | Aynı `SessionPlayer` render edilir | State kendi ağacında kurulur |
| Ebeveyn tekrar render | Aynı referans kullanılır | React state'i korur |
| Her render içinde HOC çağrılır | Yeni `SessionPlayer` fonksiyonu oluşur | Eski alt ağaç unmount, state kaybı |

React component identity yalnızca JSX değişkeninin isminden gelmez; function referansı/type ve ağaç konumu önemlidir. `const Guarded = withSession(Player)` component gövdesinde tanımlı görünse de her gövde çalışışında yeni function üretir. Bu, sıradan `useMemo` ile düzeltilecek bir kullanım değildir; HOC'yi modül kapsamına taşı veya açık bir wrapper component'i bir kez tanımla.

## Kırık yaklaşım, modern okuma

Kırık kullanımda wrapper her render'da yeniden kurulur:

```tsx
function ClipPage() {
  const [favorite, setFavorite] = useState(false)
  const AuthorizedPlayer = withSession(Player)
  return <AuthorizedPlayer favorite={favorite} />
}
```

Doğru eski kullanım, HOC'yi modül seviyesinde oluşturur:

```tsx check
import { useState } from 'react'
import type { ReactNode } from 'react'

type Props = { volume: number }
function Player({ volume }: Props) {
  return <output>{volume}</output>
}
function withSession(Component: (props: Props) => ReactNode) {
  return function SessionGuard(props: Props) {
    return <Component {...props} />
  }
}

const SessionPlayer = withSession(Player)

export function ClipPage() {
  const [favorite, setFavorite] = useState(false)
  return <SessionPlayer volume={favorite ? 0.8 : 0.5} />
}
```

Bu örnek HOC'nin gerçek auth politikasını temsil etmez; component kimliği için sınırlandırılmış bir örnektir. Bir HOC incelerken prop'ları sarılan bileşene nasıl aktardığını, aynı isimli prop'u ezip ezmediğini, `ref`'i taşıyıp taşımadığını ve wrapper'ın display name/debug görünürlüğünü kontrol et. Özellikle `ref`, normal prop gibi davranmayabilir; React 19'da ref'i prop alan yeni fonksiyon bileşenleri yazılabilir ama eski HOC'ler `forwardRef` ile özel aktarım uygulamış olabilir.

Render prop'ta ise isimli callback veya `children` fonksiyonu görebilirsin:

```tsx check
import type { ReactNode } from 'react'

type Session = { userName: string }

export function SessionInfo({ render }: { render: (session: Session) => ReactNode }) {
  const session = { userName: 'Ece' }
  return <>{render(session)}</>
}
```

Bu callback hangi veriyi alıyor ve çağıranın JSX seçmesine ne kadar izin veriyor, API'yi okurken bakacağın temel sorulardır. Callback component'te koşullu veya tekrarlı çalışabilir; bu nedenle Hook çağrısını callback içine koyma. Ekran her satırda özelleştirilmiş UI istiyorsa render prop hâlâ uygun olabilir. Sadece data state'i okumaksa hook çoğu zaman daha sade bir çağrı yüzeyi verir.

TypeScript'te eski paketlerde declaration merging de karşına çıkabilir: aynı isimli `interface` bildirimleri alanları birleştirirken aynı kapsamda type alias tekrar tanımlanamaz. Bu, runtime component davranışı değil, tip sisteminin bildirim birleştirme kuralıdır. Eski interface'i genişletmeden önce paket tiplerinin bilinçli augmentation noktası olup olmadığını anla; yeni API'de beklenmedik birleşmeye güvenme.

## Belirti → neden → düzeltme

:::mistake[Belirti: Oyuncu state'i her ebeveyn render'ında siliniyor]
Belirti → Ses, oynatma zamanı veya input değeri başa dönüyor.  
Neden → HOC component'in içinde çağrılmış ve her render'da yeni tür üretilmiş.  
Düzeltme → HOC sonucunu modül kapsamında bir kez oluştur.
:::

:::mistake[Belirti: Render prop callback'inde Hook hatası]
Belirti → Hook sırası uyarısı çıkıyor veya state farklı satıra bağlanıyor.  
Neden → Callback her render'da aynı sırada çağrılmayabilir.  
Düzeltme → Hook'u callback dışındaki component gövdesinde çağır veya mantığı custom hook'a çıkar.
:::

:::mistake[Belirti: HOC bir üst prop'u sessizce siliyor]
Belirti → Sayfa prop'u ile wrapper'ın sağladığı aynı adlı alan çakışınca beklenmeyen değer kullanılıyor.  
Neden → Prop spread sırası bir kaynağı diğerinin üstüne yazmış.  
Düzeltme → HOC'nin ürettiği prop'ları ve dışarıdan gelenleri type/API sözleşmesinde ayır.
:::

:::mistake[Belirti: Sadece style değişikliği için tüm eski API taşınıyor]
Belirti → Büyük refactor sonrası kullanıcı davranışı değişiyor, fayda görünmüyor.  
Neden → Amaç gerçek bakım/performans sorunu yerine sözdizimini modernleştirmek olmuş.  
Düzeltme → Önce mevcut davranışı testle sabitle; refactor'u belirli bir soruna bağla.
:::

:::sector
Büyük React kod tabanlarında HOC, render prop, hook ve Context aynı anda bulunabilir. Bakım görevi sırasında pattern adını görmek yerine state'in nerede tutulduğunu, component tipinin nerede üretildiğini ve verinin nasıl aktığını izle. Ekibe yeni bir API ekliyorsan varsayılan olarak hook/composition değerlendirilir; HOC ise component sınırına gerçekten çapraz bir davranış ekleyecekse seçilir.
:::

## Özet

- Render prop veriyi callback ile sunar; çağıran çizimi belirler.
- HOC component alıp sarmalayıcı component üretir.
- HOC render sırasında çağrılırsa yeni component tipi alt state'i sıfırlar.
- Hook birçok davranış paylaşımını sadeleştirir, ama eski API'leri tanımak bakım için gerekir.
- Refactor biçim için değil, kanıtlanmış bakım ihtiyacı için yapılır.

**Kendini yokla:** HOC sonucunu component gövdesinde üretmek alt component state'ini neden sıfırlayabilir?  
*Cevap:* Her render yeni function/type verdiği için React eski component'i yenisiyle değiştirir.

**Kendini yokla:** Render prop callback'i içinde neden Hook çağırmamalısın?  
*Cevap:* Callback'in çalışma sayısı/sırası Hook kurallarının beklediği sabit sırayı garanti etmez.
