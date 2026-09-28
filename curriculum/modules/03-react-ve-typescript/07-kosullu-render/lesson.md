---
title: "Koşullu render ve veri durumları"
minutes: 14
kind: concept
---

# Koşullu render ve veri durumları

:::pain[Sıfır sayısı boş ekranda görünüyor]
Profil sayfasında “yaklaşan etkinlik yok” mesajını göstermek için `{eventCount && <p>Etkinlik var</p>}` yazdın. Kullanıcının hiç etkinliği yok; ekranda yine de `0` görünüyor. JavaScript'in kısa devre sonucu sayı 0 olarak kaldı ve React bu sayıyı metin olarak render etti.
:::

## Bir render'da hangi dal görünür?

Koşullu render, mevcut props ve state'e göre hangi JSX'in ağaçta bulunacağını seçer. Boolean koşulda React `true`, `false`, `null` ve `undefined` değerlerini ekranda metin olarak göstermez; fakat `0` gibi sayıları gösterir. Bir verinin durumunu göstereceksen her geçerli durumu açıkça ele almak, sadece truthy/falsy kontrolü yapmaktan daha güvenlidir.

Bu seçim için şu kuralları uygula:

1. **İki karşıt görünüm için ternary kullan.** `isOpen ? <Panel /> : <Summary />`, iki dalın da ne olduğunu açıkça gösterir.
2. **Tek bir görünür dal için boolean üret.** `{count > 0 && <p>{count} öğe</p>}` doğru taraftır; `count` sayısını doğrudan `&&` soluna koymaz.
3. **Eksik değeri ve geçerli boş değeri ayır.** `items.length === 0`, boş listeyi ifade eder. `items` yoksa bu ayrı bir durumdur ve tipe göre ele alınmalıdır.
4. **Dış veri durumlarını ayırt et.** Idle, loading, error ve success farklı kullanıcı deneyimleridir. Başarı halinde boş liste de başarısız istekten farklıdır.
5. **Union discriminant'ı ile daralt.** `status` gibi ortak literal alanı kontrol edince TypeScript o dala özel `message` veya `data` alanını açar.

Boolean operatörleri değer döndürür. `left && right`, sol değer falsy ise sol değeri; truthy ise sağ değeri verir. `count` sayı olduğunda 0 bu nedenle çocuk olarak kalabilir. `count > 0` ise boolean üretir; false React tarafından görünmez. Bu küçük fark koşullu JSX'te sık görülen `0` hatasını önler.

![Durum alanının her veri durumu için ayrı görünür dal seçmesi](diagrams/durum-dallanmasi.svg "Duruma göre görünüm")

## Önce kırık, sonra açık koşul

Bir menüde bildirim sayısı gösterelim. Kırık biçim şu:

```tsx
<p>{unreadCount && `${unreadCount} yeni bildirim`}</p>
```

`unreadCount` 0 iken ifadenin değeri 0 olur; `<p>0</p>` ekranda kalır. Düzeltmek için koşulu boolean yap:

```tsx check
type NoticeProps = { unreadCount: number }

function Notice({ unreadCount }: NoticeProps) {
  return (
    <section>
      {unreadCount > 0 ? (
        <p>{unreadCount} yeni bildirim</p>
      ) : (
        <p>Yeni bildirimin yok</p>
      )}
    </section>
  )
}

const notice = <Notice unreadCount={0} />
void notice
```

Burada görünür iki dal var: pozitif sayıda bildirim özeti, sıfırda boş durum metni. Yalnız bir dal gerekseydi `{unreadCount > 0 && <p>…</p>}` yeterli olurdu. İki durum da içerik gerektiriyorsa ternary daha anlaşılır.

## Uzak veriyi tek anlamlı union olarak kur

Uzak veri ekranda basit bir “var mı?” koşulundan fazlasını gerektirir. Henüz arama yapılmamış durum, istek sürerken görünen spinner, hata mesajı ve başarılı sonuç birbirinin yerine geçmez. Tipte durumları ayırmak, her dalın yalnızca gerçekten taşıdığı alanlara erişmeni sağlar:

```tsx check
type RemoteList<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; items: T[] }

type Event = { id: number; name: string }

function EventResults({ state }: { state: RemoteList<Event> }) {
  switch (state.status) {
    case 'idle':
      return <p>Bir arama yap</p>
    case 'loading':
      return <p role="status">Sonuçlar yükleniyor</p>
    case 'error':
      return <p role="alert">{state.message}</p>
    case 'success':
      return state.items.length === 0 ? (
        <p>Bu aramayla etkinlik bulunamadı</p>
      ) : (
        <ul>{state.items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
      )
  }
}

const results = <EventResults state={{ status: 'idle' }} />
void results
```

## Dört durumlu render'ı izleyelim

`switch` girdisini sırayla dört ayrı nesne olarak düşün. `status: 'idle'` dalında TypeScript yalnız `status` alanını bilir; `message` veya `items` yoktur. `loading` dalı da veri taşımaz. `error` dalına girince `state.message` güvenlidir. `success` dalında `state.items` dizidir; boşluk kontrolünden sonra her satırda `id` key olarak kullanılabilir.

| State | Seçilen dal | Kullanıcıya görünen |
| --- | --- | --- |
| `{ status: 'idle' }` | `idle` | “Bir arama yap” |
| `{ status: 'loading' }` | `loading` | Yükleniyor bilgisi |
| `{ status: 'error', message: 'Ağ yok' }` | `error` | Erişilebilir hata mesajı |
| `{ status: 'success', items: [] }` | `success`, boş alt dal | Sonuç bulunamadı |
| `{ status: 'success', items: [{ id: 1, name: '...' }] }` | `success`, liste alt dalı | Sonuç satırları |

“Success” demek mutlaka görünür liste var demek değildir. Boş sonuç bir hata değildir ve yükleniyor da değildir; kullanıcıya kendi metniyle anlatılır. Aynı şekilde error nesnesini boş dizi gibi gösterirsen hata sebebini saklamış olursun.

Bu tip React'e özel bir şey değil; önceki TypeScript union bilgisinin render'da kullanımıdır. `as` ile state'i zorla success diye işaretlemek eksik durumları gizler. `status` kontrolü verinin gerçekten hangi alanlara sahip olduğunu anlatır ve dalın JSX'ini buna göre seçtirir.

Union'a beşinci bir status eklendiğinde görünüm kodunun da bu durumu ele alması gerekir. `switch` sonuna `assertNever(state)` gibi bir exhaustive kontrol eklersen TypeScript yeni varyant geldiğinde eksik dalı bildirir. Bu küçük guard özellikle erişilebilir hata, empty ve retry davranışlarının unutulmasını engeller. Her projede helper şart değildir; derleyicinin hangi durumun eksik olduğunu göstermesi için default dalı `never` ile sınırla.

Render kararıyla isteği başlatma kararını da ayır. Bu bileşen kendisine verilmiş state'i nasıl göstereceğini hesaplar; `status === 'loading'` diye render sırasında yeni fetch başlatmamalıdır. Bir dış kaynaktan veri alma ayrı bir effect veya data layer sorumluluğudur. Böylece aynı loading state'i, farklı veri kaynağından gelse bile aynı görünür arayüzde gösterebilirsin.

## Sık hatalar

:::mistake[Sıfırı doğrudan `&&` önüne koymak]
Belirti → Boş durumda ekranda `0` yazısı beliriyor.  
Neden → `0 && jsx` sonucunun kendisi 0; React sayıyı render eder.  
Düzeltme → `count > 0 && jsx` gibi boolean koşul kullan veya sıfır için ternary dalı yaz.
:::

:::mistake[Loading ile boş sonucu aynı göstermek]
Belirti → Yükleme sırasında kullanıcı “sonuç yok” mesajı görüyor.  
Neden → Henüz gelmemiş veri ile başarılı ama boş veri aynı `[]` değeriyle temsil ediliyor.  
Düzeltme → Uzak veriyi status union'ında taşı; boş diziyi yalnız success dalında yorumla.
:::

:::mistake[Hata alanını her union dalında var sanmak]
Belirti → `state.message` için TypeScript alanın her durumda bulunmadığını söylüyor.  
Neden → `message` yalnız error varyantında tanımlı.  
Düzeltme → Önce `state.status === 'error'` kontrol et; daralmadan sonra `message` oku.
:::

:::mistake[Koşullu JSX'te iç içe ternary yığmak]
Belirti → Boş, hata ve yükleme dalları tek satırda takip edilemiyor.  
Neden → Her durum aynı ifadeye sıkıştırılmış.  
Düzeltme → Birden çok anlamlı durum varsa `switch` veya erken dönüş kullan; her dalı kendi metniyle görünür yap.
:::

:::sector
Gerçek arama ekranlarında idle, loading, error, success-empty ve success-with-results durumları tasarım ve ürün incelemesinde ayrı ayrı konuşulur. Discriminated union bu kararları kod sözleşmesine taşır. Erişilebilir arayüzlerde yükleme bilgisini `role="status"`, acil hata mesajını `role="alert"` gibi uygun semantik öğelerle duyur; durumu yalnız renkle anlatma.
:::

## Özet

- JSX koşullarında boolean üret; sayısal `0` doğrudan `&&` soluna konursa render edilebilir.
- Ternary iki görünüm, `&&` tek opsiyonel görünüm için uygundur.
- Idle, loading, error ve success ayrı dış veri durumlarıdır; boş başarı da kendi görünümüne sahiptir.
- `status` kontrolü union'ı daraltır ve yalnız o dala ait alanları güvenli kılar.

**Kendini yokla:** `resultCount` 0 iken `resultCount && <p>...</p>` neden “hiçbir şey” değildir?  
*Cevap:* İfadenin sonucu boolean false değil 0 olur; React sayıyı render eder.

**Kendini yokla:** `message` alanına hangi status dalında güvenebilirsin?  
*Cevap:* Yalnız `status: 'error'` dalında; discriminant kontrolü tipi daraltır.
