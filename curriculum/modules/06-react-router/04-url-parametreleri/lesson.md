---
title: "Film kimliği URL’de"
minutes: 13
kind: concept
---

# Film kimliği URL’de

:::pain[Problem]
Karttan Dövüş Kulübü detayına geçiyorsun ama `selectedMovie` yalnızca React state'inde. `/movie/550` adresini doğrudan açan kişi filmi göremiyor; yenileme de seçimi siliyor.
:::

## Bir adres şablonu, birçok kaynak

Film detay ekranının yapısı filmden filme değişmiyorsa her film için ayrı bileşen veya route yazmak gerekmez. `/movie/:id` tek bir şablondur: sabit `/movie/` bölümü hangi sayfa türünü açacağını söyler, `:id` ise hangi kaynağın istendiğini seçer. `/movie/550` ve `/movie/603` aynı route'a eşleşir ama farklı film kimlikleri taşır.

Önceki derslerde route ağacını kurup nested layout içine yerleştirdin. Şimdi o route'un değişken bölümünü bileşene taşıyacağız. Parametreyi okumak, verinin hazır olduğu anlamına gelmez: değer URL'den geldiği için önce biçimini kontrol etmeli, sonra veri kaynağında aramalısın.

![Path parametresinin metin olarak okunup kontrol edilerek film kaydına eşleşmesi](diagrams/parametre-akisi.svg)

1. **Route deseni hangi parçanın değişken olduğunu belirler.** `path: '/movie/:id'` içindeki `:id`, ilgili segmentin parametre olarak okunacağını söyler. `/movie/550` eşleşince route bileşenine `id` değeri gelir.
2. **Parametre metindir.** URL bir metin protokolüdür. `550` görünmesi Router'ın `number` ürettiği anlamına gelmez; `useParams()` değeri string veya tanımlanmamış olabilir.
3. **Eksik değer için kod yolun olmalı.** Aynı bileşen yanlış route ağacına bağlanabilir veya parametre hiç gelmeyebilir. TypeScript'in `undefined` olasılığı bu sınırı görünür kılar.
4. **Biçimi dönüştürmeden önce denetle.** `Number('abc')` `NaN`, `Number('')` ise `0` üretir. Sayısal olduğunu, tam sayı kaldığını ve uygulamanın kabul ettiği aralıkta bulunduğunu doğrula.
5. **Geçerli kimlik, kaynağın var olduğunu kanıtlamaz.** `'999'` biçim olarak doğru olabilir ama film listesinde bulunmayabilir. “Geçersiz adres” ile “film bulunamadı” farklı durumlar ve farklı mesajlardır.

Bu akış TypeScript narrowing bilgisini de kullanır. `if (!id)` dalı sonrasında `id` mevcut olabilir; regex kontrolü karakter biçimini daraltır; `Number.isSafeInteger` güvenli sayı aralığını denetler. `as number` yazmak yalnızca TypeScript'in uyarısını susturur, URL'deki metni çalışma zamanında sayıya çevirmez.

## Parametreden başlığa giden yol

Şu kod kısa görünür, ama geçersiz değerleri anlamlı biçimde ele almaz:

```tsx
function ShelfEntry() {
  const { id } = useParams()
  const movie = movies.find((item) => item.id === Number(id))
  return <h1>{movie?.title}</h1>
}
```

`id` yokken `Number(undefined)` `NaN` olur. Geçerli biçimli ama listede olmayan id'de `movie` tanımsız kalır, dolayısıyla boş başlık görünür. Kullanıcıya ne olduğunu söylemeyen ekran, route eşleşmesi ile kaynak bulunmasını tek durum sanmıştır.

```tsx check
import { useParams } from 'react-router'

type Film = { id: number; title: string }

const films: Film[] = [
  { id: 42, title: 'Sessiz liman' },
  { id: 73, title: 'Kuzey ışıkları' },
]

function parseId(value: string | undefined): number | null {
  if (!value || !/^\\d+$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export function FilmDetayi() {
  const { id: rawId } = useParams<'id'>()
  const id = parseId(rawId)
  if (id === null) return <p>Geçersiz film adresi</p>

  const film = films.find((item) => item.id === id)
  if (!film) return <p>Film bulunamadı</p>
  return <h1>{film.title}</h1>
}
```

`useParams<'id'>()` Router'ın `id` adındaki parametreyi tipler; parametreyi sayıya dönüştürmez. `parseId` bileşen dışında saf bir fonksiyondur, bu nedenle biçim ve sınır kurallarını ekrandan bağımsız açıklayabilir. Component önce adres hatasını, sonra veri kaynağında kayıt bulunmamasını ayırır. Gerçek bir uygulamada statik `films` yerine API'den veya cache'ten gelen liste olabilir; bu modülde ağ yoktur.

## Path parametresi ile search parametresi

Bir path parametresi çoğunlukla hangi kaynağın görüntülendiğini tanımlar: `/movie/550` belirli bir film detayını açar. Search parametresi ise aynı ekranın görünümünü ayarlar: `/search?q=Matrix&page=2` sorgu ve sayfa seçer. İki değer de URL metnidir; fakat görevleri farklı olduğu için route ağacında farklı yerde okunur.

Path segmenti route'un eşleşmesinde rol oynar. Örneğin `/movie/:id` route'u bir path segmentinin varlığını bekler. `/movie/550/cast` gibi daha derin bir yol tanımlarsan cast bölümü ayrı child route olabilir; id parent ve child route zincirinde kullanılabilir. Route ağacı adres hiyerarşisini ve ortak layout'u beraber ifade eder. URL path'ini yalnızca sayfa bileşeni seçen bir string olarak görme; aynı zamanda browser'ın paylaşabildiği kaynak adıdır.

Bir path parametresi numeric değil slug olabilir. `/books/north-wind` için `id` değerini sayıya çevirmek yanlış olur; doğru işlem slug biçimini ve kabul edilen karakterleri doğrulayıp veri kaynağında aramaktır. Bu dersteki pozitif sayı denetimi film id sözleşmesine dayanır. Her uygulama kendi kimlik formatına uygun parser kullanmalıdır.

URL'den alınan bir parametreyle yeni bir adrese yönlendirme de güven sınırıdır. Örneğin kullanıcı `?returnTo=https://bad.example` göndermiş olabilir; bu değeri kontrol etmeden navigasyonda kullanmak kullanıcıyı uygulamadan dışarı çıkarabilir. Parametreyi yalnızca kaynağı bulmak için değil, hedef adres kurarken de doğrula. Güvenlik modülünde bu riski ayrıca ele alacağız; burada temel ders, tarayıcı URL'sinin kullanıcı girdisi olmasıdır.

Her geçersiz id için aynı işlem yapılması gerekmez. Biçim hatası kullanıcıya adresin bozuk olduğunu söyleyebilir; veri kaynağında bulunmama 404 benzeri içerik olabilir; ağ isteğinin başarısız olması ise tekrar deneme eylemi sunabilir. Bu modülde ağ kullanmadığımız için son durumu kapsamıyoruz, ama `null` dönen parser ile kaynak aramasını ayırmak ileride doğru hata yüzeyini seçmeyi sağlar.

Parametre değiştikçe React route component'i genellikle aynı route türü ve konumunda kalır. Örneğin `/movie/550`'dan `/movie/603`'e geçince detay bileşeni unmount olmak zorunda değildir; hook yeni parametreyi yeni render'da verir. Bileşen kendi state'inde önceki filmin kopyasını tutuyorsa o state'in güncel id ile eşleşip eşleşmediğini ayrıca tasarlamalısın. URL'den türetilen kimliği doğrudan kullanmak eski seçimin yeni adrese sızmasını önler.

## `/movie/73` adresini izleyelim

Tarayıcı route ağacını `/movie/:id` deseniyle eşleştirir. Bileşen `useParams` çağrısında `rawId = '73'` alır; değer henüz number değildir. `parseId` string'in yalnızca rakam içerdiğini görür, `Number('73')` ile 73 üretir ve pozitif güvenli tam sayı koşulunu doğrular. Liste aramasında `item.id === 73` olan `Kuzey ışıkları` bulunur; başlık ekrana yazılır.

| Girdi | Biçim kontrolü | Dönüşüm ve veri araması | Ekran |
| --- | --- | --- | --- |
| `/movie/73` | `'73'` rakam dizisi | `73`; kayıt bulundu | Kuzey ışıkları |
| `/movie/7x` | rakam dizisi değil | Dönüşüm yapılmaz | Geçersiz film adresi |
| Parametre eksik | değer `undefined` | Dönüşüm yapılmaz | Geçersiz film adresi |
| `/movie/999` | geçerli metin | `999`; kayıt yok | Film bulunamadı |
| Çok büyük sayı | rakam dizisi | güvenli integer değil | Geçersiz film adresi |

Bu sıra, `Number` dönüşümünün tek başına neden yetersiz olduğunu gösterir. Dönüşüm bir dizeyi sayıya çevirebilir; ama iş alanı açısından kabul edilebilir id olduğunu garanti etmez. Pozitiflik, tam sayı, güvenli aralık ve veri kaynağında bulunma ayrı sorulardır.

## Ekrandaki sınır durumları

Adres parametresini `useState` içine kopyalamak gereksiz ikinci bir kaynak yaratır. URL `/movie/73` iken state `42` kalırsa ekranda yanlış film açılabilir. Route hook'u mevcut eşleşmenin parametresini zaten verir; bu değeri render sırasında türet ve bir effect ile URL'den state'e kopyalama.

Bir diğer tercih, yalnızca pozitif sayıları kabul etmektir. Film id sözleşmesi pozitif tam sayıysa sıfırı veya `-2`'yi veri kaynağına göndermemek daha açıklayıcıdır. Harfli slug kullanan sistemde aynı doğrulama yanlış olur; örneğin `/books/north-wind` metinsel kimliği geçerli olabilir. Doğrulama kuralı route verisinin gerçek sözleşmesine dayanmalı.

:::mistake[Belirti → neden → düzeltme]
`/movie/abc` boş ekran veriyor → `Number(id)` sonrası `NaN` için açık dal yok → parametreyi dönüştürmeden önce biçim ve güvenli aralık kontrolü yap, geçersiz girdiye mesaj göster.
:::

:::mistake[Belirti → neden → düzeltme]
TypeScript hata vermiyor ama eşleşme bulunmuyor → `id as number` ile yalnızca tip iddiası eklenmiş → runtime dönüşümünü `Number` ile yap ve sonucu `Number.isSafeInteger` ile doğrula.
:::

:::mistake[Belirti → neden → düzeltme]
Geçerli olmayan film adresiyle “Film bulunamadı” aynı mesajı alıyor → format kontrolü ile veri araması birleştirilmiş → önce id biçimini, sonra kaydın varlığını ayrı dallarda ele al.
:::

:::model[URL state]
URL route'u ve kaynağın kimliğini seçer; parametre bileşene ham metin olarak gelir. Bu yeni bağlamda URL state'i doğrudan dış girdiye dönüştü: önce string'i daraltıp sayıya çevirdin, sonra kaynak varlığını ayrıca kontrol ettin. Router adresi güvenilir veri olarak doğrulamaz.
:::

:::sector
E-ticaret, dokümantasyon ve içerik siteleri aynı sayfa şablonunu çok sayıda id veya slug için kullanır. Backend route'ları da bu kimliği istek yoluna taşır. Uygulamalar bu nedenle parametreyi servis sınırına geçirmeden önce doğrular; hatalı id'yi API'ye göndermek yerine kullanıcıya uygun 404 veya geçersiz adres yüzeyi gösterir.
:::

## Özet

- Dinamik route parametresi `useParams` ile okunur ve string olarak gelir.
- Eksik, yanlış biçimli, güvenli sayı aralığının dışındaki ve kaynağı bulunmayan durumlar ayrıdır.
- Type assertion çalışma zamanı dönüşümü yapmaz; doğrula, dönüştür, sonra kaynağı ara.
- URL değeri dış girdidir; iş alanının gerçek kabul kurallarına göre daraltılmalıdır.

**Kendini yokla:** `'550'` parametresi sayı gibi görünse de neden ayrıca kontrol edilir?

*Cevap:* URL metnidir; eksik, harfli, sıfır veya güvenli integer sınırı dışı değer gelebilir.

**Kendini yokla:** `/movie/999` ile `/movie/abc` neden farklı mesaj alabilir?

*Cevap:* Birincisi biçimce geçerli bir kimliğin veri kaynağında bulunmamasıdır, ikincisi ise id biçiminin geçersiz olmasıdır.
