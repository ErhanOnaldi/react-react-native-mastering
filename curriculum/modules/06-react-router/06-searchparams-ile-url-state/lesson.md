---
title: "Arama ve filtre URL’de"
minutes: 15
kind: concept
---

# Arama ve filtre URL’de

Sinema'da arama sayfasını yenileyince sorgu ve tür seçimi kaybolmasın, kullanıcı aynı görünümü bir arkadaşına da gönderebilsin istiyorsun. Bu seçimleri yalnız `useState` içinde tutarsan adres bunları bilmez. Aramanın ve filtrelerin URL'de bulunması, bu görünümü doğrudan açılabilir hale getirir.

## Adresin sonundaki seçimler

`/search?q=Matrix&page=2` adresinin `?` işaretinden sonraki kısmına query string denir. Bu metin, hangi sayfanın açık olduğunu değiştirmeden o sayfanın arama ve görünüm seçimlerini taşır. Path `/search` sayfayı seçer; `q` ile `page` ise bu sayfanın hangi halde görüneceğini söyler.

İlk adımda `URLSearchParams` ile tek bir değeri okuyalım:

```ts check
const params = new URLSearchParams('?q=Matrix&page=2')
const query = params.get('q') ?? ''
const rawPage = params.get('page')

console.log(query)   // Matrix
console.log(rawPage) // 2
```

`get` her zaman metin ya da `null` döndürür. Buradaki `2` sayı değil string'dir; olmayan `q` için `null` gelir. Bu yüzden input'a metni verebiliriz ama sayısal hesapta kullanmadan önce ayrıca kontrol etmeliyiz.

## Sayı gibi görünen değerleri güvenle kullan

Şimdi URL'den gelen `page` değerini sayfada göstermek üzere sayıya dönüştürelim. Sayfa numarası pozitif tam sayı olmalı; beklenmeyen bir değer için ilk sayfayı kullanacağız:

```ts check
function readPage(params: URLSearchParams): number {
  const rawPage = params.get('page')
  if (rawPage === null || rawPage.trim() === '') return 1
  const page = Number(rawPage)
  return Number.isSafeInteger(page) && page > 0 ? page : 1
}

const params = new URLSearchParams('?page=3')
console.log(readPage(params)) // 3
console.log(readPage(new URLSearchParams('?page=abc'))) // 1
```

`?page=3` için 3 kullanılır; `?page=abc`, boş değer veya sıfır için 1'e düşeriz. Böylece hatalı URL sayfa bileşenini bozmaz ve ekranda `NaN` görünmez.

Bu kontrolü render sırasında yapabilirsin. Ekranda 1 göstermek için URL'yi de değiştirmek zorunda değilsin; adresi otomatik düzeltmek ayrı bir gezinme kararıdır. Önce geçersiz girdide ne gösterileceğini belirle.

## Bir seçimi değiştir, kalanları koru

Kullanıcı sıralamayı değiştirirken arama metnini kaybetmemeli. `setSearchParams` ile URL'yi güncelleyebilirsin. Üçüncü örnekte `order` değerini değiştirirken mevcut parametrelerin kopyasını alıyoruz:

```tsx check
import { useSearchParams } from 'react-router'

export function MovieOrder() {
  const [params, setParams] = useSearchParams()
  const order = params.get('order') ?? 'newest'

  function chooseOldest() {
    setParams((current) => {
      const next = new URLSearchParams(current)
      next.set('order', 'oldest')
      return next
    })
  }

  return (
    <section>
      <p>Sıralama: {order}</p>
      <button onClick={chooseOldest}>En eskiler</button>
    </section>
  )
}
```

Eğer mevcut URL `?q=Matrix&genre=28&order=newest` ise düğmeye basınca yeni URL `?q=Matrix&genre=28&order=oldest` olur. Arama ve tür filtreleri korunur, yalnız sıralama değişir. `new URLSearchParams(current)` önceki değerlerin kopyasını çıkarır; `set` ise yalnızca seçilen anahtarı değiştirir.

Şimdi Sinema'da arama metni değiştiğinde sayfa numarasını sıfırlama kuralını düşün. Kullanıcı yeni bir sorgu yazdıysa eski sorgunun sayfa 4 konumu yeni sonuçlar için doğru olmayabilir. Tür filtresi geçerliliğini korurken sayfa numarasını kaldırmak gerekir:

```ts
function updateTitle(current: URLSearchParams, title: string) {
  const next = new URLSearchParams(current)
  const trimmed = title.trim()
  if (trimmed) next.set('title', trimmed)
  else next.delete('title')
  next.delete('page')
  return next
}
```

Başlık değişince ya da temizlenince bu fonksiyon mevcut URL'yi kopyalar; yalnız `title` günceller ve `page` değerini siler. Böylece ilgisiz `kind` filtresi kalır, sayfa numarası ise eksik sayıldığı için ekranda 1 olur.

| İşlem | URL | Ekrandaki seçim |
| --- | --- | --- |
| İlk açılış | `?title=Rüzgar&page=4&kind=history` | Rüzgar, history, sayfa 4 |
| Yeni başlık yazılır | `?title=Kıyı&kind=history` | Kıyı, history, sayfa 1 |
| Sonuçlarda 2. sayfaya geçilir | `?title=Kıyı&kind=history&page=2` | Kıyı, history, sayfa 2 |
| Geri tuşu | `?title=Rüzgar&page=4&kind=history` | Önceki seçimler geri gelir |

Bu sıra önemlidir: her URL değişikliğinden sonra component yeni parametreleri okur ve görünümü onlardan üretir. Geri tuşu eski URL'yi etkinleştirince eski sorgu ve sayfa birlikte geri gelir. Sorguyu bir kez de local state'te tutarsan iki kaynak oluşur; adres geriye dönerken input eski kopyayı göstermeye devam edebilir.

`URLSearchParams` üzerinde `set` ve `delete` nesneyi değiştirir. Setter callback'inde önceki nesneyi doğrudan değiştirmek yerine kopyalamak, yeni değeri ayrı bir nesnede kurar ve mevcut URL'yi bozmadan hangi anahtarı değiştirdiğini açık eder.

:::mistake[Belirti → neden → düzeltme]
Sorguyu değiştirince seçili tür kayboluyor → yeni query string yalnızca sorgu anahtarından kurulmuş → mevcut `URLSearchParams` kopyasını al ve yalnız ilgili alanları güncelle.
:::

:::mistake[Belirti → neden → düzeltme]
`page=abc` ile ekranda `NaN` çıkıyor → URL'den gelen string kontrol edilmeden sayısal hesapta kullanılmış → sayıya çevir, pozitif güvenli tam sayı değilse 1 kullan.
:::

:::mistake[Belirti → neden → düzeltme]
Geri tuşunda adres eski sorguya dönüyor ama input aynı kalıyor → sorgu URL'den okunup ayrıca `useState` içine kopyalanmış → input'un `value` değerini her render'da URL parametresinden üret.
:::

URL'deki değer input'un kaynağı olsa bile input controlled olabilir. Controlled input, görünen `value` değerinin React tarafından verilmesi ve değişimin `onChange` üzerinden ele alınması demektir. Burada `value` URL'den okunur, değişiklik de yeni URL üretir; local state şart değildir.

:::info[Derinlemesine (isteğe bağlı)]
URL'de `Dövüş` gibi harfler ve boşluklar aktarılırken percent encoding denilen gösterim kullanılır: özel karakterler URL'de güvenle taşınacak metin karşılıklarına çevrilir. `URLSearchParams` bu kodlama ve geri açma işini yapar; query string'i `split('&')` ile elle parçalamak tekrar eden anahtarları ve bu karakterleri yanlış ele alabilir. Aynı anahtar iki kez geldiyse `get` ilk değeri verir; daha katı kural gerekiyorsa uygulama bu durumu ayrıca ele almalıdır.

Filtre kutusuna her karakter yazıldığında URL'yi güncellemek çok sayıda tarayıcı geçmişi kaydı oluşturabilir. Debounce, yazma durduktan kısa bir süre sonra güncelleme yaparak bu sıklığı azaltır; ya da form gönderilince URL'yi güncellersin. Hangi seçeneği kullanırsan kullan, ekrandaki sonuçlarla adresin temsil ettiği aramanın aynı kalmasını sağla. URL tarayıcı geçmişinde ve paylaşılan linklerde görünebildiği için parola veya kişisel bilgi koyma.
:::

:::model[URL state]
URL, paylaşılması veya geri tuşuyla geri gelmesi gereken filtrelerin kaynağıdır. Önceki derste path parametresiyle tek filmi seçtin; burada query string aynı arama sayfasının görünümünü seçiyor. Yeni olan, bir filtre değiştiğinde bağlı sayfa değerini sıfırlarken diğer filtreleri korumaktır.
:::

![URL'nin query değerlerinden kontrolleri ve görünür film listesini kurması](diagram:url-state)

## Özet

- Query string aynı sayfanın arama ve görünüm seçimlerini URL'de taşır.
- `URLSearchParams.get` metin ya da `null` verir; sayıyı kullanmadan önce doğrula.
- Bir anahtarı güncellerken mevcut parametreleri kopyala, geçerliliğini yitiren anahtarı kaldır.
- Ekranı URL'den türetmek geri, ileri, yenileme ve link paylaşımında aynı seçimi korur.

**Yeni terimler:**

- **Query string:** URL'nin `?` sonrasındaki, sayfanın filtre ve görünüm değerlerini taşıyan bölümü.
- **Controlled input:** Değeri component'ten gelen ve değişikliği React üzerinden işlenen input.
- **Debounce:** Art arda gelen değişiklikleri kısa süre bekletip tek güncellemeye indirme yöntemi.

**Kendini yokla:** `?page=4&kind=history` içinde arama değişince neden `kind` kalıp `page` silinir?

*Cevap:* Tür filtresi yeni aramada hâlâ geçerlidir; eski sorgunun dördüncü sayfası yeni sonuçlara ait olmayabilir.

**Kendini yokla:** URL değişince input neden ikinci bir `useState` kopyasına ihtiyaç duymaz?

*Cevap:* Input değerini güncel URL'den okuyabiliriz; böylece geri navigasyonda URL ile local state ayrışmaz.
