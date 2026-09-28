---
title: "Acıyı ölç: Profiler"
minutes: 15
kind: concept
---

# Acıyı ölç: Profiler

:::pain[Problem]
Sinema uygulamasında arama sayfasına giriyorsun. Arama kutusuna "Matrix" yazmak istediğinde, her bir tuşa basışında klavye donuyor. İmleç bir an duraksıyor, harf ancak 350 milisaniye sonra kutuda beliriyor. Alt tarafta 500 filmlik liste her harfte titriyor.

Bir iş arkadaşın "Sayfa çok yavaş, hemen birkaç yere memo koyalım" diyor. Ancak nereden başlayacaksın? Darboğaz arama inputunun kendisinde mi, alttaki 500 kartın her harfte yeniden çizilmesinde mi, yoksa JavaScript tarafındaki ağır bir hesaplamada mı? "Yavaş" demek bir teşhis değildir; kanıt olmadan yapılan optimizasyon kodu karmaşıklaştırır ama sorunu çözmez. Önce sorunun boyutunu sayılarla görmen gerekir.
:::

:::model[Render → commit → effect]
Modül 3'te öğrendiğimiz temel yaşam döngüsünü hatırla:

![Render, commit ve effect aşamaları](diagram:render-commit)

1. **Tetikleme (Trigger):** Kullanıcı bir tuşa basar veya bir state güncellenir.
2. **Render (Saf hesaplama):** React bileşen fonksiyonlarını çağırır, JSX çıktısını hesaplar ve önceki sanal ağaçla karşılaştırır (diffing).
3. **Commit (DOM'a uygulama):** React hesaplanan değişiklikleri gerçek DOM'a yazar.
4. **Tarayıcı boyaması (Paint):** Tarayıcı yeni DOM düğümlerini ekrana çizer.

Performans sorunları bu döngünün farklı yerlerinde saklanır: Render aşamasında gereksiz bileşen fonksiyonlarının çağrılması CPU tüketir; Commit aşamasında yüzlerce DOM düğümünün güncellenmesi ise tarayıcının ana iş parçacığını (main thread) kilitler.
:::

## Profiler zihinsel modeli ve çalışma kuralları

React'in yerleşik `<Profiler>` bileşeni, bileşen ağacının belirli bir parçasının ne sıklıkla render edildiğini ve commit aşamasının ne kadar sürdüğünü programatik olarak ölçmeni sağlar.

Profiler bileşenini doğru kullanmak için zihinsel modelini şu kesin kurallarla oluştur:

1. **Yalnızca sardığı alt ağacı ölçer:** `<Profiler>` bileşeni tüm sayfayı ölçmek zorunda değildir; yalnızca içine yerleştirdiğin bileşenleri ve onların çocuklarını gözlemler.
2. **Callback commit sonrası çalışır:** `onRender` fonksiyonu render sırasında değil, React değişiklikleri gerçek DOM'a uyguladıktan (commit ettikten) hemen sonra tetiklenir.
3. **Ölçüm parametreleri zengindir:** Callback fonksiyonu sırasıyla şu argümanları alır:
   - `id: string` — Profiler'a verdiğin benzersiz kimlik.
   - `phase: 'mount' | 'update'` — Ağaç ilk kez mi ekrana basılıyor (`mount`), yoksa bir state/prop değişimiyle mi güncelleniyor (`update`).
   - `actualDuration: number` — O commit için Profiler alt ağacının render edilmesi sırasında harcanan milisaniye cinsinden süre.
   - `baseDuration: number` — Herhangi bir optimizasyon (memoization) olmadan tüm alt ağacın sıfırdan render edilmesi durumunda sürecek tahmini süre.
   - `startTime: number` — React'in bu render döngüsünü hesaplamaya başladığı zaman damgası.
   - `commitTime: number` — React'in bu güncellemeyi DOM'a uyguladığı anın zaman damgası.
4. **Süre donanıma bağlıdır, commit sayısı evrenseldir:** `actualDuration` değeri geliştiricinin 16 çekirdekli güçlü bilgisayarında 2 ms iken, kullanıcının ucuz bir telefonunda 80 ms çıkabilir. Bu yüzden otomatik testlerde ya da mimari kararlarda mutlak milisaniye eşikleri yerine **aynı etkileşimde tetiklenen commit sayısı** ve **güncelleme fazı (`phase`)** esas alınır.

## Bir etkileşimde adım adım iz sürelim

Bir kullanıcı arama kutusuna tek bir "A" harfi yazdığında, sayfanın iki farklı durumunda (10 kayıtlı küçük liste vs 500 kayıtlı büyük liste) nelerin yaşandığını zaman sırasıyla izleyelim:

| Adım | Olay | 10 Kayıtlı Liste | 500 Kayıtlı Liste | Gözlem |
|---|---|---|---|---|
| 1 | Kullanıcı 'A' tuşuna basar | Input `onChange` tetiklenir | Input `onChange` tetiklenir | Girdi tarayıcı tarafından alındı. |
| 2 | `setQuery('A')` çağrılır | State güncellemesi sıraya girer | State güncellemesi sıraya girer | React yeni render döngüsü başlatır. |
| 3 | Üst bileşen render edilir | Input ve liste yeniden çağrılır | Input ve liste yeniden çağrılır | JSX sanal düğümleri üretilir. |
| 4 | Liste bileşeni render süresi | 10 öğe için döngü: ~0.8 ms | 500 öğe için döngü: ~45 ms | CPU 500 öğeyi hesaplarken bekler. |
| 5 | React DOM diffing yapar | 10 düğüm karşılaştırılır | 500 düğüm karşılaştırılır | Değişiklik listesi hazırlanır. |
| 6 | Commit aşaması | DOM'a yazılır (~1 ms) | DOM'a yazılır (~80 ms) | Tarayıcı ana iş parçacığı kilitlenir. |
| 7 | `Profiler` `onRender` tetiklenir | `phase: 'update'`, `actualDuration: ~1.8 ms` | `phase: 'update'`, `actualDuration: ~125 ms` | İki ölçüm arasındaki uçurum görünür! |
| 8 | Tarayıcı boyaması (Paint) | Harf anında ekranda belirir | Harf 130 ms gecikmeyle ekranda belirir | Kullanıcı takılmayı bizzat hisseder. |

Bu tablo bize çok önemli bir ders verir: Sorun klavyede ya da input etiketinde değil, input her güncellendiğinde aynı ağaçta bulunan 500 öğelik listenin de gereksiz yere baştan sona commit edilmesindedir.

## Kod örneği: Denetim günlüğünde commit ölçümü

Şimdi bir yönetim panelindeki denetim günlüğü (`AuditLog`) üzerinden Profiler kullanımını inceleyelim.

### Kırık yaklaşım: Ölçüm callback'inde state güncellemek

Geliştiricilerin düştüğü en büyük tuzak, Profiler'ın yakaladığı süreyi veya sayacı bileşenin kendi state'ine yazmaya çalışmaktır:

```tsx
// YANLIŞ: Sonsuz render döngüsü yaratır!
function BrokenAuditFeed({ logs }: { logs: string[] }) {
  const [commitCount, setCommitCount] = useState(0)

  return (
    <div>
      <p>Toplam Commit: {commitCount}</p>
      <Profiler
        id="audit-feed"
        onRender={() => {
          // Her commit olduğunda state güncellenir!
          // State güncellenince bileşen tekrar render edilir!
          // Tekrar render olunca tekrar commit olur!
          // TEKRAR onRender ÇAĞRILIR -> SONSUZ DÖNGÜ!
          setCommitCount((c) => c + 1)
        }}
      >
        <ul>
          {logs.map((log) => (
            <li key={log}>{log}</li>
          ))}
        </ul>
      </Profiler>
    </div>
  )
}
```

Bu kod çalıştığı anda tarayıcı donar ve konsolda `"Maximum update depth exceeded"` hatası belirir. Çünkü `onRender` commit sonrasında çalışır; commit anında state güncellersen yeni bir commit sipariş etmiş olursun.

### Doğru yaklaşım: Ölçümü dışarıya aktarmak

Ölçüm bilgisini ya bileşen ağacının dışındaki bir callback'e teslim etmeli ya da bir ref / harici telemetri servisine göndermeliyiz:

```tsx check
import { Profiler } from 'react'
import type { ProfilerOnRenderCallback } from 'react'

export interface AuditEntry {
  id: string
  action: string
  timestamp: string
}

interface AuditedFeedProps {
  entries: AuditEntry[]
  onFeedCommit: ProfilerOnRenderCallback
}

export function AuditedFeed({ entries, onFeedCommit }: AuditedFeedProps) {
  return (
    <section>
      <h2>Sistem Denetim Kayıtları</h2>
      <Profiler id="audit-feed" onRender={onFeedCommit}>
        <div className="feed-container">
          {entries.map((entry) => (
            <article key={entry.id} className="feed-item">
              <time>{entry.timestamp}</time>
              <p>{entry.action}</p>
            </article>
          ))}
        </div>
      </Profiler>
    </section>
  )
}
```

Bu yapıda `AuditedFeed` bileşeni kendi içinde state tutmaz. React ağacı her commit ettiğinde `onFeedCommit` çağrılır; üst katmandaki test fonksiyonu (`vi.fn()`) veya izleme sistemi kaç kez `update` ya da `mount` commit'i yapıldığını güvenle sayar.

## Sınır durumları ve sık yapılan hatalar

:::mistake[1. Profiler callback'inde setState çağırmak]
- **Belirti:** Sayfa açılır açılmaz kilitlenir; konsolda `Maximum update depth exceeded` hatası basılır.
- **Neden:** `onRender` commit aşamasından sonra tetiklenir. Aynı bileşenin state'ini güncellemek anında yeni bir render-commit döngüsü başlatarak sonsuz döngüye girer.
- **Düzeltme:** Ölçüm sonuçlarını bileşen state'ine yazma. `console.log`, harici bir log servisi, bir React `ref`'i veya üst bileşene iletilen bir prop callback'i kullan.
:::

:::mistake[2. Geliştirme modundaki StrictMode çift çağrısını hata sanmak]
- **Belirti:** Bileşeni ilk açtığında `onRender` callback'inin iki kez çalıştığını görürsün ve gereksiz render var zannedersin.
- **Neden:** `React.StrictMode`, yan etkileri ve bellek sızıntılarını erken yakalamak için geliştirme ortamında bileşenleri bilinçli olarak iki kez render eder.
- **Düzeltme:** Bu durum canlıda (production build) gerçekleşmez. Karar verirken tekil milisaniyelere takılma; kullanıcı bir etkileşimde bulunduğunda (ör. butona basınca) kaç commit tetiklendiğine odaklan.
:::

:::mistake[3. Testlerde sabit süre eşikleri beklemek]
- **Belirti:** Yerel makinede geçen test (`expect(actualDuration).toBeLessThan(10)`), CI sunucusunda ya da arkadaşının bilgisayarında rastgele kalır.
- **Neden:** Donanım hızı, CPU çekirdek sayısı, arka planda çalışan işlemler her ortamda farklı süreler üretir.
- **Düzeltme:** Testlerde asla süre eşiği sınama. Testlerde mock fonksiyonlarla `onRender` çağrı sayısını ve `phase` değerinin `'mount'` mu yoksa `'update'` mi olduğunu doğrula.
:::

:::sector[Sektörde nasıl kullanılır?]
Gerçek dünya projelerinde Profiler iki temel biçimde kullanılır:

1. **React DevTools Profiler:** Geliştirme sırasında Chrome DevTools içindeki Profiler sekmesinden "Kayıt al" (Record) butonuna basılır, kullanıcı etkileşimi yapılır ve kayıt durdurulur. DevTools alev grafiği (flamegraph) ile her bileşenin neden render olduğunu ("Props changed", "Hook 2 changed") ve kaç milisaniye sürdüğünü renklerle gösterir.
2. **RUM (Real User Monitoring):** Üretim ortamında kritik akışlar (örneğin ödeme adımı veya ürün arama) `<Profiler>` ile sarılır; toplanan `actualDuration` değerleri Google Analytics, Sentry veya Datadog gibi izleme servislerine gönderilerek 75. yüzdelik (p75) süreleri takip edilir.
:::

## Özet

- Performansı optimize etmeden önce mutlaka ölçüm yapılmalıdır; varsayımla kod değiştirmek gereksiz karmaşıklık üretir.
- `<Profiler id="..." onRender={callback}>` bileşeni, sardığı alt ağacın commit aşamalarını izler.
- `onRender` fonksiyonu commit sonrasında çalışır; `id`, `phase` (`mount`/`update`), `actualDuration` ve `baseDuration` gibi kritik veriler sunar.
- `onRender` gövdesinde doğrudan aynı bileşenin state'ini güncellemek sonsuz render döngüsüne yol açar.
- Süreler cihazdan cihaza değişir; bu yüzden ilk aşamada odaklanılması gereken temel gösterge aynı kullanıcı eyleminde tetiklenen commit sayısıdır.

### Kendini yokla

1. **Soru:** `<Profiler id="feed" onRender={cb}>` altındaki bir liste için `onRender` ikinci kez çağrıldığında `phase` parametresi hangi değeri alır?
   - **Cevap:** `'update'` değerini alır (ilk gösterimde `'mount'`, sonraki her commit işleminde `'update'` gelir).

2. **Soru:** Bir bileşenin render süresini ekranda kullanıcıya canlı olarak bir sayaçla göstermek istiyorsun. Neden Profiler'ın `onRender` callback'inde `setDuration(actualDuration)` yapamazsın?
   - **Cevap:** Çünkü `onRender` commit sonrası tetiklenir; orada `setDuration` çağırmak hemen yeni bir render ve commit tetikler, bu da sonsuz bir döngü başlatarak uygulamanın çökmesine yol açar.
