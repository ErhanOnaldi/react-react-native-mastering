---
title: "Değişen veri ve dependency array"
minutes: 19
kind: concept
---

# Değişen veri ve dependency array

:::pain[Problem]
Kullanıcı film detay sayfasında gezinirken aktör kartına tıklıyor. Kart önce `Christian Bale` (id: 389) bilgilerini gösteriyor. Sayfa açıkken başka bir aktöre (id: 520) geçiliyor; prop değişiyor ama ekranda inatla eski aktörün biyografisi kalıyor. Render yeni prop değerini gördü, ancak effect eski aktörle kurduğu dış ilişkiyi yenilemedi.
:::

## Dependency listesi doğruluk sözleşmesidir

`useEffect`'in ikinci parametresi olan bağımlılık dizisi (dependency array), yalnızca "bu kod kaç kez çalışsın?" ayarı değildir. Effect'in dış dünya ile senkronize olurken bileşenin hangi reaktif değerlerine dayandığını beyan eden bir **doğruluk sözleşmesidir**.

Effect gövdesinde bileşene gelen bir prop (`actorId`), bir state (`query`) ya da bileşen gövdesinde türetilmiş bir değişken okunuyorsa, o değer değiştiğinde dış sistemle kurulmuş olan mevcut senkronizasyon artık geçersiz hale gelmiştir.

![Effect içinde okunan değişkenlerin dependency listesinde sözleşmeye dönüşmesi](diagrams/dependency-sozlesmesi.svg "Dependency listesi effect'in hangi render değerlerine bağlı olduğunu açıklar.")

Modelin kesin kuralları:

1. **Reaktif değer tanımı:** Effect içinde okunan tüm `props`, `state` ve bileşen gövdesinde tanımlı değişkenler reaktif (reactive) değerdir.
2. **Eksiksiz beyan kuralı:** Effect'in sonucunu ya da davranışını değiştiren her reaktif değer, bağımlılık listesinde yer almak zorundadır.
3. **Boş dizi sözleşmesi:** `[]` yazmak effect'in reaktif değer okumadığını söyler. Normal bir mount'ta kurulur; unmount'ta temizlenir. Geliştirme `StrictMode`'unda ilk mount için ek setup ve cleanup denemesi olabilir. Yeniden mount da yeniden kurulumdur.
4. **Referans eşitliği (`Object.is`):** React bağımlılıkları yüzeysel referans kontrolüyle (`Object.is`) karşılaştırır. İçeriği aynı olsa bile her render'da yeniden üretilen nesneler ve fonksiyonlar "farklı değer" sayılır.
5. **Eksik liste bayat değer üretir:** Bağımlılık dizisini bilinçli olarak küçültmek performans sağlamaz; arayüzde bayat (stale) verilerin kalmasına yol açar. Dependency'ler kodun okuduğu değerlere göre belirlenir; dizi bir zamanlama düğmesi değildir.

:::model[State snapshot]
React'te her render kendi `props` ve `state` fotoğrafına sahiptir. Effect callback'i de belirli bir render anında oluşturulur. Bağımlılık dizisine `[]` yazarsan, o mount'taki effect ilk render'da yakaladığı `actorId` değerini kullanmayı sürdürür. Sonraki render'lar yeni bir `actorId` getirse bile bu effect yeniden kurulmaz.
:::

## Closure: Callback hangi render'ı hatırlar?

JavaScript'te bir fonksiyon, tanımlandığı lexical kapsamdaki değişkenleri belleğinde hapseder (closure). React'in render modelinde her render bağımsız bir fonksiyon çağrısıdır.

![Callback'in oluşturulduğu render'ın değerlerini yakalaması](diagram:closure-bayat-deger)

Bunu bir zamanlayıcı üzerinden adım adım izleyelim:

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log(statusText)
  }, 1000)
  return () => clearInterval(timer)
}, []) // TEHLİKE: statusText okunuyor ama bağımlılık boş!
```

Eğer ilk render'da `statusText = "Yükleniyor"` ise, `setInterval` callback'i sonsuza dek `"Yükleniyor"` dizesini hatırlar. Kullanıcı daha sonra veriyi alsa ve `statusText = "Tamamlandı"` olsa bile, interval konsola hâlâ `"Yükleniyor"` yazdırmaya devam eder. Çünkü React'e eski zamanlayıcıyı yok edip yeni `statusText` ile yenisini kurması gerektiğini söyleyen bağımlılık bildirilmemiştir.

## İki render arasındaki geçişi izleyelim

Biyografi kartımızda `actorId` prop'unun 389'dan 520'ye değiştiği senaryoyu karşılaştıralım:

| Aşama | Render Değeri | Bağımlılık Listesi | React'in Karşılaştırması | Sonuç |
| --- | --- | --- | --- | --- |
| 1. Render | `actorId = 389` | `[389]` | İlk çalıştırma (mount) | `/person/389` isteği atılır, Bale gelir |
| 2. Render | `actorId = 520` | `[520]` | `Object.is(389, 520) === false` | **Bağımlılık değişti:** Eski ilişki kapatılır, `/person/520` isteği atılır |
| Hatalı Kod | `actorId = 520` | `[]` | `[]` ile `[]` aynı | **Effect tetiklenmez!** Ekranda Bale biyografisi çakılı kalır |

Eksik bağımlılık kodu "daha hızlı" yapmaz, sadece "yanlış" yapar.

## Kırık örnek

Aşağıdaki bileşende `actorId` değeri effect içinde okunmakta, ancak dependency dizisi boş bırakılmaktadır:

```tsx
import { useEffect, useState } from 'react'

type Actor = { name: string; biography: string }

export function ActorBio({ actorId }: { actorId: number }) {
  const [bio, setBio] = useState('Yükleniyor...')

  useEffect(() => {
    fetch(`/api/people/${actorId}`)
      .then((res) => res.json() as Promise<Actor>)
      .then((data) => setBio(data.biography))
  }, []) // HATA: actorId bağımlılığı eksik!

  return <p>{bio}</p>
}
```

Bileşen ilk açıldığında çalışır. Ancak ebeveyn bileşen yeni bir aktör seçtiğinde bu bileşene yeni bir `actorId` gelir; effect ise hiçbir tepki vermez. Kullanıcı ekranda yanlış biyografiyi okur.

## Doğru örnek

Sözleşmeyi dürüstçe tamamlıyoruz:

```tsx check
import { useEffect, useState } from 'react'

type Actor = { name: string; biography: string }

export function ActorBio({ actorId }: { actorId: number }) {
  const [bio, setBio] = useState('Yükleniyor...')

  useEffect(() => {
    let ignore = false
    setBio('Yükleniyor...')
    fetch(`/api/people/${actorId}`)
      .then((res) => res.json() as Promise<Actor>)
      .then((data) => {
        if (!ignore) setBio(data.biography)
      })
    return () => { ignore = true }
  }, [actorId])

  return <p>{bio}</p>
}
```

Artık `actorId` her değiştiğinde React eski effect'i temizler ve yeni değerle yeni bir istek başlatır. `ignore` bayrağı eski yanıt geç gelse bile yeni kartın metnini ezmesini önler; eski ağ isteği yine tamamlanabilir. İstek maliyeti önemliyse aynı cleanup içinde `AbortController` ile iptal de eklenebilir.

## Nesne ve fonksiyon bağımlılığı tuzağı

Geliştiricilerin en sık düştüğü tuzaklardan biri, bileşen gövdesinde oluşturulan nesne veya fonksiyonları dependency dizisine koymaktır. JavaScript'te iki nesnenin içeriği birebir aynı olsa dahi bellekteki referansları farklıdır:

```ts
// JavaScript referans kuralı:
{ id: 1 } === { id: 1 } // false!
(() => {}) === (() => {}) // false!
```

Şu hatalı koda bakalım:

```tsx
export function FilmRatings({ filmId }: { filmId: number }) {
  // TEHLİKE: options nesnesi HER render'da yeni bir bellek adresiyle üretilir!
  const options = { id: filmId, includeAdult: false }

  useEffect(() => {
    fetch(`/api/ratings?film=${options.id}`)
  }, [options]) // Her render'da options referansı değişir; effect gereksiz tekrarlar.

  return null
}
```

Bu gereksiz tekrarları önlemek için `[options]` yerine iki doğru yaklaşımdan birini seçmelisin. Effect state güncelleyip yeni render başlatıyorsa bu referans değişimi gerçek bir döngüye de dönüşebilir:

1. **Primitif parçalara indirgemek:** Effect'in gerçekten okuduğu ilkel değeri (`filmId`) kullan:
   ```tsx
   useEffect(() => {
     fetch(`/api/ratings?film=${filmId}`)
   }, [filmId])
   ```
2. **Nesneyi effect içine taşımak:** Nesne yalnızca effect içinde kullanılıyorsa, onu doğrudan effect callback'inin içinde tanımla:
   ```tsx
   useEffect(() => {
     const options = { id: filmId, includeAdult: false }
     fetch(`/api/ratings?film=${options.id}`)
   }, [filmId])
   ```

Her iki durumda da dependency listesi sadeleşir ve yalnızca gerçek ilkel reaktif değer olan `filmId`'ye bağlanır.

## Fonksiyon bağımlılıkları nasıl çözülür?

Eğer effect içinde bileşende tanımlı bir fonksiyon çağrılıyorsa, o fonksiyon da her render'da yeni bir referansla üretilir:

```tsx
export function SearchBox({ query }: { query: string }) {
  // Bu fonksiyon her render'da sıfırdan oluşturulur:
  function getUrl() {
    return `/api/search?q=${encodeURIComponent(query)}`
  }

  useEffect(() => {
    fetch(getUrl())
  }, [getUrl]) // getUrl sürekli değiştiği için gereksiz tetiklenir!

  return null
}
```

Bu durumda kodun kullanımına göre şu yollardan birini seç:

- **1. Fonksiyonu effect içine taşımak (En sade yol):** Fonksiyon bileşenin başka hiçbir yerinde kullanılmıyorsa, doğrudan effect callback'inin içine yaz. Böylece `getUrl` reaktif bir dış bağımlılık olmaktan çıkar; tek bağımlılık `query` olur.
- **2. Bileşen dışına taşımak:** Fonksiyon props veya state okumuyorsa, onu bileşen fonksiyonunun dışına al. Dışarıdaki fonksiyonun referansı hiçbir zaman değişmez.
- **3. `useCallback` ile sarmalamak:** Fonksiyon referansı gerçekten paylaşılıyorsa `useCallback` kullanılabilir; callback'in kendi dependency'lerini de eksiksiz yaz. Tek amaç linter'ı susturmaksa bu ek katman gereksizdir.

### Yakalanan değer ve ekranda görünen değer aynı anda değişmez

Bir canlı skor paneli `statusText = 'Bekliyor'` ile mount olsun. Effect içinde interval kurulsun, callback her saniye bu metni yazdırsın. Kullanıcı bir düğmeyle status'u `'Başladı'` yapınca yeni render farklı metni hesaplar. Eski interval callback'i ise ilk render'ın lexical kapsamını taşır; yeni render'ın değişkenine sihirli bir bağlantısı yoktur.

| An | Yeni render'ın `statusText` değeri | Interval'in yakaladığı değer | Ekranda görünen |
| --- | --- | --- | --- |
| Render 1 ve commit | `Bekliyor` | İlk effect henüz kurulacak | “Bekliyor” |
| İlk effect setup | `Bekliyor` | `Bekliyor` | “Bekliyor” |
| Tıklama ve state kuyruğu | Eski handler'da `Bekliyor` | Hâlâ `Bekliyor` | “Bekliyor” |
| Render 2 | `Başladı` | Hâlâ eski callback | Commit'e dek “Bekliyor” |
| Commit 2, dependency `[]` | `Başladı` | `Bekliyor`; cleanup yok | “Başladı”, log yanlış |
| Commit 2, dependency `[statusText]` | `Başladı` | Eski timer temizlenir, yenisi `Başladı` yakalar | “Başladı”, log doğru |

Bu örnekte `[statusText]` yazmak timer'ı her status değişiminde yeniden başlatır. Gereksinim “timer aynı kalsın, yalnız log güncel metni okusun” ise ilişkiyi yeniden kurmak istenmeyebilir. React 19'da `useEffectEvent`, effect içindeki reaktif olmayan bildirim mantığının en yeni değeri okumasına yarar; effect'in senkronize olduğu değerleri gizlemek için kullanılmaz. Hangi değer değişince dış ilişkinin yenilenmesi gerektiğine önce karar ver.

### Yarışan yanıtları dependency tek başına çözmez

Doğru dependency listesi yeni prop için effect'i yeniden başlatır; önceki isteğin ağ yanıtını otomatik iptal etmez. `actorId = 389` isteği yavaş, `actorId = 520` isteği hızlıysa ikinci yanıt önce gelebilir. Sonra ilk yanıt gelip `setBio` çalıştırırsa yeni aktör kartında eski biyografi görünür. Doğru örnekteki `ignore` değişkeni her setup'a özgüdür. Yeni prop commit edilince eski setup'ın cleanup'ı kendi `ignore` değerini `true` yapar.

| Aşama | Aktif prop | Eski isteğin durumu | Ekran |
| --- | ---: | --- | --- |
| İlk commit ve effect | 389 | 389 isteği başladı | “Yükleniyor…” |
| Prop değişimi ve render | 520 | 389 hâlâ bekliyor | Eski commit görünür |
| Yeni commit ve cleanup | 520 | 389 callback'i artık yok sayılır | Yeni kart yükleniyor |
| 520 yanıtı | 520 | 389 bekleyebilir | 520 biyografisi |
| 389 geç yanıtı | 520 | `ignore === true`, state yazılmaz | 520 biyografisi kalır |

`AbortController` ağ işini iptal etmek için eklenebilir; yine de tamamlanmış veya iptal edilemeyen işler için sonuç sahipliğini düşünmek gerekir. Sunucu verisini ileride TanStack Query ile yönettiğinde de sorgu kimliği, cache ve ekranda gösterilen veri arasındaki ilişkiyi ayıracaksın. Formda gecikmeli doğrulama callback'i eski input değerini yakalayabilir; performans bölümünde nesne dependency'sinin gereksiz effect tekrarına yol açtığını ölçebilirsin.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: Linter uyarısını yorum satırıyla susturmak]
Belirti → `// eslint-disable-next-line react-hooks/exhaustive-deps` yazarak uyarı kapatılmış.  
Neden → Geliştirici effect'in birden fazla kez çalışmasını önlemek istemiştir.  
Düzeltme → Linter uyarısını susturma. Kural sana "bu effect bayat değer yakalayacak" demektedir. Çözüm bağımlılığı gizlemek değil, gereksiz bağımlılığı oluşturan nesneyi/fonksiyonu yukarıda açıklandığı gibi sadeleştirmektir.
:::

:::mistake[Sık hata: State setter fonksiyonlarını bağımlılığa yazmak]
Belirti → `[count, setCount]` şeklinde `setCount`'un da listeye yazılması.  
Neden → Kuralı "okunan her şey" diye ezberlemek.  
Düzeltme → React, `useState`'ten dönen `setCount` ve `useReducer`'dan dönen `dispatch` fonksiyonlarının referansının yaşam döngüsü boyunca hiçbir zaman değişmeyeceğini garanti eder. Listeye yazsan da zarar vermez, ancak yazılması zorunlu değildir.
:::

:::mistake[Sık hata: Boş metin veya tanımsız değer sınırını atlamak]
Belirti → Kullanıcı arama kutusundaki tüm metni sildiğinde API'ye `/search?q=` şeklinde anlamsız istek gitmesi.  
Neden → "İlişki yok" durumunun effect içinde kontrol edilmemesi.  
Düzeltme → Effect içinde erken dönüş (early return) uygula:
```tsx check
import { useEffect, useState } from 'react'

export function SearchPreview({ query }: { query: string }) {
  const [results, setResults] = useState<string[]>([])

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      return
    }

    // Yalnızca dolu sorguda istek at
    fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
      .then((res) => res.json() as Promise<{ items: string[] }>)
      .then((data) => setResults(data.items))
  }, [query])

  return <div>{results.length} sonuç bulundu</div>
}
```
:::

:::sector
Ekipte `exhaustive-deps` uyarısını kod incelemesinde ele almak, “bu effect hangi değerle kuruluyor?” sorusunu açık tutar. Uyarı geldiğinde dependency'yi gizlemek yerine okunan değeri doğru listeye koy; gereksiz nesne veya fonksiyon bağımlılığı varsa kodun sınırını değiştir. Sunucu verisi için Query cache kullanıldığında yeniden isteği elle yazmak azalır, fakat callback'lerin hangi render'ı yakaladığı kuralı aynı kalır.
:::

## Özet

- Dependency array, effect'in dış dünya ile senkronizasyon sözleşmesidir.
- Effect içinde okunan tüm reaktif değerler (`props`, `state`, türetilmiş değişkenler) diziye yazılmalıdır.
- React bağımlılıkları `Object.is` ile kontrol eder; nesneler ve fonksiyonlar referansla karşılaştırılır.
- Her render'da yeni oluşan nesneler dependency yapılırsa sonsuz döngü veya gereksiz çalışma doğar.
- Çözüm bağımlılığı silmek değil; nesneyi effect içine almak ya da primitif parçalara (`id`, `query`) indirgemektir.

**Kendini yokla:** Dependency dizisine `[]` yazmak neden her zaman "yalnızca sayfa açılışında çalış" garantisi vermez?  
*Cevap:* Kod ilk açılışta çalışsa bile, effect içinde bir prop okunuyorsa o prop ileride değiştiğinde effect güncellenmez ve kullanıcı bayat veriye kilitlenir.

**Kendini yokla:** `const config = { active: true }` bileşen içinde tanımlanıp dependency'ye verilirse ne olur?  
*Cevap:* `config` her render'da yeni bir bellek adresi alacağından, `Object.is` her render'da `false` döner ve effect her seferinde yeniden tetiklenir.
