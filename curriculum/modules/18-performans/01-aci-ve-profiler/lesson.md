---
title: "Acıyı ölç: Profiler"
minutes: 15
kind: concept
---

# Acıyı ölç: Profiler

Arama kutusuna yazdığın harf, `useState` ile tuttuğun sorgu değişince ekranda görünür. Önceki derslerde gördüğün gibi React bu state değişince ilgili bileşenleri yeniden çalıştırır. Liste küçükken bunu fark etmeyebilirsin; yüzlerce film olduğunda ise her tuşta bekleme hissedebilirsin. Böyle bir durumda ilk iş kodu tahminle değiştirmek değil, gecikmenin hangi bölümde olduğunu ölçmektir.

## Aynı etkileşime iki kez bak

İlk denemede arama kutusuna tek harf yaz. Geliştirici araçlarındaki **React DevTools Profiler**, bir etkileşim sırasında hangi bileşenlerin çalıştığını ve render işleminin ne kadar sürdüğünü gösteren kayıt aracıdır. Kayıt al, harfi yaz, sonra kaydı durdur. Sinema sayfasında `SearchPage` ile film sonuç listesini ayrı ayrı seçip hangisinin zaman aldığını incele.

Örneğin ilk kayıtta `SearchPage` kısa sürerken `MovieGrid` uzun sürmüş olsun. Bu, input etiketinin yavaş olduğu anlamına gelmez; arama state'i değiştiğinde film listesinin de yeniden hesaplandığını gösterir. İkinci kayıtta liste süresi kısa, ama input'un boyanması gecikiyorsa başka bir iş parçacığı ya da tarayıcı işi araştırılmalıdır. Ölçüm, çözümü sorunun görüldüğü yere yaklaştırır.

Bir **render**, React'in bileşen fonksiyonunu güncel props ve state ile çağırıp ekranda bulunması gereken çıktıyı hesaplamasıdır. React yeni çıktıyı öncekiyle karşılaştırır; bu karşılaştırma sürecine **diffing** denir. Sonra gerekli DOM değişiklikleri **commit** edilir, yani gerçek sayfaya uygulanır. Render olması tek başına DOM'un değiştiğini söylemez.

```text
Tuşa basılır → state güncellenir → render/diffing → commit → tarayıcı boyar
```

Bu ayrım önemlidir: çok sayıda bileşen çalışıp sonunda DOM değişmese bile JavaScript hesaplama yapmıştır. Öte yandan çok sayıda DOM güncellemesi de tarayıcının ana iş parçacığını (main thread: JavaScript ve arayüz işlerinin sırayla yürüdüğü ana hat) meşgul edebilir.

:::model[Render → commit → effect]
Render çıktıyı hesaplar, commit gerekli DOM değişikliklerini uygular, effect commit sonrasında çalışır.

![Render, commit ve effect aşamaları](diagram:render-commit)
:::

## Önce küçük bir ölçüm

React'in `<Profiler>` bileşeni, içine aldığın ağaç için commit kaydı verir. Bu ilk örnekte oyuncu adlarının bulunduğu paneli sarıyoruz. `onRender` adını verdiğimiz callback, ölçüm sonucunu dışarı ileten fonksiyondur.

```tsx check
import { Profiler } from 'react'
import type { ProfilerOnRenderCallback } from 'react'

export function CastPanel({
  cast,
  onCommit,
}: {
  cast: { id: string; name: string }[]
  onCommit: ProfilerOnRenderCallback
}) {
  return (
    <Profiler id="cast-panel" onRender={onCommit}>
      <section>
        <h2>Oyuncular</h2>
        <ul>
          {cast.map((person) => <li key={person.id}>{person.name}</li>)}
        </ul>
      </section>
    </Profiler>
  )
}
```

`Profiler` yalnızca sardığı liste ağacını gözlemler. İlk ekranda ağaç oluşturulduğunda `phase` değeri `mount`, daha sonraki güncellemelerde `update` olur. `actualDuration`, o render için React'in alt ağacı hesaplamaya harcadığı süredir; `baseDuration` ise alt ağaç hiç atlanmadan çalışsa yaklaşık ne kadar süreceğine dair tahmindir. Bunlar bir teşhis ipucudur, her cihazda aynı çıkacak garanti değerler değildir.

## Bir harfi sırayla izleyelim

Listeyi arama state'iyle birlikte düşünelim. Aşağıdaki zaman çizelgesinde ölçümün ne zaman geldiğine dikkat et:

| Adım | Olay | Görülen sonuç |
|---|---|---|
| 1 | Kullanıcı `M` yazar | Input olayı çalışır. |
| 2 | `setQuery('M')` çağrılır | React state güncellemesini sıraya alır. |
| 3 | Sayfa ve liste render edilir | React yeni JSX çıktısını hesaplar ve karşılaştırır. |
| 4 | Gerekli DOM değişiklikleri commit edilir | Yeni sorgu ve sonuçlar sayfaya uygulanır. |
| 5 | `onRender` çalışır | `phase`, süreler ve `cast-panel` kimliği ölçüm callback'ine verilir. |
| 6 | Tarayıcı boyar | Kullanıcı güncellenen arayüzü görür. |

`onRender` commit'ten sonra çağrıldığı için bu callback'i ölçümü kaydetmek veya dışarı aktarmak için kullanırsın. Callback içinde aynı ağacın state'ini değiştirmek yeni render başlatır; bu yeni commit de callback'i tekrar çağırır. Aşağıdaki gerçekçi hata, sayaç ekleyerek ölçmeye çalışmaktır:

```tsx
// Hatalı fikir: her commit yeni state ve yeni commit doğurur.
<Profiler id="movie-grid" onRender={() => setCommitCount((n) => n + 1)}>
  <MovieGrid movies={movies} />
</Profiler>
```

Belirti, sayfanın kilitlenmesi ve `Maximum update depth exceeded` hatasıdır. Nedeni callback'in commit sonrasında state güncellemesi yapıp döngüyü kendisinin sürdürmesidir. Sayaç yerine callback'i bir üst bileşenden gelen `onCommit` fonksiyonuna bağla veya DevTools kaydını incele; ölçüm sonucu için aynı ekrandaki state'i değiştirme.

## Süreyi değil, karşılaştırmayı oku

Şimdi aynı aramayı iki kez kaydet: birinde 12 film, diğerinde 500 film olsun. İlk kayıt 3 ms, ikincisi 40 ms sürebilir; fakat kendi bilgisayarında ölçtüğün bu süre başka bir telefonda ya da geliştirme ortamında aynı çıkmayabilir. Aynı arama etkileşiminde hangi bileşenlerin tekrar çalıştığını ve commit sayısının nasıl değiştiğini karşılaştır. Bu karşılaştırma, tek bir mutlak süre eşiğinden daha işe yarar.

DevTools'taki **flamegraph** (alev grafiği), bileşenleri iç içe kutularla gösterir; geniş ve uzun süren kutulara bakarak hangi alt ağacın süre aldığını bulabilirsin. Bir bileşenin niçin çalıştığını gösteren “props changed” gibi açıklamalar da hangi girdiye bakacağını söyler. Önce bir kullanıcı hareketini kaydet, sonra grafikte yalnızca o hareketle ilişkili ağacı incele.

Gerçek kullanıcıların cihazlarından anonim performans ölçümü toplamaya **RUM** (Real User Monitoring: gerçek kullanıcı izleme) denir. Çok sayıda ölçümde **p75**, değerlerin yüzde 75'inin altında kaldığı yüzdelik noktadır; tek bir yavaş cihazın uç değerine göre karar vermeni önler. Bu ölçümler ürün düzeyinde yararlıdır, ama ilk teşhiste DevTools kaydıyla başlamak daha anlaşılırdır.

:::info[Derinlemesine (isteğe bağlı)]
`onRender` callback'i `id`, `phase`, `actualDuration`, `baseDuration`, `startTime` ve `commitTime` bilgilerini alabilir. `startTime` render hesabının başlangıcını, `commitTime` commit anını gösterir. Çoğu günlük incelemede DevTools Profiler yeterlidir; callback alanlarını kullanacağın zaman React'in `<Profiler>` API açıklamasına bak.
:::

## Özet

- Önce etkileşimi kaydet; gecikmenin input'ta mı, hesaplamada mı, DOM commit'inde mi olduğunu ölç.
- `<Profiler>` yalnızca sardığı React ağacının commit ölçümlerini verir.
- Render fonksiyon çağrısıdır; commit gerekli DOM değişikliklerini uygular.
- Süreler cihaza göre değişir. Aynı etkileşimdeki bileşenleri ve commit sayısını karşılaştır.

**Yeni terimler**

- **Diffing:** Yeni React çıktısıyla önceki çıktıyı karşılaştırma; hangi DOM değişikliklerinin gerektiğini bulur.
- **Main thread:** JavaScript ve arayüz işlerinin yürüdüğü tarayıcı ana hattı; uzun iş ekran etkileşimini geciktirebilir.
- **Flamegraph:** Bileşenlerin iç içe kutularla gösterildiği Profiler görünümü; zaman alan alt ağacı bulmaya yardım eder.
- **RUM / p75:** Gerçek kullanıcı cihazlarından ölçüm / ölçümlerin yüzde 75'inin altında kaldığı değer.

### Kendini yokla

1. `onRender` içinde aynı ağacın state'ini artırırsan ne olur?
   **Cevap:** Her commit yeni state ve yeni commit doğurabilir; callback döngüsü oluşur. Ölçümü dışarı ilet.
2. İlk Profiler kaydında `phase` neyi söyler?
   **Cevap:** `mount` ağacın ilk kez ekrana gelişini, `update` sonraki güncellemeyi gösterir.
