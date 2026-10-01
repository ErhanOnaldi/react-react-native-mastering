---
title: "State ve tipleri hatırla"
minutes: 8
kind: review
---

# State ve tipleri hatırla

Bir arama ekranında henüz arama başlamamış, istek sürüyor, boş sonuç geldi ya da istek başarısız oldu olabilir. Hepsinde film listesi boş görünse bile kullanıcıya aynı şeyi söylemek doğru olmaz. Bu derste, daha önce gördüğün `RemoteData<T>` modelini kısa bir Sinema örneğinde hatırlayıp sonra görevlerde kullanacaksın.

## Boş liste her zaman aynı anlama gelmez

`RemoteData<T>` bir isteğin durumunu ve yalnızca o duruma ait bilgiyi birlikte taşır. Burada `T`, başarılı cevapta gelecek verinin tipidir; `string[]` seçersek başarılı arama bir film başlığı listesi taşır.

```ts check
type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function successfulCount(result: RemoteData<string[]>): number | null {
  if (result.status !== 'success') return null
  return result.data.length
}
const beforeSearch: RemoteData<string[]> = { status: 'idle' }
successfulCount(beforeSearch) // null
const whileSearching: RemoteData<string[]> = { status: 'loading' }
successfulCount(whileSearching) // null
const noMatches: RemoteData<string[]> = { status: 'success', data: [] }
const twoMatches: RemoteData<string[]> = { status: 'success', data: ['Başlangıç', 'Matrix'] }

successfulCount(noMatches) // 0
successfulCount(twoMatches) // 2
```

Önce `status` değerine bakıyoruz. Böylece `data` alanını yalnızca başarılı cevapta okuyoruz. `null`, henüz sonuç sayamayacağımız durumları; `0` ise başarılı aramada sıfır film bulunmasını anlatır.

## Durumları örneklerle ayıralım

İstek hiç başlamadığında `beforeSearch` içindeki `idle` durumu için `successfulCount` değeri `null` olur. İstek sürerken de henüz güvenilir bir sayı yoktur; `whileSearching` aynı `null` sonucunu verir.

İstek başarıyla tamamlandığında `data` alanı kullanılabilir. `noMatches` için sonuç `0`, iki başlıklı `twoMatches` için `2` olur. İki sonuç da `success`; liste uzunluğunu güvenle okuyabiliriz. Böylece “cevap geldi ama eşleşme yok” ile “cevap henüz gelmedi” birbirine karışmaz. Senin görevinde bu ayrımı başka bir ekranda metne çevireceksin.

## Birlikte iz sürelim

Şu adımlar aynı aramanın durum metnini gösteriyor. Her satırda önce `status` dalı seçilir, sonra yalnız o dala ait alan kullanılır.

| Adım | Gelen değer | Seçilen bilgi | Sayılan sonuç |
| --- | --- | --- | --- |
| 1 | `{ status: 'idle' }` | `idle` | `null` |
| 2 | `{ status: 'loading' }` | `loading` | `null` |
| 3 | `{ status: 'success', data: [] }` | `success`, uzunluk `0` | `0` |
| 4 | `{ status: 'success', data: ['A', 'B'] }` | `success`, uzunluk `2` | `2` |
| 5 | `{ status: 'error', error: 'Bağlantı yok' }` | `error` | `null` |

İstek durumu ile sonuç listesini aynı `[]` değeriyle anlatmaya çalışırsan 1, 2 ve 3. adımı ayıramazsın. Ayrı `status` alanı hem doğru kullanıcı mesajını seçtirir hem de TypeScript'in her dalda hangi bilginin var olduğunu anlamasına yardım eder.

:::model[State snapshot]
Her render, props ve state değerlerinin kendi fotoğrafını görür. Event handler ya da Promise callback'i oluşturulduğu render'ın değerleriyle çalışır; biraz sonra eski bir değer görürsen önce bu fotoğrafın ne zaman alındığını düşün.
:::

## Sık karşılaşılan iki belirti

:::mistake[Boş listeyi yükleniyor sanmak]
Belirti → İstek sürerken ekranda `Sonuç yok` yazar. Neden → Boş dizi hem “henüz cevap yok” hem “cevap boş” diye kullanılmıştır. Düzeltme → İstek sürerken `loading`, boş başarı için `success` ve `data: []` kullan.
:::

:::mistake[Her durumda `data` okumak]
Belirti → TypeScript, `data` alanının bulunmadığını söyler. Neden → `data` yalnızca `success` dalında vardır. Düzeltme → Önce `status` ile dallan; başarılı dalda `data` alanını oku.
:::

## Özet

- İsteğin aşaması ve sonuç listesi ayrı bilgilerdir.
- `idle`, `loading`, `success` ve `error` farklı kullanıcı mesajları üretir.
- Boş dizi, yalnızca başarılı cevapta “sıfır sonuç” anlamına gelir.
- Callback'in hangi render'da oluştuğunu düşünmek eski değerleri anlamana yardım eder.

**Yeni terimler**

- `RemoteData<T>`: İstek durumunu ve o duruma ait veriyi birlikte taşıyan tip.
- `State snapshot`: Bir render'ın gördüğü props ve state değerlerinin fotoğrafı.

**Kendini yokla:** `successfulCount` neden boş başarı için `0`, ama `loading` için `null` döndürür?

**Cevap:** Boş başarıda cevap vardır ve sayısı sıfırdır; `loading` durumunda henüz güvenilir bir sonuç sayısı yoktur.
