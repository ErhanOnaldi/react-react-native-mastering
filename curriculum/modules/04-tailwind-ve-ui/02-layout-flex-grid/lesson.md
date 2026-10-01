---
title: "Kartları ve içerik satırlarını yerleştir"
minutes: 16
kind: concept
---

# Kartları ve içerik satırlarını yerleştir

Bir Sinema sayfasında filmler poster kartları olarak yan yana durabilir. Her kartın içindeki başlıkla puan da aynı satırı paylaşabilir. Bunlar iki farklı düzen problemidir: kartların satır ve sütunlarını **Grid**, tek bir satır veya sütundaki öğeleri hizalamayı **Flexbox** çözer. Tailwind bu CSS düzenlerini class’larla seçmeni sağlar.

## Önce kartları dizelim

Bir bölümde birkaç filmi yan yana yerleştirmenin en küçük hâli `grid` ve sütun sayısını belirleyen class’tır:

```tsx
function FilmShelf() {
  return <section className="grid grid-cols-2">Film kartları</section>
}
```

`grid` kapsayıcıyı CSS Grid düzenine geçirir; `grid-cols-2` iki sütun oluşturur. Henüz responsive davranış yok, dolayısıyla bu düzen pencere daralsa bile iki sütunludur.

Kartların birbirine yapışmaması için aralık ekleyelim:

```tsx
function FilmShelf() {
  return <section className="grid grid-cols-2 gap-4">Film kartları</section>
}
```

`gap-4` sütunlar ve satırlar arasına boşluk koyar. Bu, `grid-cols-2` kararını değiştirmez; başka bir görsel özelliktir. Class’lar bir arada durabilir.

Şimdi geniş ekranda daha fazla sütun açalım:

```tsx
function FilmShelf() {
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      Film kartları
    </section>
  )
}
```

Öneksiz iki sütun dar görünümde temel düzendir. `md:` ve `xl:` daha geniş viewport eşiklerinde aynı sütun sayısı kararını günceller. Bir **breakpoint**, responsive kuralın devreye girdiği genişlik eşiğidir. `md:` “tablet” anlamına gelmez; pencerenin gerçek genişliği eşiğe ulaştığında çalışır.

| Viewport genişliği | Ulaşılan eşikler | Sütun class’ı | Sonuç |
|---|---|---|---|
| 390 px | `md` yok | `grid-cols-2` | 2 sütun |
| 900 px | `md` var, `xl` yok | `md:grid-cols-3` | 3 sütun |
| 1400 px | `md` ve `xl` var | `xl:grid-cols-5` | 5 sütun |

`gap-4` üç genişlikte de kalır. Responsive prefix cihaz türü değil, viewport koşuludur. Önce dar görünümde okunabilir kart genişliği seç, sonra alan arttığında sütun ekle.

## Uzun içerik kartın ölçüsünü zorladığında

Gerçek film başlıkları kısa değildir. Bir kartın içeriğine uzun başlık geldiğinde önce kartın sütuna sığmasına izin ver:

```tsx
type Film = { id: number; title: string }

function FilmShelf({ films }: { films: Film[] }) {
  return (
    <section aria-label="Koleksiyon" className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {films.map((film) => (
        <article key={film.id} className="min-w-0 rounded-xl border p-3">
          <h2>{film.title}</h2>
        </article>
      ))}
    </section>
  )
}
```

`min-w-0`, karta içeriği ne kadar uzun olursa olsun daralabilme izni verir. Varsayılan minimum içerik genişliği, bazı grid öğelerinin uzun yazı yüzünden sütunu büyütmesine yol açabilir. Bu class düzenin yerini tutmaz; yalnızca çocuğun küçülmesine izin verir. `key` film öğesinin React’teki kimliğidir ve CSS yerleşiminden ayrı bir listedir.

Başlık tek satırda kalıp taşan kısmı üç nokta ile göstermeli olsun. Bunu başlık öğesine ekleyelim:

```tsx
function FilmTitle({ title }: { title: string }) {
  return <h2 className="min-w-0 truncate font-medium">{title}</h2>
}
```

`truncate` tek satırdaki görünen metni kısaltır. `min-w-0` daralmaya izin verir, `truncate` taşan metnin nasıl görüneceğini seçer. Bu class’lar metnin içeriğini veya DOM’daki başlığı değiştirmez; görsel olarak ne kadarının göründüğünü belirler.

## Kartın içindeki başlık ve puan satırı

Kartlar dizildikten sonra tek kartın iki öğesine bakalım. Başlık alanı genişliği paylaşabilir, puan ise kendi yerini korusun:

```tsx
function FilmDetails({ title, score }: { title: string; score: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="min-w-0 truncate">{title}</h2>
      <span className="shrink-0 text-sm">{score}</span>
    </div>
  )
}
```

`flex` çocukları tek eksende, burada satır boyunca dizer. `items-center` dikey hizalar, `justify-between` iki ucu ayırır, `gap-2` araya boşluk koyar. Başlık `min-w-0` ile daralabilir ve `truncate` ile kısalır; `shrink-0` puanın daralmamasını söyler. Dıştaki Grid kartlar arasını, içteki Flexbox kart içi satırı düzenler.

![Izgara dış kartları, flex içeriği hizalar](diagrams/dis-duzen-ic-duzen.svg "Grid dış yerleşimi, Flexbox içeriği düzenler")

Pencere daraldıkça hangi class’ın ne yaptığına adım adım bakalım:

| Adım | Ne çalışır? | Başlık | Puan |
|---|---|---|---|
| 1 | `flex` öğeleri satıra koyar | solda başlar | sağa yakın durur |
| 2 | `justify-between` boşluğu dağıtır | sol uca gider | sağ uca gider |
| 3 | kullanılabilir alan azalır | `min-w-0` ile küçülebilir | `shrink-0` nedeniyle boyunu korur |
| 4 | başlık kendi alanını aşar | `truncate` ile üç nokta görünür | satırda kalır |

`min-w-0` olmazsa flex öğesi uzun metnin minimum genişliğine tutunup puanı itebilir. Yalnızca `overflow-hidden` yazmak iki öğenin alanı nasıl paylaşacağını söylemez; daralmayı ve taşma görünümünü ayrı ayrı seçiyoruz.

## Sık görülen iki düzen hatası

:::mistake[Telefonda kartlar çok dar]
Belirti: Küçük pencerede beş sütun görünür. Neden: Büyük ekran sütun sayısı temel `grid-cols-*` kuralı olarak yazılmış. Düzeltme: Dar görünüm için az sütunla başla, breakpoint’lerde artır.
:::

:::mistake[Uzun başlık puanı dışarı itiyor]
Belirti: Satırdaki puan alta düşüyor veya kart taşıyor. Neden: Başlığın daralmasına izin verilmemiş ya da puan küçülebiliyor. Düzeltme: Satırı Flexbox yap, başlığa `min-w-0` ve `truncate`, puana `shrink-0` ver.
:::

Poster görselinin oranı, boş görsel olduğunda yer tutucu kullanımı ve puan satırının kartın altına sabitlenmesi de ayrı tasarım kararlarıdır. `grid` veya `flex` yazmak bunları kendiliğinden çözmez. Gerçek uzun başlık, eksik görsel ve küçük pencereyle deneme yapmak düzenin içerikle çalıştığını görmeni sağlar.

:::info[Derinlemesine (isteğe bağlı)]
CSS’te `order` veya `row-reverse` ile görsel sırayı değiştirsen bile DOM sırası değişmez. Klavye ve ekran okuyucu akışı çoğunlukla DOM sırasını izlediği için görsel ve okuma sırasını ayrı düşürmemeye dikkat et. `grid-cols-[repeat(auto-fit,minmax(...))]` gibi keyfi grid ifadeleri de mümkündür; sabit katalog düzeninde açık breakpoint’ler çoğu zaman daha kolay anlaşılır.
:::

## Özet

- Grid birden çok kartın satır ve sütun ilişkisini kurar; Flexbox tek eksendeki öğeleri hizalar.
- Dar viewport için temel sütun sayısını seç, geniş eşiklerde artır.
- `min-w-0` uzun içeriğin öğeyi daraltmasını sağlar; `truncate` taşanı tek satırda kısaltır.
- Satırda başlık daralabilir, `shrink-0` verilen puan genişliğini korur.
- Düzen class’ları gerçek içeriğin taşma ve görsel boyut kararlarını senin yerine vermez.

**Yeni terimler:**

- **Grid:** CSS’in satır ve sütunlarla iki eksenli düzen sistemi.
- **Flexbox:** CSS’in tek eksendeki öğeleri hizalayıp alanı paylaştırma sistemi.
- **Breakpoint:** Responsive kuralın uygulanmaya başladığı viewport genişliği eşiği.
- **Viewport:** Tarayıcıda sayfanın görünen içerik alanı.

**Kendini yokla:** `lg:grid-cols-4` dar telefonda dört sütun yapar mı? Hayır; yalnız `lg` eşiğine ulaşınca devreye girer.

**Kendini yokla:** Poster kartlarının sırasını mı, kart içindeki başlık ve puanı mı Flexbox ile hizalamak daha doğal? Başlık ve puan gibi tek satırdaki çocukları.
