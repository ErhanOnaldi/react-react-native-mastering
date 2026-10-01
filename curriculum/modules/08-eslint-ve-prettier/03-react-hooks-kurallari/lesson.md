---
title: "React Hooks kuralları ve lint"
minutes: 16
kind: concept
---

# React Hooks kuralları ve lint

`useState` ve `useEffect` çağrılarını component’lerde zaten kullandın. Hook, React’in state veya effect gibi özelliklerini component’e bağlayan fonksiyondur. ESLint’in React Hooks kuralları bu çağrıların React’in beklediği düzende yazılıp yazılmadığını kaynak koddan denetler.

İki ayrı soruya bakacağız: Hook her render’da aynı yerde mi çağrılıyor ve effect hangi değer değişince yeniden çalışmalı? İlk soru React’in state’i doğru Hook çağrısıyla eşleştirmesine yardım eder. İkincisi effect’in güncel veriyle çalışmasını sağlar.

## Önce Hook çağrısının yerini incele

Sinema’da seçilmiş bir film yoksa kısa bir mesaj, varsa film adı göstermek istiyorsun. Şu component erken çıkış yapıyor, sonra `useState` çağırıyor:

```tsx title="Hook erken dönüşün altında"
function FilmLabel({ title }: { title: string | null }) {
  if (!title) return <p>Film seç</p>
  const [label] = useState(title)
  return <p>{label}</p>
}
```

İlk render’da `title` boşsa React `useState` çağrısını görmez. Sonraki render’da film seçilince çağrı yapılır. React component’in Hook state’ini çağrı sırasıyla takip ettiği için iki render’da farklı sıra oluşur. Lint bu koşullu çağrıyı işaretleyebilir.

Hook’u component’in üst seviyesine taşıyalım:

```tsx check
import { useState } from 'react'

export function FilmLabel({ title }: { title: string | null }) {
  const [label] = useState(title ?? '')

  if (!title) return <p>Film seç</p>
  return <p>{label}</p>
}
```

Şimdi `useState` her render’da, koşul kontrolünden önce çağrılır; yalnızca gösterilecek JSX değişir. Bu örnek Hook sırası sorununu düzeltir. `title` prop’u sonradan değişince `label` state’inin de değişmesi gerekip gerekmediği başka bir tasarım kararıdır; lint mesajı o kararı senin yerine vermez.

Olayların sırasını karşılaştıralım:

| Render | `title` | Erken dönüş altındaki Hook | Üst seviyedeki Hook |
| --- | --- | --- | --- |
| İlk render | `null` | Çağrı yok | 1. çağrı yapılır |
| Film seçildi | `"Arrival"` | İlk çağrı şimdi yapılır | Yine 1. çağrı yapılır |
| Sonuç | Çağrı sırası değişti | Lint sorunu | Sıra sabit, gösterim koşullu |

Burada önemli olan ekranda kaç paragraf olduğu değil, React’in her render’da Hook’ları aynı sırada bulmasıdır. Koşul gerekiyorsa Hook çağrısını değil, Hook’un içindeki işi veya gösterilecek JSX’i koşula bağla.

## Effect’in kullandığı değeri listele

Şimdi Sinema detayında seçili filmin gösterim bilgisini yenileyen bir panel düşün. Effect, `movieId` değerini okuyor ama dependency listesi boş:

```tsx title="Film kimliği değişimini izlemeyen effect"
useEffect(() => {
  document.title = `Puanlar · ${movieId}`
}, [])
```

`movieId` prop veya state gibi render’la değişebilen bir değerdir; bu tür değere **reaktif değer** denir. Effect callback’i oluşturulduğu render’daki değeri kullanabilir; fonksiyonun dışarıdan yakaladığı değerlere **closure** denir. Liste boş olduğu için `movieId` değişse bile effect’in yeni değerle tekrar çalışacağı belirtilmemiştir. React Hooks lint kuralı bu kaynak uyumsuzluğunu bulabilir.

![Callback'in oluşturulduğu render'ın değerlerini yakalaması](diagram:closure-bayat-deger)

Effect gerçekten bu değere bağlıysa dependency listesine eklenmelidir. Şimdi aynı Sinema panelinde seçili filmi beş saniyede bir yenileyen örneğe bakalım. Tek yeni parça dependency listesine eklenen `[movieId]` değeridir:

```tsx title="Seçili filmin bilgisini yenile"
useEffect(() => {
  const timer = window.setInterval(() => refreshMovie(movieId), 5000)
  return () => window.clearInterval(timer)
}, [movieId])
```

`refreshMovie` burada film bilgisi isteyen önceden tanımlı bir yardımcıdır. Film seçimi `550` iken kurulan timer `550` değerini kullanır. Kullanıcı `155` filmine geçtiğinde eski effect’in timer’ı kapatılır ve yenisi `155` için kurulur. `return` içindeki kapatma fonksiyonuna **cleanup** denir; burada eski timer’ın çalışmasını durdurur. Lint’in istediği liste, effect’in dışarıdan hangi değişen değerleri kullandığını açık eder. Bu sayede React gerektiğinde eski setup’ı temizleyip güncel değerle yenisini kurabilir.

## Render değişiminde effect’i izleyelim

İlk film kimliği `550`, kullanıcının seçtiği yeni film kimliği `155` olsun. Effect’in ne zaman çalıştığını tabloya dökelim:

| Sıra | React olayı | Effect’in gördüğü değer | Sonuç |
| --- | --- | --- | --- |
| 1 | İlk render ve commit tamamlanır | Film `550` | İlk yenileme timer’ı kurulur |
| 2 | Timer zamanı gelir | Film `550` | `550` için yenileme yapılır |
| 3 | Kullanıcı film `155`’i seçer, yeni render olur | Yeni render’da `155` | Eski timer henüz eski setup’a bağlıdır |
| 4 | React dependency değerlerini karşılaştırır | `550` ile `155` farklı | Eski cleanup timer’ı kapatır |
| 5 | Yeni effect setup’ı çalışır | Film `155` | Yeni timer güncel filmi yeniler |

Cleanup yalnız timer’larda kullanılmaz; effect bir dış kaynakla ilişki kuruyorsa o ilişkiyi kapatabilir. Burada önemli olan kuralı ezberlemek değil, nedenini görmek: eski closure çalışmaya devam ederse eski değeri kullanır. Bağımlılık listesi değişimi bildirir, cleanup önceki ilişkiyi kapatır ve yeni setup güncel render değerleriyle başlar. Timer kapanmazsa seçilmeyen film için yenileme istekleri sürer; cleanup hem eski veriyi kullanmayı hem gereksiz işi önler.

![Effect setup, dependency değişimi, cleanup ve yeniden setup akışı](diagram:effect-yasam-dongusu)

## Koşulu çağrıya değil işe uygula

Sinema’da seçili film yokken effect’in bir şey yapmaması gerekebilir. Hook’u `if (movieId)` içine koymak bir render’da çağrıyı atlar. Onun yerine Hook’u her render’da aynı yerde çağır, effect içindeki işi koşula bağla:

```tsx title="Effect sırası sabit, iş koşullu"
useEffect(() => {
  if (!movieId) return
  document.title = `Fragman · ${movieId}`
}, [movieId])
```

`movieId` boşken effect kurulsa da gövde başlığı güncellemeden çıkar. Değer varsa başlık güncellenir. Her iki durumda da Hook çağrısı component’in aynı yerinde kalır; ayrıca liste değişikliği React’e yeni değeri bildirir.

İzlediğimiz üç örnek aynı iki fikri farklı yerde kullandı: `FilmLabel` Hook sırasını, seçili film paneli değişen effect girdisini, fragman başlığı ise koşullu işi gösterdi. Şimdi genelle: Hook’ları component veya custom Hook’un üst seviyesinde çağır; effect’te okuduğun reaktif değerleri dürüstçe listele. Bu kurallar, React’in state’i ve effect’i doğru render verisine bağlamasını sağlar.

## Sık görülen hatalar

:::mistake[Erken dönüşten sonra Hook çağırmak]
Belirti → ESLint koşullu Hook mesajı verir veya render’lar arasında çağrı sırası değişir. Neden → Bir render erken dönüş yüzünden Hook’u atlıyor. Düzeltme → Hook’u üst seviyeye taşı, koşulu Hook’un içindeki işe ya da gösterime uygula.
:::

:::mistake[Dependency uyarısını kapatmak]
Belirti → Film değişir ama effect eski kimliği kullanır. Neden → Closure önceki render’daki değeri tutar; liste değişimi bildirmemiştir. Düzeltme → Effect’in gerçekten okuduğu reaktif değeri listele ve gerekirse eski dış ilişkiyi cleanup ile kapat.
:::

:::info[Derinlemesine (isteğe bağlı): React Compiler]
React Hooks preset’i Hook sırası ve dependency denetimlerinin yanında React Compiler’ın analizine yardımcı olan kurallar da içerebilir. Örneğin değişmezliği bozan veya render sırasında state güncelleyen kod için mesaj görebilirsin. Bu mesajları “her yere `useMemo` ekle” diye yorumlama; önce işaretlenen kodun React’in temel kullanım kurallarına uyup uymadığını anla.
:::

## Özet

- Hook’ları component veya custom Hook’un üst seviyesinde çağır; render’lar arasında sıra sabit kalsın.
- Koşullu gösterimi koruyabilirsin; koşulu Hook çağrısına değil işe uygula.
- Effect’in okuduğu reaktif değerleri dependency listesinde belirt.
- Cleanup eski timer veya bağlantıyı kapatır; yeni setup güncel değerle başlar.
- Lint kaynak koddaki şüpheli ilişkileri bulur; effect’in davranışını ayrıca doğrula.

**Yeni terimler:**

- **Hook:** React state veya effect gibi özellikleri component’te kullanmanı sağlayan fonksiyon.
- **Reaktif değer:** Değişince render’ı veya effect’i etkileyebilen props/state değeri.
- **Closure:** Fonksiyonun oluşturulduğu sıradaki dış değerleri kullanabilmesi.
- **Cleanup:** Effect’in önceki dış kaynak ilişkisini kapatan fonksiyon.

**Kendini yokla:** `if (!movieId) return null` satırından sonra Hook varsa hangi render farkı sorun çıkarır?
*Cevap:* `movieId` boşken Hook çağrısı atlanır, doluyken yapılır; Hook sırası değişir.

**Kendini yokla:** `zone` dependency listesine eklendiğinde saat dilimi değişince ne olur?
*Cevap:* Önceki timer cleanup ile kapanır, sonra güncel `zone` değerini kullanan effect kurulur.
