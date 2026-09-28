---
title: "Bileşen API'sini TypeScript ile kur"
minutes: 14
kind: concept
---

# Bileşen API'sini TypeScript ile kur

:::pain[Bir ikon alanına metin koymak]
Tasarım sistemi ekibindeki kart bileşeni `icon: string` bekliyor. Kullanıcı ikonunu JSX ile göndermek isteyince TypeScript “Element is not assignable to string” diyor. Tipi `any` yapınca hata kayboluyor; bu kez bileşen içine yanlışlıkla `disabled` yazınca da derleyici ses çıkarmıyor. Sorun JSX'in kendisi değil: bileşen API'si kabul ettiği içerik ve devrettiği davranışları doğru tarif etmiyor.
:::

## Props, bileşenin sözleşmesidir

Component props'u çağıran ile bileşen arasındaki veri sözleşmesidir. Tipi, hangi bilginin zorunlu olduğunu, hangisinin isteğe bağlı olduğunu ve hangi callback'in hangi veriyi ileteceğini söyler. TypeScript burada uygulamanın dış dünyasından veri doğrulamıyor; kod içindeki kullanımları aynı sözleşmeye göre denetliyor.

Bir bileşen API'sini tasarlarken şu kuralları izle:

1. **Zorunlu bilgiyi zorunlu yaz.** Başlık olmadan kart anlamlı değilse `title: string` kullan. Çağıranın her zaman sağlamasını beklediğin alanı optional yapma.
2. **Gerçekten eksik kalabileni optional yap.** `caption?: string`, çağıranın caption vermeyebileceği anlamına gelir; bileşen bu durumda ne göstereceğine karar vermelidir. `string | undefined` benzer değerleri ifade eder ama `?` nesne alanının çağrıda hiç verilmeyebileceğini daha açık anlatır.
3. **İçeriği ve veriyi ayır.** `Movie` gibi uygulama verisi ile ekranda gösterilecek çocuk içeriği farklı şeylerdir. `children` için çoğu zaman `ReactNode` gerekir; bu string, JSX elementi ve başka render edilebilir içerikleri kapsar.
4. **Callback'in giriş ve dönüşünü yaz.** Örneğin `onSelect: (id: number) => void`, çağıranın hangi veriyi alacağını belirtir. Bileşen callback'in sahibi değildir; onu aldığı props üzerinden çağırır.
5. **HTML davranışını koruyacaksan yerleşik tipten türet.** Native button özelliklerini tekrar tekrar yazmak yerine `ComponentProps<'button'>` kullanabilirsin. Bileşenin koruması gereken bir alanı `Omit` ile çıkar.

İlk denemede bu iki ayrı kavramı tek `string` alana sıkıştırmış olabilirsin:

```tsx
type BrokenCardProps = { icon: string }
function BrokenCard({ icon }: BrokenCardProps) {
  return <div>{icon}</div>
}

const card = <BrokenCard icon={<span aria-hidden="true">★</span>} />
```

Bu kullanım JSX elementi string olmadığı için derlenmez. Prop'u `any` yaparak susturmak da sözleşmeyi yok eder; yanlışlıkla film nesnesi veya fonksiyon vermek mümkün olur. Prop yalnız yazı olacaksa gerçekten `string` kalsın. Çağıran farklı React içeriği gönderecekse `ReactNode` doğru sınırdır.

Props tipini bileşenin içine yazmak zorunlu değildir, ama imza görünür olmalıdır. Aşağıdaki kutu, bir etkinlik kartına özelleştirilebilir görsel içerik ve opsiyonel alt metin veriyor:

![Çağıranın props sözleşmesini tip kontrolünden geçirip bileşene vermesi](diagrams/props-sozlesmesi.svg "Props sözleşmesi")

```tsx check
import type { ReactNode } from 'react'

type SessionCardProps = {
  title: string
  visual: ReactNode
  note?: string
}

function SessionCard({ title, visual, note }: SessionCardProps) {
  return (
    <article>
      {visual}
      <h2>{title}</h2>
      {note !== undefined && <p>{note}</p>}
    </article>
  )
}

const card = <SessionCard title="Akşam gösterimi" visual={<span aria-hidden="true">▶</span>} />
void card
```

Buradaki `visual`, string olarak saklanan bir ikon adı değil, React'in render edebileceği içeriktir. `note` yoksa paragraf hiç üretilmez. Eğer boş string de “not yok” demekse `note` değerini `''` ile `undefined` durumlarından ayıran bir politika belirlemek gerekir; TypeScript senin yerine bu ürün kararını vermez.

## Yerleşik HTML props'larını yeniden kullan

Wrapper bileşeni native `<button>` özelliklerinin çoğunu geçirecekse tipini baştan kopyalama. Yerleşik tip hem `disabled`, `onClick`, `aria-pressed` gibi özellikleri taşır hem de React'in gerçek button sözleşmesiyle uyumlu kalır. Bileşen bazı değerleri sabitlemek istiyorsa bunları dış API'den çıkarıp kendi render'ında uygular.

```tsx check
import type { ComponentProps } from 'react'

type ActionProps = Omit<ComponentProps<'button'>, 'type'>

function ActionButton({ children, ...rest }: ActionProps) {
  return <button {...rest} type="button">{children}</button>
}

const action = <ActionButton disabled aria-label="Paneli aç">Aç</ActionButton>
void action
```

`ComponentProps<'button'>` bir type utility'dir; çalışma anında hiçbir kod çalıştırmaz. `Omit<..., 'type'>`, çağıranın `type="submit"` vererek sabit davranışı bozmasını önler. `{ children, ...rest }` ayrıştırması da çocuk metniyle kalan HTML props'larını farklı yerlere taşır. Spread sırası önemlidir: `type="button"` spread'den sonra geldiği için dışarıdan gelse bile sabit kalır. Burada `type` zaten dış tipten çıkarıldığı için bu iki koruma birbirini tamamlar.

Bir callback alanında dönüş değerini de düşün. Click handler'ın sonucunu parent kullanmıyorsa `() => void` yeterlidir. Callback'e tüm React event nesnesini vermek yerine, iş için gerekli `id` veya yeni input string'ini vermek parent'ı DOM API'sine bağlamaz. Bu yaklaşım bileşeni başka bir liste, modal veya test içinde tekrar kullanırken aynı sözleşmenin korunmasını sağlar. Props tipinin amacı her olası girdiyi kabul etmek değil, bileşenin geçerli kullanımını kolaylaştırıp geçersiz kullanımı derleme anında yakalamaktır.

Bir component dış API'sini değiştirmeden içini yeniden düzenleyebilmelidir. Çağıran yalnız `title`, `visual` ve `onChoose` sözleşmesine bağlıysa kartın iç markup'ını veya CSS düzenini değiştirebilirsin; çağıranların veriyi ve aksiyonu sağlama biçimi etkilenmez. Bu nedenle prop isimlerini ekrandaki tesadüfi DOM ayrıntısına göre değil, bileşenin iş anlamına göre seç.

## Bir kullanımın tipini iz sürelim

Çağıran şu kodu yazsın:

```tsx
<SessionCard title="Matine" visual={<strong>Salon 2</strong>} note="15:30" />
```

Derleyici önce bileşenin `SessionCardProps` imzasını bulur. `title` bir string, `visual` JSX olduğu için `ReactNode` ile uyumludur, `note` de opsiyonel string'dir. Eksik `title` veya sayı türünde `note` derleme hatası verir. Runtime'da React bileşeni props nesnesini alır ve o çağrıdaki değerlere göre JSX üretir. Böylece compile-time sözleşmesi ve runtime render'ı birbirine bağlanır ama aynı iş değildir.

Callback'lerde de imza kullanıcıya net sınır verir:

```tsx check
type RatingProps = {
  score: number
  onChoose: (score: number) => void
}

function Rating({ score, onChoose }: RatingProps) {
  return <button onClick={() => onChoose(score + 1)}>Puan: {score}</button>
}

const rating = <Rating score={4} onChoose={(nextScore) => void nextScore} />
void rating
```

Çağıran `onChoose` fonksiyonuna sayısal puan ulaşacağını imzadan görür. Bileşen kendi içinde `score` state'i tutmadığı için kontrol çağırandadır. Eğer callback yalnız “tıklandı” bilgisini taşırsa imza `() => void` olabilir. API'ye gereksiz veri eklemek çağıranı uygulama ayrıntılarına bağlar.

## Sık hatalar

:::mistake[React elementini string sanmak]
Belirti → `<strong>Salon</strong>` verilen prop için TypeScript JSX'in string olmadığını söylüyor.  
Neden → Prop yalnız `string` olarak tanımlanmış; JSX bir React elementidir.  
Düzeltme → İçeriği çağıran sağlayacaksa `ReactNode` seç; yalnız düz yazı gerekiyorsa `string` sözleşmesini koru.
:::

:::mistake[Her alanı optional yapmak]
Belirti → Bileşen içinde `title` için her yerde `title ?? 'Başlıksız'` gibi savunmalar oluşuyor.  
Neden → Gerçekten zorunlu olan alan da `?` yapılmıştır.  
Düzeltme → Ürünün anlamı için gerekli alanları required bırak; yalnız geçerli biçimde atlanabilen alanları optional yap.
:::

:::mistake[Button props'unu eksik kopyalamak]
Belirti → Bileşen disabled olamıyor veya erişilebilir `aria-*` alanını geçiremiyor.  
Neden → HTML özelliklerinin bir kısmı elle yazılıp zamanla unutulmuştur.  
Düzeltme → Yerleşik element tipinden türet ve sabitlemen gereken anahtarları `Omit` ile çıkar.
:::

:::mistake[Props'u bileşen içinde değiştirmek]
Belirti → Bir alt bileşen başlığı büyük harfe çevirip çağıranın nesnesini güncellediği için başka yerde de başlık değişmiş görünüyor.  
Neden → Props paylaşılan giriş değeridir; onu yerinde mutasyona uğratmak çağıranın sahip olduğu veriyi değiştirir.  
Düzeltme → Görsel dönüşümü yeni bir yerel değerle hesapla (`title.toUpperCase()` gibi); parent state'ini değiştireceksen callback iste.
:::

:::sector
Tasarım sistemi ekipleri component API'sini public API gibi ele alır. Yerleşik button props'larını korumak erişilebilirlik ve HTML davranışlarının tutarlı kalmasını sağlar; tipten çıkarılan kilitli özellikler ise tek bir tasarım kararının bütün çağıranlarda korunmasına yardım eder. Bir prop'a isim verirken “bu veri mi, render edilecek slot mu, yoksa kullanıcı eylemi mi?” diye sor.
:::

## Özet

- Props tipi required, optional, içerik ve callback sözleşmesini açıklar.
- `ReactNode`, bileşene metin veya JSX gibi render edilebilir içerik vermek içindir.
- Native props'u `ComponentProps` ile türet; sabitlenecek alanı `Omit` ile API'den çıkar.
- TypeScript çağrıları derleme anında denetler; runtime'da props'u dönüştürmez veya doğrulamaz.

**Kendini yokla:** Çağıranın JSX ikon vermesi gereken prop için `string` neden yetersizdir?  
*Cevap:* JSX bir string değil React elementidir; render edilebilir içerik için `ReactNode` gerekir.

**Kendini yokla:** `Omit<ComponentProps<'button'>, 'type'>` neyi sağlar?  
*Cevap:* Button'ın doğal props'larını korurken `type` alanını çağıranın API dışından değiştirmesini engeller.
