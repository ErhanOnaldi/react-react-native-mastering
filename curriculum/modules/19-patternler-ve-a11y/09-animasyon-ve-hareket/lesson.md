---
title: "Animasyon, hareket tercihi ve View Transitions"
minutes: 17
kind: concept
---

# Animasyon, hareket tercihi ve View Transitions

:::pain[Problem]
Sinema film kartı hover'da büyüyor, ayrıntı sayfası açılırken de içerik soldan kayıyor. Hareket hassasiyeti olan bir kullanıcı aynı ekranda tekrarlanan büyüme ve kaymalardan rahatsız oluyor; başka bir cihazda geçiş kare hızı düşürüp sayfayı ağır hissettiriyor. Animasyon hem erişilebilir olmalı hem de tarayıcıya gereksiz layout işi çıkarmamalı.
:::

## Hareketi bir tercih ve maliyet olarak düşün

Animasyon bir bileşenin state'ini değiştirmez; değişen görsel durumları zaman içinde bağlar. Bu bağın iki sorusu var: Tarayıcı her karede ne kadar iş yapıyor ve kullanıcı bu hareketi görmek istiyor mu? İkisini birlikte düşünmek, geçişi yalnızca “güzel mi?” diye seçmekten daha güvenlidir.

:::model[Hareket karar akışı]
Önce değişikliğin işlevi animasyonsuz da tamamlayıp tamamlamadığını belirle. Sonra kullanıcının `prefers-reduced-motion` tercihini uygula. Hareket sunulacaksa mümkün olduğunca `transform` ve `opacity` ile kur; geometry değiştiren özellikleri ölçmeden animasyonun merkezine koyma.
:::

![Animasyon kararının kullanıcı tercihi ve animasyon maliyeti üzerinden ilerlemesini gösteren diyagram](diagrams/hareket-karari.svg "Tercih kontrolü ile özellik maliyeti animasyon kararını belirler.")

Kurallar:

1. **Anlam animasyona bağlı olmasın.** Panelin açılması, sekmenin değişmesi veya mesajın görünmesi animasyon olmadan da anlaşılmalı ve kullanılmalı.
2. **Kullanıcının hareket tercihini gözet.** CSS'te `motion-reduce:` ile hareketi kaldırabilir veya sadeleştirebilirsin. Hareket yalnızca deneyim iyileştiriyorsa `motion-safe:` ile tercih edilen kullanıcı grubunda etkinleştir.
3. **Tercih değişimini canlı izle.** JavaScript davranışı tercihe bağlıysa `matchMedia('(prefers-reduced-motion: reduce)')` sonucunu başlangıçta oku ve `change` olayında güncelle; listener'ı temizle.
4. **Kare başına yapılan işi azalt.** `opacity` ve `transform` çoğu senaryoda layout hesaplatmadan işlenebilir. `width`, `height`, `top` ve margin değişimi layout ve paint maliyetini artırabilir.
5. **Geçiş API'si başarısız olsa da güncelleme sürsün.** Tarayıcı View Transitions API'yi desteklemiyorsa DOM/state değişikliğini normal yoldan yap.
6. **React geçişini normal güncellemeden ayır.** React 19.3'te `<ViewTransition>` kararlı API'dir; geçiş olarak işaretlenmiş güncellemelerin eski ve yeni görünümünü eşleştirir. Sıradan state güncellemesinin her biri animasyon almaz.

## Bir kartın görünümünü zaman içinde izleyelim

Bir kart hover olduğunda 1.02 ölçeğine çıkıyor. Tarayıcı önce pointer konumunu ve hover state'ini görür, sonra yeni stil değerlerini hesaplar. `transform` değiştiği için kutunun gerçek layout ölçüsü sabit kalır; kartın yanındaki içerik yerinden oynamaz. Aynı etki `width` ile kurulursa komşu öğeler de tekrar yerleştirilebilir.

| Zaman | Olay | Tarayıcı/uygulama sonucu |
| --- | --- | --- |
| 1 | Pointer karta girer | `:hover` stili eşleşir |
| 2 | CSS geçişi başlar | `transform` ölçek değeri ara karelere bölünür |
| 3 | Her kare çizilir | Layout boyutu değişmez; görsel kompozisyon güncellenir |
| 4 | Hareket tercihi reduce ise | Geçiş yoktur veya tek kareye sadeleşir |
| 5 | Pointer çıkar | Stil başlangıç değerine döner |

Bu “transform her zaman bedavadır” anlamına gelmez. Çok sayıda büyük katmanı zorlamak bellek ve compositing maliyeti getirebilir. Gerçek cihazın performans panelinde ölç; dar bir cihazda iyi çalışan tercih masaüstündeki yüzlerce kartta aynı sonucu vermeyebilir.

## Önce kırık, sonra tercih duyarlı

Bu örnek hover büyümesini herkes için çalıştırır:

```tsx check
import type { CSSProperties } from 'react'

const cardStyle: CSSProperties = {
  transition: 'transform 220ms ease-out',
  transform: 'scale(1.04)',
}

export function EventCard() {
  return <article style={cardStyle}>Akşam gösterimi</article>
}
```

Burada ayrıca hover durumu yok ve hareket tercihi okunmuyor. Tailwind sınıflarıyla geçişi etkileşime bağlayıp sistem tercihini de gözetebiliriz:

```tsx check
export function EventCard() {
  return (
    <article className="transition-transform duration-200 ease-out motion-safe:hover:scale-[1.02] motion-reduce:transition-none">
      Akşam gösterimi
    </article>
  )
}
```

`motion-safe:` yalnızca kullanıcı hareketi azaltmayı istemediğinde hover ölçeğini verir. `motion-reduce:transition-none` animasyon süresini kapatır. Kartın içeriği ve kullanılabilirliği hover'a bağlı değildir. Uzun bir açıklamayı gizleyip yalnızca animasyon bitince göstermek gibi davranıştan kaçın.

## `matchMedia` ile karar veren davranış

Bazı değişikliklerde CSS yetmez: örneğin kullanıcı tercihi açıksa toast'ın kayan girişini hiç başlatmamak veya canlı duyuru öncesinde birden çok görsel durumu atlamak isteyebilirsin. `window.matchMedia` bir `MediaQueryList` verir. İlk değer `matches` alanındadır; işletim sistemi ayarı değiştiğinde `change` olayı gelir. React içinde state'e taşıyorsan event listener effect'te kaydolur ve cleanup'ta kaldırılır.

Akış şöyle ilerler: ilk render mevcut `matches` değerini okur; effect sorguyu kurup listener ekler; değişiklik olayı geldiğinde event içindeki yeni `matches` değeri state'e yazılır; unmount'ta aynı callback kaldırılır. Böylece ilk okumadan sonra kullanıcı Ayarlar uygulamasından tercihini değiştirirse görünüm eski seçime takılı kalmaz.

Tarayıcı test ortamı `matchMedia` sağlamayabilir. Bu durumda testte `vi.stubGlobal` ile `matches`, `addEventListener` ve `removeEventListener` davranışlarını taklit edebilirsin. Bu, gerçek tarayıcı erişilebilirlik denemesinin yerine geçmez; hook'un değişim ve temizlik sözleşmesini doğrular.

## Sayfa geçişleri ve View Transitions

Tarayıcının View Transitions API'si eski ve yeni DOM durumlarını görsel geçiş için eşleştirir. Elle çağrılan `document.startViewTransition(() => updateDom())` destekleniyorsa geçişi başlatır; destek yoksa `updateDom()` yine çalışmalıdır. Bu nedenle API desteği uygulamanın asıl mantığı için zorunlu olmamalı.

React 19.3, `<ViewTransition>` bileşenini kararlı hale getirdi. React geçiş sınırının içindeki eski ve yeni arayüzü tarayıcı geçişiyle ilişkilendirebilir; `enter`, `exit` veya `update` davranışına CSS class adları verebilirsin. Geçişi sınıflarla özelleştirebilirsin:

```tsx check
import { ViewTransition } from 'react'

export function FilmRoute() {
  return (
    <ViewTransition enter="page-enter" exit="page-exit">
      <main>Film ayrıntısı</main>
    </ViewTransition>
  )
}
```

Bu örnek yalnızca geçiş yerini gösterir. Hareket tercihini yine ele almalısın: CSS geçişi `motion-reduce` ile kapatılabilir, JS tarafından yönetilen güncelleme tercih açıksa animasyon olmadan uygulanabilir. Görünüm geçişi veri yüklenmesinin, route erişiminin veya klavye focus'unun yerine geçmez.

## Sık hatalar

:::mistake[Belirti: Kart hareket ederken çevresindeki satır da titriyor]
Belirti → Hover'da kart genişleyince grid'deki komşu öğeler itiliyor.  
Neden → `width` veya margin animasyonu layout ölçülerini değiştiriyor.  
Düzeltme → Önce `transform`/`opacity` ile aynı görsel sonucu üretmeyi dene; görünüm çizgiyi taşıyorsa gerçek cihazda profil çıkar.
:::

:::mistake[Belirti: Ayarlarda hareketi azaltınca animasyon sürüyor]
Belirti → Sistem tercihi reduce olduğu halde toast kayarak geliyor.  
Neden → Stil tüm kullanıcılara koşulsuz uygulanmış ya da JS tercihi bir kez okuyup değişimi dinlememiş.  
Düzeltme → Görsel geçişte `motion-reduce` kullan; JS state'i gerekiyorsa `matchMedia` change listener ekle ve temizle.
:::

:::mistake[Belirti: Eski tarayıcıda geçiş sırasında içerik yenilenmiyor]
Belirti → Kod güncellemeyi yalnızca `startViewTransition` callback'ine bağlamış.  
Neden → Görsel API uygulamanın çalışması için zorunlu tutulmuş.  
Düzeltme → Destek yoksa doğrudan DOM/state güncellemesini çalıştır; animasyon yalnızca sunum katmanı olsun.
:::

:::sector
Ürün ekipleri motion tasarımını tasarım sistemi token'ları ve kullanıcı tercihiyle birlikte ele alır. Kod incelemesinde animasyonun amacı, azaltılmış hareket karşılığı ve pahalı özelliklerin ölçümü konuşulur. React geçiş sınırları sayfa içeriği değişimini yumuşatabilir; ekipler yine de klavye odağının doğru yerde kalmasını ve içerik güncellemesinin animasyonsuz da tamamlanmasını kontrol eder.
:::

## Özet

- Arayüz animasyonsuzken de anlaşılır ve kullanılabilir kalmalı.
- Azaltılmış hareket tercihini CSS'te `motion-reduce`/`motion-safe`, davranışta `matchMedia` ile gözet.
- `transform` ve `opacity` çoğu durumda geometry değiştiren özelliklerden daha ucuzdur; sonucu ölç.
- React `<ViewTransition>` geçiş görünümünü yönetir, uygulamanın asıl güncellemesini değil.

**Kendini yokla:** `width` animasyonu neden `opacity` animasyonundan daha pahalı olabilir?  
*Cevap:* Genişlik layout geometrisini değiştirip komşu öğelerin yeniden yerleşmesine yol açabilir; opacity çoğunlukla compositor'da değişir.

**Kendini yokla:** View Transitions API desteklenmiyorsa sayfa güncellemesi ne yapmalı?  
*Cevap:* Animasyonsuz olarak aynı içerik güncellemesini tamamlamalı; API yalnızca görsel iyileştirmedir.
