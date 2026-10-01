---
title: "Değişen veri ve dependency array"
minutes: 18
kind: concept
---

# Değişen veri ve dependency array

Bir film kartı ilk açıldığında `movieId` değerinin `550` olduğunu düşün. Önceki derste, ağ isteğini `useEffect` içine alarak render sırasında tekrar tekrar başlamasını önledin. Şimdi aynı kart başka filme geçtiğinde effect'in hangi bilgiyi takip etmesi gerektiğine bakalım.

## Prop değişti, istek neden yenilenmedi?

Bir effect'in ikinci argümanındaki **dependency array** (bağımlılık dizisi), effect'in hangi render değerlerine bağlı olduğunu React'e bildirir. `id` gibi bileşene her render'da gelen değer değiştiğinde, dış sistemle kurduğun ilişkinin de yenilenmesi gerekiyorsa onu bu diziye koyarsın.

```tsx
useEffect(() => {
  fetch(`/api/movies/${movieId}`)
}, [])
```

Bu kod ilk bağlanmada isteği başlatır. Ama aynı bileşen `movieId={550}` değerinden `movieId={27205}` değerine geçtiğinde effect çalışmaz; React'e boş diziyle “bu effect'in sonucu render değerlerine bağlı değil” demiş olduk. Ekranda eski filmin bilgisi kalabilir.

```tsx
useEffect(() => {
  fetch(`/api/movies/${movieId}`)
}, [movieId])
```

Şimdi liste, isteğin kullandığı `movieId` ile eşleşiyor. İlk değerde effect kurulur; `movieId` değişince React eski effect'i temizler ve yeni değerle effect'i tekrar kurar. Dependency listesi “kaç kez çalışsın?” düğmesi değil, effect'in doğru kalması için verdiğin listedir.

![Effect içinde okunan değişkenlerin dependency listesinde sözleşmeye dönüşmesi](diagrams/dependency-sozlesmesi.svg "Dependency listesi effect'in hangi render değerlerine bağlı olduğunu açıklar.")

## Her render kendi değerlerini taşır

Bir render'da `movieId` 550, sonraki render'da 27205 olabilir. Bu render'ları React'in bileşeni ayrı değerlerle çağırdığı iki ayrı an gibi düşün. JavaScript'te bir fonksiyonun tanımlandığı yerdeki değişkenleri kullanmaya devam etmesine **closure** denir; bu, callback'in hangi render değerini gördüğünü anlamana yardım eder.

Örneğin, Sinema'da güncel seçimi konsola yazan bir timer kuralım:

```tsx
useEffect(() => {
  const timerId = setInterval(() => {
    console.log(selectedGenre)
  }, 1000)

  return () => clearInterval(timerId)
}, [])
```

Burada callback, kurulduğu render'daki `selectedGenre` değerini kullanır. İlk render'da tür `Dram` ise, kullanıcı türü `Bilim Kurgu` yaptığında timer hâlâ `Dram` yazabilir; boş liste effect'i yeni değerle kurmadı. `selectedGenre`'ı listeye eklemek, tür değişince eski timer'ı temizler ve yeni değerle yenisini kurar.

| Olay | Render'ın `selectedGenre` değeri | Effect / timer | Konsol |
| --- | --- | --- | --- |
| İlk render | `Dram` | Timer kurulur, callback bu değeri kullanır. | — |
| 1 saniye sonra | `Dram` | İlk timer çalışır. | `Dram` |
| Kullanıcı türü değiştirir | `Bilim Kurgu` | Dependency boşsa timer aynı kalır. | — |
| Sonraki tik | `Bilim Kurgu` | Eski callback hâlâ ilk render'ı hatırlar. | `Dram` |
| `[selectedGenre]` ile | `Bilim Kurgu` | Eski timer temizlenir, yeni timer kurulur. | `Bilim Kurgu` |

![Callback'in oluşturulduğu render'ın değerlerini yakalaması](diagram:closure-bayat-deger)

Closure hatası sadece timer'da olmaz. Effect'teki bir istek `query` değerini okuyorsa, sorgu değiştiğinde yeni istek açılması için `query` listede olmalıdır. React'in render sırasında ürettiği her `props`, `state` ve bileşen içi değişken için kullanılan **reactive value** (reaktif değer) adı, render değişince değeri de değişebilecek girdileri anlatır. Effect bunlardan hangisini okuyorsa onu dependency olarak belirt.

## Metni izlemek kolay, nesneyi izlemek farklı

String ve number gibi basit değerlerde değişikliği takip etmek kolaydır. Peki her render'da yeni oluşturulan bir nesne dependency olursa ne olur?

```tsx
function MovieScore({ movieId }: { movieId: number }) {
  const options = { movieId, language: 'tr' }

  useEffect(() => {
    console.log(options.movieId, options.language)
  }, [options])

  return null
}
```

`options` nesnesinin alanları aynı kalsa bile bileşen her render'da yeni nesne kurar. React dependency'leri **`Object.is`** adlı JavaScript karşılaştırmasıyla kontrol eder; iki ayrı nesneyi içeriklerine bakıp eşit saymaz. Başka bir state güncellemesi bile effect'i gereksiz yere çalıştırabilir.

Bu effect'in ihtiyacı gerçekten `movieId` ve sabit dil değeridir. Nesneyi effect'in içine taşıyınca dependency listesinde değişen `movieId` yeterli olur:

```tsx
function MovieScore({ movieId }: { movieId: number }) {
  useEffect(() => {
    const options = { movieId, language: 'tr' }
    console.log(options.movieId, options.language)
  }, [movieId])

  return null
}
```

Burada yeni nesne her effect çalıştığında kurulsa da onu başka bir render girdisi olarak izlemiyoruz; effect'in gerçekten değişen girdisi `movieId`. Böylece her render için yeni nesne oluşturmak tek başına effect'i tekrar çalıştırmaz.

:::mistake[Her render'da yeni nesne dependency yapmak]
Belirti → Ekrandaki alakasız bir state değişince istek veya effect tekrar çalışıyor.
Neden → Bileşen gövdesinde kurulan `{ movieId }` her render'da yeni bir nesne; `Object.is` eski nesneyle yenisini farklı görüyor.
Düzeltme → Effect yalnızca `movieId` kullanıyorsa nesneyi effect içinde kur ve dependency olarak `[movieId]` yaz. Dependency'yi silmek doğru çözüm değildir.
:::

## Okuduğun değeri gizleme

Dependency listesini elle küçültmek kısa vadede “effect bir daha çalışmasın” gibi görünebilir. Fakat effect'in kullandığı prop veya state değiştiğinde eski render'da oluşturulmuş callback çalışmayı sürdürür. Bu yüzden önce effect'in hangi değerleri okuduğuna bak; sonra gereksiz nesne veya fonksiyonları effect'in içine alarak listenin gerçekten değişen girdilerden oluşmasını sağla.

:::info[Derinlemesine (isteğe bağlı)]
React 19.2 ve sonrasında `useEffectEvent`, effect içindeki bazı callback'lerin en güncel props ve state değerlerini okumasını sağlar. Onu, effect'in gerçekten hangi değişime tepki vermesi gerektiğini dependency listesinden saklamak için kullanma.
:::

## Özet

- Dependency array, effect'in okuduğu render değerlerini ve hangi değişimde yeniden kurulacağını bildirir.
- `[]` effect'in render'dan gelen değişen değerleri takip etmediği anlamına gelir; içine prop veya state okuyup listeyi boş bırakmak eski değer bırakabilir.
- Closure, callback'in tanımlandığı render'daki değerleri neden kullanabildiğini açıklar.
- React bağımlılıkları `Object.is` ile karşılaştırır; her render'da kurulan nesne yeni nesnedir.
- Nesne sadece effect'te gerekiyorsa onu effect içine kur; dependency listesine gerçek girdiyi yaz.

**Yeni terimler**

- **Dependency array:** Effect'in kullandığı ve değişince effect'in yeniden kurulmasını sağlayan değerler listesi.
- **Closure:** Fonksiyonun tanımlandığı yerdeki değişkenleri kullanmaya devam etmesi.
- **Reactive value:** Render'da değişebilecek ve effect'in sonucunu etkileyen prop, state veya yerel değer.
- **`Object.is`:** React'in dependency değerlerinin aynı kalıp kalmadığını kontrol etmekte kullandığı karşılaştırma.

**Kendini yokla:** Effect `movieId` okuyor ama dependency listesi `[]` ise aynı bileşen başka filme geçtiğinde ne olur?
*Cevap:* Effect yeni `movieId` ile kurulmaz; eski isteğin sonucu ekranda kalabilir.

**Kendini yokla:** `{ movieId }` her render'da yeniden kuruluyorsa, neden `[options]` effect'i sık çalıştırabilir?
*Cevap:* Her render yeni bir nesne üretir; `Object.is` ayrı nesneleri aynı kabul etmez.
