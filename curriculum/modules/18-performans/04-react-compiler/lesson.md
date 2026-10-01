---
title: "React Compiler ile varsayılan yol"
minutes: 13
kind: concept
---

# React Compiler ile varsayılan yol

Sinema’da film listesi gösterdiğini düşün. Sayfada bir de sayaç var. Sayaç arttığında sayı değişmeli; film başlıklarının hesabını sırf sayaç değişti diye baştan yapmak gerekmeyebilir.

```tsx
function MovieList({ movies }: { movies: string[] }) {
  const [count, setCount] = useState(0)
  const visible = movies.filter((title) => title.length > 0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Sayaç {count}</button>
      <ul>{visible.map((title) => <li key={title}>{title}</li>)}</ul>
    </>
  )
}
```

Tıklayınca `count` değişir ve React bileşeni tekrar çalıştırır. `visible` hesabı da normalde yeniden yapılır. **Memoization**, daha önceki bir hesabın sonucunu saklayıp girdileri aynı kaldığında onu yeniden kullanmaktır; gereksiz işi azaltabilir. **React Compiler**, uygulama kodunu çalıştırılmadan önce inceleyip bazı hesapları ve arayüz parçalarını otomatik memoize edebilen derleyicidir.

## Sayaç değişince film listesi ne olur?

İlk örnekte derleyicinin nereye bakacağını ayırt et: `visible` yalnızca `movies` değerini okuyor. Sayaç state’i değişince liste içeriğinin değişmesi için bir neden yok. Compiler uygun bulursa filtre sonucunu ve değişmeyen alt arayüzü yeniden kullanabilir; ekrandaki sayaç yine güncellenir.

Buradaki “uygun bulursa” önemli. Compiler her bileşeni her durumda hızlandırmayı vaat etmez. Sen normal, doğru React kodunu yazarsın; derleyici güvenle atlayabildiği işi seçer. Gerçek farkı Profiler ile ölçersin.

## Bir girdi değiştiğinde sonuç da değişmeli

Şimdi listeyi arama sorgusuna göre süzelim. Bu örnekte sayaç hâlâ vardır, ama yeni bir girdi olan `query` de vardır:

```tsx
function MovieSearch({ movies }: { movies: string[] }) {
  const [query, setQuery] = useState('')
  const [count, setCount] = useState(0)
  const visible = movies.filter((title) =>
    title.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')),
  )

  return (
    <>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <button onClick={() => setCount(count + 1)}>Sayaç {count}</button>
      <ul>{visible.map((title) => <li key={title}>{title}</li>)}</ul>
    </>
  )
}
```

Sayaç değiştiğinde arama girdisi aynı kaldığı için derleyici filtre sonucunu yeniden kullanabilir. `query` değiştiğinde ise filtre yeni sorguyu kullanmalı ve sonuç listesini güncellemelidir. Memoization eski sonucu sonsuza kadar tutmak değildir: hangi girdiler değiştiyse onlara bağlı sonuç da değişir.

Bu kodun render sırasında yaptığı filtreleme **saf** bir hesaptır: verilen filmleri değiştirmez ve dışarıda bir değişiklik yapmaz. Render sırasında `movies.sort()` ile prop dizisini değiştirmek aynı şey değildir; listeyi beklenmedik biçimde bozabilir, ayrıca Compiler’ın güvenle incelemesini zorlaştırır. Sıralaman gerekiyorsa kopya üzerinde çalışırsın: `const sorted = [...movies].sort(...)`.

İki değişikliği sırayla izleyelim. Başlangıç listesi `Matrix` ve `Mad Max` olsun:

| Olay | `count` | `query` | Görünen sonuç | Compiler’ın atlayabileceği iş |
|---|---:|---|---|---|
| Sayfa açıldı | 0 | `"m"` | Matrix, Mad Max | — |
| Sayaç tıklandı | 1 | `"m"` | Matrix, Mad Max | Değişmeyen filtre hesabı ve ilgili alt arayüz |
| Arama `"ma"` oldu | 1 | `"ma"` | Mad Max | Sayaçtan bağımsız iş; filtre yeni sorguyla çalışmalı |

İkinci satırda ekrandaki sayı değişir ama listedeki filmler değişmez. Üçüncü satırda girdi değiştiği için doğru sonuç da değişir. React’in ne zaman hangi parçayı tekrar çalıştırabileceği uygulamanın yapısına bağlıdır; tablonun sabit kalan kısmı davranış sözleşmesidir, performans ayrıntısı Compiler’ın ne kadar işi atlayabildiğidir.

## Erken dönüş olsa da Hook kuralı değişmez

Bir film verisi henüz gelmediyse bileşen erken `return` edebilir. **Erken dönüş**, fonksiyonun bazı koşullarda daha aşağıdaki satırlara ulaşmadan sonuç vermesidir. Compiler kodu bu durumda da analiz edebilir; ama bu, Hook kurallarını kaldırdığı anlamına gelmez.

```tsx
function MovieDetails({ movie }: { movie: { title: string } | null }) {
  if (!movie) return null

  const heading = `Film: ${movie.title}`
  return <h2>{heading}</h2>
}
```

Film yokken `null` döner; film geldiğinde başlık hesaplanır ve gösterilir. Compiler hesaplamayı optimize edebilir, fakat ekranda hangi içeriğin görüneceğine dair davranışı değiştirmemelidir. `useMemo` gibi Hook’ları koşulun altına taşımak hâlâ doğru olmaz: React Hook’ları her render’da aynı sırayla çağrılmalıdır.

## Elle memo yazmak mı, normal kod mu?

Önceki derste `memo`, `useMemo` ve `useCallback` ile bazı işleri elle korumayı gördün. Örneğin `memo` bir alt bileşenin props’u değişmediğinde tekrar render edilmesini önlemeye çalışır; `useMemo` hesap sonucunu, `useCallback` fonksiyon değerini saklar. Bunlar hâlâ geçerli araçlar. Compiler etkin projede ise yeni kodu önce normal, saf bileşen olarak yazmak çoğu zaman daha anlaşılır bir başlangıçtır.

```tsx
const visibleMovies = movies.filter((movie) => movie.genre === selectedGenre)
return <MovieRows movies={visibleMovies} onSelect={onSelect} />
```

Bu örnekte önce `useMemo` veya `useCallback` eklemiyoruz. Compiler uygun görürse, `selectedGenre` ve `movies` değişmediği render’larda filtre sonucunu koruyabilir; alt bileşene giden değerleri de gerektiğinde kararlı tutabilir. Elle optimizasyon eklemen gerekiyorsa nedeni ölçümle gör: örneğin pahalı bir işin tekrarlandığını Profiler’da doğrula.

## Bir takılmayı nasıl incelersin?

React Developer Tools içindeki **Profiler**, render ve ekrana uygulama işlemlerinin nerede zaman harcadığını gösteren araçtır. Bir sayaç tıklamasından önce ve sonra kayıt al: hangi bileşenlerin çalıştığını, hangilerinin tekrar çalışmasının pahalı olduğunu karşılaştır. Compiler açıkken de bu ölçümü tekrarla. Gözle görülür fark yoksa bu tek başına hata değildir; örnekte atlanacak iş çok küçük olabilir.

:::mistake[Her useMemo satırını silmek]
- **Belirti:** Compiler’ı açtıktan sonra her elle yazılmış memo kodunu silip bazı referanslara bağlı kodun davranışını bozarsın.
- **Neden:** Compiler yeni optimizasyonları kendisi yapabilir, ancak mevcut kodun her referans sözleşmesini otomatik olarak gereksiz kılmaz.
- **Düzeltme:** Çalışan optimizasyonları topluca silme. Önce ölç; yeni kodda normal ve saf yazımı varsayılan tut, özel bir ihtiyaç görünürse elle memoization kullan.
:::

:::mistake[Derleyicinin girdiyi yok sayacağını sanmak]
- **Belirti:** Arama sorgusu değiştiği hâlde aynı film sonuçları ekranda kalır.
- **Neden:** Memoization’ı “sonucu bir kere hesapla ve hep sakla” diye yorumlamışsındır.
- **Düzeltme:** Sonucu etkileyen her girdiyi hesaba kat. `query` değişince filtre yeni sorguyla tekrar çalışmalı; yalnız sayaç gibi ilgisiz değişiklikte eski sonuç kullanılabilir.
:::

:::info[Derinlemesine (isteğe bağlı)]
React Compiler JSX ve JavaScript’i yapısal olarak inceleyip kod için dönüşümler üretir. Yapılandırma yöntemi projedeki derleme araçlarının sürümüne göre değişebilir; bu nedenle projene Compiler eklerken kullandığın React ve build aracı sürümlerinin resmi kurulum yönergelerini izle. Bu ayrıntılar günlük bileşen davranışını anlamak için gerekli değildir.
:::

## Özet

- React Compiler, güvenle atlanabilecek bazı hesapları ve arayüz parçalarını otomatik memoize edebilir.
- Sonucu etkileyen bir girdi değiştiğinde sonuç da güncellenir; ilgisiz bir state değişikliği aynı işi yeniden yapmayı gerektirmeyebilir.
- Render içinde girdileri değiştirmeyen saf kod yaz; Compiler’ın optimizasyon yapması doğru davranışın yerini tutmaz.
- Yeni manuel memoization eklemeden önce Profiler ile tekrar eden pahalı işi ara.

**Yeni terimler**

- **Memoization:** Girdiler değişmediyse önceki hesap sonucunu yeniden kullanma.
- **React Compiler:** React kodunu önceden inceleyip bazı optimizasyonları otomatik uygulayan derleyici.
- **Saf hesap:** Aynı girdilerle aynı sonucu veren ve dışarıda değişiklik yapmayan hesap.
- **Erken dönüş:** Koşula göre fonksiyonun daha aşağıdaki satırlara gelmeden sonuç vermesi.
- **Profiler:** Bileşen render’larının nerede zaman harcadığını inceleme aracı.

**Kendini yokla**

1. Sayaç artınca arama filtresi girdileri değişmediyse eski filtre sonucu neden kullanılabilir? **Cevap:** Çünkü sayaç, filtre hesabının girdisi değildir.
2. Arama sorgusu değiştiğinde Compiler neden yeni liste sonucunu göstermelidir? **Cevap:** Çünkü sorgu filtre hesabının sonucunu etkiler.
