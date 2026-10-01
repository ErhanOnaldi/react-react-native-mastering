---
title: "Duruma göre JSX göster"
minutes: 18
kind: concept
---

# Duruma göre JSX göster

JavaScript'te `if` ile hangi satırların çalışacağını seçiyorsun. React'te de props veya state'e bakıp hangi JSX'in ekranda olacağını seçebilirsin. Bu seçime **koşullu render** denir: koşula göre arayüzün bir parçasını gösterir ya da başka bir parçayla değiştirirsin.

## İki seçenekten birini seç

Favori durumuna göre bir etiketi değiştirelim. JavaScript'in **ternary** ifadesi, `koşul ? doğruSonuç : yanlışSonuç` biçiminde iki değerden birini seçer:

```tsx check
function FavoriteLabel({ favorite }: { favorite: boolean }) {
  return <p>{favorite ? 'Favoride' : 'Favoriye ekle'}</p>
}

const label = <FavoriteLabel favorite={false} />
void label
```

`favorite` true ise ilk metin, false ise ikinci metin gelir. Ternary iki seçeneğin ikisini de görünür kılar; kullanıcı durum değiştiğinde ne göreceği bellidir. İki görünüm de anlamlıysa bu açıklık işine yarar.

## Tek bir parçayı koşula bağla

Bazen ikinci bir görünüm gerekmiyor; örneğin yalnızca pozitif favori sayısında kısa bir not gösterilebilir. `&&` (mantıksal VE) JavaScript'te sol taraf doğruysa sağ tarafı, değilse sol tarafın kendisini döndürür. Bu davranışa **kısa devre** denir.

```tsx check
function FavoriteCount({ count }: { count: number }) {
  return <section>{count > 0 && <p>{count} favori</p>}</section>
}

const count = <FavoriteCount count={2} />
void count
```

`count > 0` sonucu sayı değil boolean'dır: 2 için true, 0 için false. React boolean `false` değerini metin olarak göstermez; bu yüzden sıfırda paragraf yoktur, iki olduğunda “2 favori” görünür. Tek koşullu parça göstermek için bu biçim uygundur.

Burada sık görülen bir hata, sayının kendisini koşul olarak kullanmaktır:

```tsx
<p>{count && `${count} favori`}</p>
```

`count` sıfırken sol değer `0` olur. `&&` sonucu false değil `0` olduğundan React paragrafta sıfırı yazabilir. Belirti boş durumda ekranda tek başına `0` görmendir. Bunu düzeltmek için `{count > 0 && ...}` yaz veya sıfır durumunda ayrı bir mesaj gerekiyorsa ternary kullan.

| `count` | `count && 'favori'` sonucu | Ekran davranışı |
| ---: | --- | --- |
| 0 | `0` | React `0` sayısını gösterir |
| 2 | `'favori'` | Sağ taraftaki metin gösterilir |
| `count > 0` iken 0 | `false` | React boolean `false` değerini göstermez |

İki dalı birlikte görelim: sayı varsa özet, yoksa boş durum mesajı:

```tsx check
type SummaryProps = { count: number }

function FavoriteCountMessage({ count }: SummaryProps) {
  return (
    <p>{count > 0 ? `${count} favori` : 'Henüz favori yok'}</p>
  )
}

const summary = <FavoriteCountMessage count={0} />
void summary
```

Burada `count > 0` ifadesi boolean üretir. Sıfırda kullanıcı boş durumun ne anlama geldiğini okur; pozitif değerde güncel sayı görünür. Bir koşuldan sonra hangi JSX'in seçileceğini görsel olarak anlayabiliyorsan sonraki kişiye de okumak kolaylaşır.

## Dışarıdan gelen verinin her durumunu göster

Bir arama ekranında yalnız “liste var mı?” diye bakmak yetmez. Arama başlamamış olabilir, yükleniyor olabilir, hata vermiş olabilir veya başarıyla tamamlanabilir. **Discriminated union**, ortak bir `status` alanıyla birbirinden ayrılan nesne tiplerinin kümesidir; `status` değerini kontrol ettiğinde TypeScript o duruma ait alanları bilir.

Sinema'daki keşif ekranının görünümünü, istek başlatmadan yalnızca kendisine verilen duruma göre seçelim:

```tsx check
type DiscoveryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; films: { id: number; title: string }[] }

function DiscoveryResult({ state }: { state: DiscoveryState }) {
  switch (state.status) {
    case 'idle':
      return <p>Bir film ara</p>
    case 'loading':
      return <p role="status">Sonuçlar yükleniyor</p>
    case 'error':
      return <p role="alert">{state.message}</p>
    case 'success':
      return state.films.length === 0
        ? <p>Bu aramayla film bulunamadı</p>
        : <ul>{state.films.map((film) => <li key={film.id}>{film.title}</li>)}</ul>
  }
}

const result = <DiscoveryResult state={{ status: 'idle' }} />
void result
```

`status` kontrolüne göre tipin belirli bir durumla sınırlanmasına **narrowing** (daraltma) denir. `error` dalında `message` alanını okuyabiliriz; diğer durumlarda o alan yoktur. `success` dalında film listesi bulunur ama liste boş olabilir. Başarılı ve boş sonuç hata değildir, dolayısıyla ayrı bir metin gösteriyoruz. `role="status"` yüklenme bilgisini, `role="alert"` ise hata mesajını yardımcı teknolojiye duyurur.

![Durum alanının her veri durumu için ayrı görünür dal seçmesi](diagrams/durum-dallanmasi.svg "Duruma göre görünüm")

Beş olası girdiyi tek tek izleyelim:

| Gelen state | Seçilen dal | Kullanıcıya görünen |
| --- | --- | --- |
| `{ status: 'idle' }` | `idle` | Bir film ara |
| `{ status: 'loading' }` | `loading` | Sonuçlar yükleniyor |
| `{ status: 'error', message: 'Bağlantı yok' }` | `error` | Alert içinde bağlantı hatası |
| `{ status: 'success', films: [] }` | `success`, boş liste | Bu aramayla film bulunamadı |
| `{ status: 'success', films: [{ id: 1, title: 'Arrival' }] }` | `success`, dolu liste | Film satırı |

Her adımda sadece `status` kontrolü hangi alanların güvenli olduğunu belirler; sonra bu dala uygun JSX üretilir. Ekranı çizen component yeni bir istek başlatmaz, gelen durumu gösterir. Yeni bir durum eklendiğinde ona da görünür bir karşılık düşünmen gerekir; aksi halde kullanıcı o state'te boş ekran görebilir.

:::mistake[Sayıyı doğrudan `&&` önüne koymak]
Belirti → Sayı sıfırken ekranda `0` beliriyor.  
Neden → `0 && jsx` ifadesinin sonucu boolean değil, sol değer olan 0'dır.  
Düzeltme → `count > 0 && jsx` kullan veya sıfır için ternary dalı tanımla.
:::

:::mistake[Boş başarıyı hatayla aynı göstermek]
Belirti → Arama başarıyla tamamlanmış ama boş listede hata veya yüklenme metni görünüyor.  
Neden → `success` içindeki boş liste, `error` ve `loading` durumlarıyla aynı değil.  
Düzeltme → Önce `status` ile dış durumu seç; success içinde liste uzunluğunu ayrıca kontrol et.
:::

## Özet

- İki görünümden biri için ternary (`? :`), tek ek parçayı koşula bağlamak için boolean koşullu `&&` kullan.
- Sayıyı doğrudan `&&` soluna koyma; 0 ekranda görünebilir.
- Uzak veride idle, loading, error ve success ayrı görünür durumlardır.
- `status` kontrolü union'ı daraltır; boş başarıyı kendi metniyle göster.

**Yeni terimler:** Koşullu render, veriye göre hangi JSX'in gösterileceğini seçmektir; ternary, koşula göre iki değerden birini seçen `? :` ifadesidir; kısa devre, `&&` operatörünün sol değere göre sağ tarafı değerlendirmeyi bırakmasıdır; discriminated union, ortak alanla ayrılan nesne tipleri kümesidir; narrowing, koşuldan sonra TypeScript tipinin daha belirli hale gelmesidir.

**Kendini yokla:** `count` 0 iken `count && <p>...</p>` neden 0 gösterebilir?  
*Cevap:* `&&` falsy sol değeri geri döndürür; bu değer `0` olur ve React sayıyı render eder.

**Kendini yokla:** `message` alanını hangi `status` dalında okuyabilirsin?  
*Cevap:* Yalnız `error` dalında; status kontrolü tipi daraltır.
