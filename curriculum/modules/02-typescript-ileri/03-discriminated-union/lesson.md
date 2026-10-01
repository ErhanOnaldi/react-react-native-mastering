---
title: "Birbiriyle çelişen durumları modelleme"
minutes: 15
kind: concept
---

# Birbiriyle çelişen durumları modelleme

Bir film kartında `isLoading`, `movie` ve `error` tuttuğunu düşün. İstek sürerken `isLoading` doğru olur; önceki filmin bilgisi de `movie` içinde kalmış olabilir. Bunlara ayrı ayrı bakabilirsin, ama tip bu üç değerin hangi birleşimlerinin anlamlı olduğunu söylemez.

## Bir durumu tek başına anlat

Önce iki olası sonucu modelleyelim: fragman hazır ya da bulunamadı. Her sonuç kendi nesne şekline sahip. `status`, her şeklin ortak etiketi; bu etikete **discriminant** denir. Etiket, nesnenin hangi durumu anlattığını seçmemize yarar.

```ts check
type TrailerState =
  | { status: 'ready'; url: string }
  | { status: 'missing'; reason: string }

function trailerMessage(state: TrailerState): string {
  if (state.status === 'ready') return `Fragman hazır: ${state.url}`
  return state.reason
}

const state: TrailerState = { status: 'ready', url: '/trailers/arrival.mp4' }
const output = trailerMessage(state)
```

`status` değeri `'ready'` olduğunda TypeScript doğru şekli seçer ve `url` alanına erişmene izin verir. `'missing'` durumunda ise `reason` vardır. Böylece bir nesnenin aynı anda hem hazır fragman hem de bulunamadı hatası taşımasını tipte ifade edemezsin.

Bu olasılıkları bir `if` ile azalttığımızda yapılan işe **narrowing** denir: TypeScript, kontrolün sonucuna göre o satırda mümkün tipleri daraltır. Bunu önceki modüldeki `if` ve union çalışmalarından tanıyorsun; yeni olan, kontrolün her duruma ait alanları da seçmesidir.

## Yeni durum eklenince ne değişir?

Sinema'daki bir oyuncu listesini yüklerken artık “istek başlamadı” ve “yükleniyor” durumlarını da göstermek isteyebiliriz. Önceki iki şekle yalnızca bir durum daha ekleyelim:

```ts check
type CastState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; actors: string[] }

function castMessage(state: CastState): string {
  switch (state.status) {
    case 'idle': return 'Oyuncu listesi henüz istenmedi'
    case 'loading': return 'Oyuncular yükleniyor'
    case 'ready': return `${state.actors.length} oyuncu bulundu`
  }
}

const cast = castMessage({ status: 'ready', actors: ['Amy', 'Ken'] })
```

Her `case`, tek bir etikete ve o etikete ait alanlara karşılık gelir. `ready` dalında `actors` dizisini okuyabiliriz; öteki iki dalda bu alan yoktur. Üç durumun her biri için ayrı mesaj üretmemiz, kullanıcıya doğru bilgiyi göstermemizi sağlar.

Burada `switch` kullanmamızın nedeni yalnızca yazım tercihi değil: durumlar arttıkça hangi durumun hangi davranışı aldığını tek bakışta görebiliriz. Bir durumu eklemeyi unutursak bunu da derleyiciye buldurabiliriz.

## Bütün dalların ele alındığını denetle

Bir union’daki her olasılığın ayrı ayrı işlendiği duruma **exhaustive** denir. Yani elimizdeki tüm durumlar için bir davranış vardır. Aşağıdaki `never` değişkeni, henüz ele alınmayan bir durum kalmışsa TypeScript’in hata vermesini sağlar:

```ts check
type ScreeningState =
  | { status: 'idle' }
  | { status: 'playing'; movieTitle: string }
  | { status: 'ended'; watchedMinutes: number }

function screeningLabel(state: ScreeningState): string {
  switch (state.status) {
    case 'idle': return 'Film seçilmedi'
    case 'playing': return `${state.movieTitle} oynuyor`
    case 'ended': return `${state.watchedMinutes} dakika izlendi`
    default: {
      const impossible: never = state
      return impossible
    }
  }
}
```

`never`, hiçbir değer alamayan tiptir. Üç `case` tamamlandıktan sonra `state` için başka olasılık kalmadığı için `default` bölümünde tipi `never` olur. İleride `paused` durumu eklenip buraya case yazılmazsa `state` artık `never` değildir ve atama hata verir. Bu kontrol yeni durumu ekleyen kişiye, ekran metnini de güncellemesi gerektiğini hatırlatır.

Adımları bu örnekte izleyelim:

| Kodun yeri | `state` için mümkün durumlar | Güvenle okunabilen alan |
| --- | --- | --- |
| `switch` öncesi | `idle`, `playing`, `ended` | `status` |
| `case 'idle'` | yalnız `idle` | `status` |
| `case 'playing'` | yalnız `playing` | `movieTitle` |
| `case 'ended'` | yalnız `ended` | `watchedMinutes` |
| `default` | yeni eklenip ele alınmamış durum varsa o | Hiçbiri; `never` ataması hata verir |

Yeni bir durumu ele almadan `default` içinde boş metin döndürmek kolay görünür; ama yeni ekran davranışı sessizce eksik kalır. `never` kontrolü bunu görünür bir derleme hatasına çevirir.

## Ayrı boolean’lar neden karışıklık çıkarır?

Üç bağımsız alan kullandığımızda tip, çelişkili bir birleşimi kabul eder:

```ts
type LooseTrailerState = {
  isLoading: boolean
  url?: string
  error?: string
}

const confusing: LooseTrailerState = {
  isLoading: true,
  url: '/trailers/arrival.mp4',
  error: 'Fragman bulunamadı',
}
```

Derleyici bu nesnede yükleme, başarı ve hata bilgisinin aynı anda bulunmasına itiraz etmez; çünkü alanları birbirine bağlayan bir kural yazmadık. Ayrı durum nesneleri ise geçerli alanları aynı yerde toplar. Durum geçişinin doğru olup olmadığı yine kodun sorumluluğundadır: tip, `loading` nesnesini üreten fonksiyonun eski fragman URL’sini silip silmediğini belirlemez.

![İstek durumlarının ayrı nesneler ve yalnız hazır ya da eksik alana sahip olması](diagrams/remote-data.svg "Her istek durumu kendi alanlarını taşır")

Boş sonuç ile henüz istek yapılmamış olmayı da ayır. Başarılı arama `movies: []` döndürebilir; bu arama yapıldı ama eşleşme bulunmadı demektir. `idle` ise aramanın henüz başlamadığını söyler. Bunları tek bir “boş” durumda birleştirirsen ekranda arama çağrısı mı yoksa sonuç bulunamadı mesajı mı göstereceğin belirsizleşir.

:::mistake[Belirti: başarı kartı ile hata uyarısı birlikte görünür]
Üç opsiyonel alan ayrı tutulduğu için nesne hem `url` hem `error` taşır. Durumları ayrı union üyeleri yap ve yalnız ilgili durumun alanlarını tanımla.
:::

:::mistake[Belirti: yeni durum eklenince ekran metni eksik kalır]
Genel bir `default` değeri yeni durumu derleyiciye görünmez kılar. Tüm durumları `case` ile ele alıp sonunda `never` ata; yeni dal eklenince eksik davranış derleme hatası verir.
:::

:::info[Derinlemesine (isteğe bağlı): Eski veriyi yenileme sırasında gösterme]
Bazı ekranlar yenileme sürerken önceki başarılı veriyi bilerek göstermeye devam eder. Böyle bir gereksinim varsa `refreshing` gibi ayrı bir durumu, taşıdığı eski veriyle açıkça modelle. `loading` içine gelişigüzel `data?` eklemek, hangi durumda eski verinin gösterileceğini belirsiz bırakır.
:::

## Özet

- Her durumun ayrı nesne şekli olması çelişkili alan birleşimlerini önler.
- Ortak literal etiket olan `status`, hangi durumun alanlarının kullanılacağını seçer.
- `switch` ile durumlar için ayrı davranışlar yaz; `never` eksik dalı derleme hatasına çevirir.
- Durum tipi geçiş kodunun doğru sırada çalıştığını veya dış verinin doğru olduğunu tek başına garanti etmez.

**Yeni terimler:**

- **Discriminant:** Union üyesini seçen ortak literal etiket; çoğunlukla `status` alanı.
- **Narrowing:** Bir kontrol sonucunda mümkün tiplerin azalması.
- **Exhaustive:** Olası durumların hepsi için davranış yazılmış olması.
- **`never`:** Hiçbir değer alamayan tip; eksik union dalını yakalamaya yarar.

**Kendini yokla:** `status: 'ended'` dalında neden `watchedMinutes` okunabilir?  
*Cevap:* Bu etiketi taşıyan union üyesinde alan zorunlu olarak tanımlıdır.

**Kendini yokla:** `paused` eklendiğinde `never` ataması neden hata verir?  
*Cevap:* `paused` için `case` yazılmadığından `default` içindeki değer artık hiçbir zaman oluşamayacak `never` tipinde değildir.
