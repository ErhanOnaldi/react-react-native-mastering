---
title: "Arama ve filtre URL’de"
minutes: 14
kind: concept
---

# Arama ve filtre URL’de

:::pain[Problem]
Sinema'da arama metni, sayfa ve tür üç ayrı `useState` içinde. `?q=Matrix&page=4&genre=28` ekranında sorguyu “Dövüş” yapınca dördüncü sayfada kalıyorsun; yenileyince bütün filtreler siliniyor. Paylaşılan linkin ekrandaki seçimlerle aynı kalmasını istiyorsun.
:::

## Query string ekranın seçimini taşısın

Path çoğunlukla hangi kaynak veya sayfanın açık olduğunu belirtir; query string aynı sayfanın görünümünü süzen seçimleri taşır. `/search?q=Matrix&page=2&genre=28` hâlâ arama sayfasıdır, ama sorgu, sayfa ve tür farklıdır. Bu değerler yenileme, yer imi, paylaşma ve geri/ileri davranışının parçası olacaksa adres doğal bir kaynaktır.

![URL'nin query değerlerinden kontrolleri ve görünür film listesini kurması](diagram:url-state)

1. **Search parametreleri URL'de metindir.** `params.get('page')` `string | null` döndürür; `4` sayısını otomatik üretmez. Sınırdan sonra doğrula ve sayıya dönüştür.
2. **Görünüm URL'den türetilir.** Query string'i okuyup input, seçili filtre ve sonuç listesini render sırasında üret. Aynı `q`'yu hem URL'de hem component state'te tutarsan iki kaynak zamanla ayrışabilir.
3. **Bir parametreyi değiştirirken ilgisiz olanları koru.** Kullanıcı sorguyu değiştirince `genre` seçimi yerinde kalmalıysa yeni search string'i mevcut params üzerinden türet.
4. **Birbirine bağlı değerleri aynı gezinmede güncelle.** Yeni arama artık eski son sayfaya ait değildir; `q` değişirken `page` silinmeli veya varsayılan sayfa açıkça yazılmalıdır.
5. **Geçersiz URL için güvenli varsayılan belirle.** Eksik `page`, `page=abc`, ondalıklı veya 0 gibi değerler ekranı bozmamalı. Uygulama sözleşmesi bu örnekte 1. sayfaya döner.
6. **URL değişikliği gezinmedir.** `setSearchParams` yeni konum üretir. Geri tuşu önceki arama/filtre görünümüne dönebilir; bunu bileşen state'ine kopyalamaya gerek yoktur.

Query string'i okurken `URLSearchParams` kullanmak ayrıştırma ve kodlama ayrıntılarını tarayıcıya bırakır. Elle `split('&')` ve `split('=')` yapmak boşluk, Unicode, tekrar eden anahtar veya percent encoding gibi ayrıntıları yanlış ele alabilir. Film adındaki `Dövüş` harfinin URL'de doğru temsil edilmesi için encode/decode işini bu API'ye bırak.

## Kopyalanmış state'in ayrışmasını düzelt

Aşağıdaki bileşen URL'den ilk değeri alıyor, sonra input için bağımsız bir state oluşturuyor:

```tsx
function SearchInput() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  return <input value={query} onChange={(event) => setQuery(event.target.value)} />
}
```

İlk render'da input doğru görünebilir. Sonra kullanıcı başka bir route'a veya arama linkine giderse URL değişir ama `query` eski component state'inde kalabilir. İki doğru kaynak oluşmuştur. Bunun yerine değeri her render'da URL'den oku ve değişen parametreleri adres üzerinden yaz:

```tsx check
import { useSearchParams } from 'react-router'

export function ShelfSearch() {
  const [params, setParams] = useSearchParams()
  const query = params.get('title') ?? ''
  const genre = params.get('kind') ?? ''
  const rawPage = params.get('page') ?? '1'
  const candidate = Number(rawPage)
  const page = Number.isSafeInteger(candidate) && candidate > 0 ? candidate : 1

  function changeTitle(nextValue: string) {
    setParams((current) => {
      const next = new URLSearchParams(current)
      const trimmed = nextValue.trim()
      if (trimmed) next.set('title', trimmed)
      else next.delete('title')
      next.delete('page')
      return next
    })
  }

  return (
    <section>
      <label>
        Başlığa göre ara
        <input value={query} onChange={(event) => changeTitle(event.target.value)} />
      </label>
      <p>Tür: {genre || 'Tümü'}</p>
      <p>Sayfa {page}</p>
    </section>
  )
}
```

Fonksiyonel güncellemede mevcut params kopyalanır. Böylece `kind=history` korunur; yalnızca boş olmayan yeni `title` yazılır ve sorgu değişince `page` silinir. `URLSearchParams` üzerinde `set` mevcut anahtarı yeniler, `delete` parametreyi kaldırır. Boş arama için `title=` saklamak yerine anahtarı kaldırmak, varsayılan durumu URL'de daha okunur tutar.

## Değişimi zaman çizelgesinde izleyelim

Başlangıç adresi `?title=Rüzgar&page=4&kind=history` olsun. Bileşen title için `Rüzgar`, genre için `history`, page için 4 okur. Kullanıcı title'ı `Kıyı` yapınca fonksiyon geçerli params kopyasını alır; title'ı değiştirir ve sayfayı siler. Yeni URL `?title=Kıyı&kind=history` olur. Ekran yeniden render olduğunda page varsayılanı 1'dir.

| Adım | URL | Bileşenin türettiği görünüm |
| --- | --- | --- |
| İlk açılış | `?title=Rüzgar&page=4&kind=history` | Rüzgar, history, sayfa 4 |
| Arama değişti | `?title=Kıyı&kind=history` | Kıyı, history, sayfa 1 |
| Sayfa artırıldı | `?title=Kıyı&kind=history&page=2` | Kıyı, history, sayfa 2 |
| Back | `?title=Rüzgar&page=4&kind=history` | Önceki filtre ve sayfa geri gelir |

Sayfa değiştirmek için params nesnesini boş bir obje ile değiştirmek yerine mevcut değerleri koru. Filtreler arttıkça bu kural daha önemli hale gelir: kullanıcı sayfa 2'ye geçerken sıralamayı veya seçtiği türü kaybetmemelidir. Bir route aynı anda birkaç alanı güncelliyorsa yeni adresi tek bir tutarlı değişiklik olarak üret.

`URLSearchParams` bir mutable nesnedir; `set` ve `delete` aynı nesneyi değiştirir. Setter callback'i içinde önceki objeyi doğrudan değiştirmek yerine kopyasını oluşturmak açık ve güvenli bir güncelleme sınırı verir. Böylece eski URL'yi karşılaştırmak, mevcut değeri okumak veya farklı bir render'da aynı parametreleri kullanmak yan etkiyle bozulmaz.

Bir güncellemede `setSearchParams({ q: 'Kıyı' })` gibi sade nesne kullanımı uygun olabilir, fakat bu nesne tüm query string'in yerine geçer. Uygulamada sayfa, sıralama ve tür anahtarlarını aynı anda saklıyorsan diğerlerini koruma sorumluluğu sana aittir. Güncelleme API'sinin varlığı ürün kuralını otomatik belirlemez: hangi anahtarın silineceğini, hangisinin kalacağını sen tarif etmelisin.

URL'nin görünür olması teşhis için iyidir, fakat query string kişisel veri için güvenli alan değildir. Arama kutusunda kimlik numarası, e-posta veya gizli kod toplanıyorsa bunu URL'ye koymak tarayıcı geçmişinde ve kopyalanan linkte açığa çıkarabilir. Ayrıca query parametreleri URL uzunluğu ve paylaşılabilirlik sınırlarına sahiptir; büyük filtre durumları için sunucu tarafında saklanan kısa bir paylaşım anahtarı gerekebilir.

Geçersiz değeri ekranda varsayılan kabul etmekle URL'yi otomatik düzeltmek aynı karar değildir. `?page=abc` için ekranda sayfa 1 gösterip adresi aynen bırakabilirsin; böylece kullanıcı girdisi kaybolmaz. Uygulama URL'yi kanonikleştirmek istiyorsa ayrı navigasyon yapar ve geri history davranışını düşünmelidir. İlk olarak render edilen değerin güvenli olması yeterlidir.

Arama input'unu kontrollü tutmak, kaynağın local state olması demek değildir. Controlled input yalnızca görünen `value` ile değişiklik akışının açık olmasını söyler. `value={params.get('title') ?? ''}` olunca kontrol URL'dedir; `onChange` değeri yeni URL'ye yazar. Bu ayrım, controlled form bilgisini route state'le birleştirmenin temelidir.

## Sayı, boşluk ve tekrar eden anahtarlar

`Number('')` sıfır verdiği için eksik query değerini önce varsayılanla tamamla. `Number('2.5')` sayı üretse bile sayfa numarası tam sayı olmalıdır; `Number.isInteger` veya `Number.isSafeInteger` ile doğrula. Büyük tamsayılar JavaScript'in güvenli aralığını geçebilir; film sayfalaması için böyle bir değerin anlamı yoksa varsayılanı kullan.

URL'de aynı anahtar iki kez bulunabilir: `?page=2&page=3`. `get('page')` ilk değeri döndürür; bu davranış ürün için uygun değilse tekrarları reddet veya tekilleştir. Yüzlerce filtre için tüm seçenekleri query string'e koymak da iyi bir tasarım değildir; gizli, kişisel veya büyük veriyi URL'de saklama. URL tarayıcı geçmişinde, loglarda ve paylaşılan metinlerde görülebilir.

Arama kutusunu her karakterde `setSearchParams` ile güncellemek geçmişte çok sayıda kayıt üretebilir. Bu davranışı ürün deneyimine göre seç: anlık paylaşılabilir filtrelerde her değişim anlamlı olabilir; uzun arama metinlerinde debounce veya form submit sınırı gerekebilir. Ancak seçilen yöntem ne olursa olsun gösterilen sonuç ile adresin hangi sorguyu temsil ettiği belirsiz olmamalıdır.

:::mistake[Belirti → neden → düzeltme]
Query değişince seçili tür kayboluyor → yeni params boş nesneden kurulmuş ve yalnızca `q` yazılmış → mevcut URL params'ını kopyala, değiştireceğin anahtarları güncelle.
:::

:::mistake[Belirti → neden → düzeltme]
`page=abc` için ekranda `NaN` veya boş liste var → ham string kontrol edilmeden sayı hesabına girmiş → dönüştür, tam sayı ve alt sınırını doğrula, geçersizse sayfa 1'i kullan.
:::

:::mistake[Belirti → neden → düzeltme]
Geri tuşuna basınca adres değişiyor ama input eski sorguda kalıyor → URL değeri ikinci kez local state'e kopyalanmış → input'un `value` değerini `params.get(...)` sonucundan üret.
:::

:::model[URL state]
URL, paylaşılabilir filtre ve sayfa seçiminin tek kaynağıdır. Önceki derslerde path parametresiyle tek bir kaynağı seçtin; burada search params aynı route'un görünümünü biçimlendirir. Yeni fark, bir değer değişirken ilişkili page değerinin sıfırlanması ve diğer filtrelerin korunmasıdır; render yine URL'den türetilir.
:::

:::sector
Ürün aramalarında linkin destek ekibi, kullanıcı ve otomasyon tarafından tekrar açılabilmesi hata ayıklamayı kolaylaştırır. Ekipler query key adları, varsayılan değerler ve filtre değişince hangi değerlerin sıfırlanacağı konusunda ortak sözleşme belirler. URL ayrıca kullanıcıya görünür olduğundan kişisel veri veya erişim sırrı için uygun depolama alanı değildir.
:::

## Özet

- Path sayfa/kaynağı; query string sayfanın filtre ve sıralama görünümünü seçebilir.
- Search params metindir; doğrula ve ekrandaki değerleri render sırasında URL'den türet.
- Güncellemede diğer filtreleri kopyala, ilgili parametreleri değiştir ve geçersiz sayıyı güvenli varsayılana çevir.
- Filtre değişince bağlı sayfa numarasını sıfırla; sayfa değişince diğer filtreleri koru.
- URL'de hassas veya gereğinden büyük veri taşıma; geçmiş ve paylaşım davranışını ürün kararına kat.

**Kendini yokla:** `?page=4&kind=history` içindeki arama değişince neden `kind` korunup `page` silinir?

*Cevap:* Tür seçimi hâlâ geçerlidir; yeni sorgu eski dördüncü sayfa konumunu artık garanti etmez.

**Kendini yokla:** URL değiştikten sonra input neden ayrıca local state ile eşitlenmek zorunda olmamalı?

*Cevap:* Input değeri zaten URL'den türetilebilir; iki kaynak tutmak geri navigasyonda ayrışma riski doğurur.
