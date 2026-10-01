---
title: "Hareket tercihi ve sayfa geçişleri"
minutes: 16
kind: concept
---

# Hareket tercihi ve sayfa geçişleri

Sinema'daki bir film kartı pointer üzerine gelince hafifçe büyüyebilir. Büyüme yalnızca görsel bir ipucudur; kartın başlığı ve düğmesi animasyon olmadan da kullanılabilmeli. Ayrıca bazı kullanıcılar işletim sistemlerinde **azaltılmış hareket tercihi** seçer; bu tercih, ekrandaki hareketi azaltmamızı ister.

## Kartı yerinden oynatmadan büyüt

İlk olarak hover'da kartın ölçeğini değiştir:

```tsx check
export function ScreeningCard() {
  return (
    <article className="transition-transform duration-200 ease-out hover:scale-[1.02]">
      <h2>Gece Seansı</h2>
      <p>20.30 · Salon 2</p>
    </article>
  )
}
```

`transform` kartın görünen şeklini değiştirir, ama sayfadaki yerini hesaplamak için kullanılan kutu boyutu aynı kalır. Bu yüzden yanındaki kart yerinden itilmez. Geometriyi değiştiren **layout** (öğelerin ekrandaki boyut ve konum hesabı) özelliklerini her karede oynatmak tarayıcıya daha çok iş çıkarabilir.

Bir animasyonun bir karesinde tarayıcı stilleri uygular, gereken çizimi hazırlar ve katmanları ekranda birleştirir. **Compositor**, hazır görsel katmanları birleştirip ekrana sunan tarayıcı bölümüdür; `transform` ve `opacity` çoğu durumda bu aşamada değişebilir. Bu her zaman bedava olduğu anlamına gelmez: çok büyük ya da çok sayıda katmanı gerçek cihazda ölçmek gerekir.

İkinci adım, hareketi azaltmayı isteyenler için hover büyümesini kaldırmak. **`prefers-reduced-motion`**, tarayıcının işletim sistemindeki hareket tercihini CSS ve JavaScript'e bildirdiği medya sorgusudur.

```tsx check
export function ScreeningCard() {
  return (
    <article className="transition-transform duration-200 ease-out motion-safe:hover:scale-[1.02] motion-reduce:transition-none">
      <h2>Gece Seansı</h2>
      <p>20.30 · Salon 2</p>
    </article>
  )
}
```

`motion-safe:` hover ölçeğini hareketi azaltmayı seçmemiş kullanıcıda etkinleştirir; `motion-reduce:` tercihi olan kullanıcı için geçişi kapatır. Kartın bilgisi ve kullanılabilirliği iki durumda da aynıdır. Hareket yalnızca süs ise sadeleştirmek güvenlidir; yön bulma veya durum değişikliğini anlaşılır kılan bir hareket varsa neyi kaybettiğimizi de düşünmeliyiz.

![Animasyon kararı kullanıcı tercihini ve animasyonun özellik maliyetini birlikte gözetir](diagrams/hareket-karari.svg "Tercih kontrolü ile özellik maliyeti animasyon kararını belirler")

## Tarayıcı tercihi değişirse

CSS görsel bir geçişi kontrol edebilir. JavaScript davranışını değiştirmek istediğinde `window.matchMedia('(prefers-reduced-motion: reduce)')` kullanılır. Bu çağrı bir **MediaQueryList** döndürür: sorgunun şu an eşleşip eşleşmediğini ve değişimini dinleyebileceğin kaynağı verir. `matches` ilk tercihi gösterir. Sonradan gelen `change` olayı bir **MediaQueryListEvent** taşır; bu event'in `matches` alanı yeni tercihin doğru mu yanlış mı olduğunu bildirir.

Örneğin film fragmanı açılırken otomatik kayan bir tanıtım varsa, azaltılmış hareket tercihi etkin olduğunda kaymayı başlatmamak isteyebilirsin. React'te tercih okunup component state'ine yansıtılır; listener effect içinde eklenir ve component kaldırılırken aynı callback ile temizlenir. Böylece yalnızca ilk değere bakıp kullanıcının sonradan değiştirdiği ayarı kaçırmazsın.

| Sıra | Ne olur? | Ekrandaki karar |
| --- | --- | --- |
| İlk render | `matchMedia` sorgusunun `matches` değeri okunur | Başlangıç tercihi kullanılır |
| Effect çalışır | `change` listener'ı eklenir | Sonraki ayar değişiklikleri duyulur |
| Sistem tercihi değişir | `MediaQueryListEvent.matches` yeni değeri taşır | React state'i güncellenir, ilgili UI yeniden render olur |
| Component kaldırılır | Effect cleanup listener'ı kaldırır | Artık olmayan UI için callback çalışmaz |

Bu sıradaki yaygın hata listener'ı ekleyip kaldırmamaktır. Sayfa içinde tekrar tekrar açılan bir panel her açılışında yeni listener bırakabilir; ayar değişince eski callback'ler de çalışır. Effect'in cleanup'ında aynı sorgu ve callback ile `removeEventListener` çağır.

Üçüncü örnekte tek bir kartın hover animasyonundan sayfa içeriğinin geçişine çıkalım. Tarayıcının View Transitions API'si eski ve yeni DOM görünümü arasında görsel geçiş kurabilir. React 19.3'te kararlı olan **`ViewTransition`** component'i, React ağacındaki hangi içeriğin bu geçişe katılacağını belirtir.

```tsx check
import { ViewTransition } from 'react'

export function FilmDetails() {
  return (
    <ViewTransition enter="film-enter" exit="film-exit">
      <main>
        <h1>Gece Seansı</h1>
        <p>Yönetmen: Ece Yalın</p>
      </main>
    </ViewTransition>
  )
}
```

Bu sınır, içeriğin eski ve yeni görünümünün eşleştirilmesine yardım eder; her state güncellemesinin otomatik olarak canlandırıldığı anlamına gelmez. `ViewTransition` sunum katmanıdır. Film detayını değiştiren state veya route güncellemesi animasyon olmasa da tamamlanmalı. Tarayıcı API'yi desteklemiyorsa ya da kullanıcı hareketi azaltmışsa, geçişi kapatıp aynı içeriği göstermek gerekir.

## Hareket seçerken aklında tut

Bir animasyonun iki ayrı ölçütü var: kullanıcı tercihi ve tarayıcının her karede yapacağı iş. Önce içeriğin animasyonsuz da anlaşılır olduğundan emin ol, sonra `prefers-reduced-motion` tercihini uygula. Uygun olduğunda `transform`/`opacity` gibi özellikleri dene; geometri değiştiren `width`, `height`, `top` ve margin animasyonlarını ölçmeden yaygın kullanma.

:::mistake[Belirti: Kart büyürken yanındaki kart kayıyor]
Belirti → Hover animasyonu grid'deki diğer kartları itiyor.  
Neden → `width` veya margin değiştiği için layout tekrar hesaplanıyor.  
Düzeltme → Aynı görsel etkiyi `transform` ile kurmayı dene ve gerçek cihazda ölç.
:::

:::mistake[Belirti: Hareket tercihi açıkken geçiş sürüyor]
Belirti → İşletim sisteminde azaltılmış hareket seçili olsa da kart veya sayfa kayıyor.  
Neden → Animasyon koşulsuz uygulanmış ya da JavaScript tercihi yalnızca başlangıçta okunmuş.  
Düzeltme → CSS'te `motion-reduce:`/`motion-safe:` kullan; JS davranışı için değişimi dinle ve listener'ı temizle.
:::

:::mistake[Belirti: Eski tarayıcıda içerik güncellenmiyor]
Belirti → Uygulama değişikliği yalnızca geçiş API'si callback'inde yapıyor.  
Neden → Görsel API uygulamanın çalışması için zorunlu tutulmuş.  
Düzeltme → İçerik güncellemesini normal React akışında yap; animasyon desteklenirse onu ekle.
:::

:::info[Derinlemesine (isteğe bağlı)]
Her transform için compositor katmanı oluşturmak maliyetsiz değildir; belleği artırabilir. Ayrıca `document.startViewTransition` tarayıcı API'si React'ten bağımsız olarak elle kullanılabilir. Bu API'ye geçiş animasyonunu bağla, uygulamanın asıl DOM/state güncellemesini değil.
:::

## Özet

- İçerik animasyon olmadan da anlaşılır ve kullanılabilir kalmalı.
- `prefers-reduced-motion` tercihini CSS'te ele al; JavaScript'e ihtiyaç varsa başlangıç değerini oku, değişimi dinle ve listener'ı temizle.
- `transform` ve `opacity` çoğu zaman geometri değiştiren özelliklerden daha az layout işi çıkarır; gerçek cihazda ölç.
- React `ViewTransition` geçiş görünümüne katılır; uygulamanın asıl state/route güncellemesinin yerine geçmez.

**Yeni terimler:** `prefers-reduced-motion` — sistemin hareketi azaltma tercihini bildiren sorgu; layout — öğelerin boyut ve konum hesabı; compositor — hazır görsel katmanları ekranda birleştiren tarayıcı bölümü; MediaQueryListEvent — medya sorgusu değiştiğinde yeni eşleşme değerini taşıyan event; `ViewTransition` — React içeriğini tarayıcı görünüm geçişine bağlayan component.

**Kendini yokla:** `width` animasyonu neden `opacity` animasyonundan daha fazla iş çıkarabilir?  
*Cevap:* `width` layout geometrisini değiştirip çevredeki öğelerin yeniden yerleşmesine yol açabilir; opacity çoğu durumda katman birleştirme aşamasında değişir.

**Kendini yokla:** Tarayıcı View Transitions API'yi desteklemiyorsa film sayfası ne yapmalı?  
*Cevap:* Animasyonsuz olarak normal React güncellemesini tamamlamalı; geçiş yalnızca görsel iyileştirmedir.
