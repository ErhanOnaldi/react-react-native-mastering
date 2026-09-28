---
title: "Listelerde key ve bileşen kimliği"
minutes: 19
kind: concept
---

# Listelerde key ve bileşen kimliği

:::pain[Notlar başka satıra taşınıyor]
Bir görev listesinin ilk satırına “sabah ara” yazıyorsun, sonra listeyi önem sırasına göre diziyorsun. Yazdığın not artık başka görevin yanında. Metin input'ta duruyor; ama React satırları sıraya göre eşleştirdiği için state eski satır konumunda kalmış.
:::

## React state'i ağaçta kime bağlar?

React component'i yalnızca fonksiyon adıyla tanımaz. Ekrandaki component instance'ı render ağacında belirli bir konumda yaşar. Aynı konumda aynı component türü devam ediyorsa React çoğu zaman state'i korur. Liste öğeleri yer değiştirince “aynı konumdaki aynı tür” hâlâ eşleşebilir; React'e öğenin kim olduğunu bildiren `key` bu yüzden gerekir.

![React ağacında konum, component türü ve key ile kimlik](diagram:agac-ve-kimlik "State'in ağaçtaki sahibi")

Kimlik modelini şu kurallarla kullan:

1. **State bir render ağacı konumuna aittir.** Component fonksiyonunun içinde tanımlı state, fonksiyonun her çağrısında sıfırlanan bir değişken değildir; React onu ağaçtaki karşılık gelen component instance'ında saklar.
2. **Aynı konumdaki aynı tür genellikle state'i korur.** Bir render'da `ProfilePane`, sonraki render'da yine aynı konumda `ProfilePane` varsa React mevcut instance'ı güncelleyebilir.
3. **Tür veya kimlik değişince state sıfırlanır.** Aynı ebeveyn altındaki aynı konumda başka bir component türü görünürse önceki instance artık orada değildir. `key` değişirse de React eski instance'ı kaldırıp yeni kimlikte component kurar; o alt ağacın yerel state'i baştan başlar.
4. **Listede `key`, öğeyi sıra numarasından bağımsız tanımlar.** Aynı kardeş listesindeki her anahtar benzersiz ve render'lar arasında kararlı olmalıdır. Veritabanı id'si gibi öğenin kendi kimliği uygundur.
5. **`key` yalnız React'e aittir.** Çocuğun içinde `props.key` diye okuyamazsın. Bileşenin kimliği veriye lazımsa `id` gibi ayrı prop gönder.

Bu nedenle `key` “React uyarısını susturan bir alan” değildir. Önceki ağaçtaki bir child ile sonraki ağaçtaki child arasında kimlik eşlemesi kurar. Sıralama veya ekleme olduğunda React, bileşen state'ini doğru veri öğesiyle beraber taşıyabilir.

## Index key neden yanlış kimlik verir?

Üç satır şu sırada olsun: A, B, C. Index key kullanıldığında anahtarlar `0`, `1`, `2` olur. Başına yeni X eklendiğinde görünüm X, A, B, C olur ve React'in gördüğü anahtarlar yine `0`, `1`, `2`, `3` şeklindedir. Anahtar 0 daha önce A'yı gösteriyordu, artık X'i gösteriyor. React aynı key ve component türü eşleşmesini görünce state'i eski konumdaki A'dan yeni X'e koruyabilir.

Stable ID kullanırsan önceki kimlikler `a`, `b`, `c`, sonraki liste `x`, `a`, `b`, `c` olur. React `a` kimliğini yeni konumda tanır ve A'nın state'ini A ile taşır. Liste sırası değişse bile kimlik sabit kalır.

| Önceki sıra | Index key | Stable ID |
| --- | --- | --- |
| A, B, C | 0→A, 1→B, 2→C | a→A, b→B, c→C |
| X, A, B, C | 0→X, 1→A, 2→B, 3→C | x→X, a→A, b→B, c→C |
| React'in yorumu | key 0 aynı yerde kaldı; öğe değişmiş olabilir | `a` aynı öğeyi anlatıyor; sıra değişebilir |

İz sürme tablosu state'in neden yanlış yerde göründüğünü açığa çıkarır. `key` yoksa React kardeşleri konum üzerinden eşleştirmeye çalışır. `key={index}` eklemek bu davranışı her zaman düzeltmez; liste başına ekleme, silme veya sıralama durumunda sıra numarası öğenin kimliği değildir.

## Önce kırık, sonra kararlı liste

Aşağıdaki bileşenlerde kullanıcı notu her satırın kendi state'idir:

```tsx
function Agenda({ items }: { items: { id: string; label: string }[] }) {
  return items.map((item, index) => <AgendaRow key={index} label={item.label} />)
}
```

`items` yeniden sıralanınca `index` aynı kalır ama arkasındaki kayıt değişir. Satır state'i eski pozisyonda tutulur. Öğenin kendi `id` değerini key yap:

```tsx check
import { useState } from 'react'

type Errand = { id: string; label: string }

function ErrandRow({ label }: { label: string }) {
  const [note, setNote] = useState('')
  return (
    <label>
      {label}
      <input aria-label={`${label} notu`} value={note} onChange={(event) => setNote(event.currentTarget.value)} />
    </label>
  )
}

function ErrandList({ items }: { items: Errand[] }) {
  return items.map((item) => <ErrandRow key={item.id} label={item.label} />)
}

const errands = <ErrandList items={[{ id: 'a1', label: 'Kuru temizleme' }]} />
void errands
```

`ErrandRow` state'ini `item.id` ile tanımlı child kimliğine bağladık. Reorder sonrası key aynı kalır, component yeni konuma gider ve not aynı errand ile kalır. Eğer kayıt silinip aynı ID ile yeniden ekleniyorsa ürünün beklentisini düşün: aynı ID aynı şey demekse state'i koru; yeni bir kayıt kimliği olmalıysa yeni ID ver.

## Kimliği bilerek sıfırla

Key yalnız listelerde kullanılmaz. Bileşenin yerel state'ini belirli bir kayıt değişince sıfırlamak istiyorsan component instance'ına bir kimlik verirsin:

```tsx
<Editor key={document.id} document={document} />
```

`document.id` değişince React eski `Editor` instance'ını kaldırır ve yenisini kurar; taslak state'i de sıfırlanır. Bu, her prop değişiminde effect ile state sıfırlamaya çalışmaktan daha doğrudan bir kimlik kararıdır. Yalnızca içerik metni değişti diye taslak kaybolmamalıysa key'i `document.id` gibi anlamlı kimlikte tut; `Math.random()` veya her render'da üretilen key eski ağacı sürekli unmount eder.

Bir listede key'ler yalnız aynı kardeş dizisi içinde benzersiz olmalıdır; uygulamanın her yerinde global tekil olmaları gerekmez. Key olarak `id` üretmek mümkün değilse sıra yalnızca sabit duran, yeniden sıralanmayan ve araya eleman eklenmeyen listede kullanılabilir. Liste etkileşimli veya değişkense kimliği veri modelinde çöz.

Key string veya number olabilir; aynı id değerini çevredeki başka listede kullanman çakışma oluşturmaz, çünkü React karşılaştırmayı aynı ebeveynin çocukları arasında yapar. `key={`${groupId}:${itemId}`}` gibi bileşik kimlik, öğe id'si yalnız kendi grubunda benzersizse yararlı olabilir. Bu kimliğin render'lar arasında değişmemesi şarttır; `Math.random()` biçiminde her render'da yeni değer üretmek kararlılığı bozar.

Key'in ne yaptığını DOM çıktısında her zaman görmezsin. Bir listede basit metin satırları varsa index key ile id key ikisi de aynı metinleri gösterebilir. Fark, component state'i, input'un browser değeri veya açık alt panel gibi öğeye bağlı durum bulunduğunda ortaya çıkar. Bu nedenle bir listenin doğru çalıştığını yalnız ilk render'a bakarak değerlendirme: başa kayıt ekle, sil, sırala ve satır içi etkileşimi tekrar dene.

React key'i child'ın public props API'si olmadığı için `key` değerini component içinde loglayıp debug edemezsin. Gerekli iş verisini ayrıca `id` prop'u olarak gönder; bu hem JSX'i okuyan kişiye anlam verir hem bileşenin davranışını test edilebilir kılar. `key` React'in iki render ağacını eşleştirme işidir, domain logic'in yerine geçmez.

### İki liste güncellemesini zaman sırasıyla izle

Bir alışveriş listesinde ilk sırada “Çay” (`id = c`), ikinci sırada “Pirinç” (`id = p`) olsun. Çay satırındaki yerel input state'ine “az kaldı” yazıldı. Liste ters çevrildiğinde React her iki satırın da aynı `Row` tipinde olduğunu görür. Index key'de ilk slot yine `0` olduğu için “az kaldı” artık Pirinç yanında görünür. ID key'de `c` yeni ikinci sıraya taşınır; not Çay ile gider.

| An | Görünen sıra | Index key → yerel not | ID key → yerel not | Ekran |
| --- | --- | --- | --- | --- |
| Render 1 ve commit | Çay, Pirinç | `0 → ''`, `1 → ''` | `c → ''`, `p → ''` | İki boş input |
| Çay'a yazma | Aynı sıra | `0 → 'az kaldı'` kuyruğa girer | `c → 'az kaldı'` kuyruğa girer | Commit'e dek önceki metin |
| Render 2 ve commit | Aynı sıra | `0 → 'az kaldı'` | `c → 'az kaldı'` | Not Çay yanında |
| Ters çevirme, render 3 | Pirinç, Çay | `0` artık Pirinç'e eşleşir | `c` Çay'a eşleşir | Commit'e dek eski sıra |
| Commit 3 | Pirinç, Çay | İlk input Pirinç yanında dolu | İkinci input Çay yanında dolu | Kimlik seçimine göre farklı sonuç |

Buradaki kuyruğa giren güncelleme listeyi sıralayan parent'ın state güncellemesinden ayrıdır. Çocuğun not state'i yeni sırayı hesaplamaz; React yalnız eski ve yeni ağaçtaki child'ların hangisinin aynı olduğunu kararlaştırır. Effect kullanan satırlarda da aynı kimlik kararı geçerlidir: yanlış eşleme, bir satıra ait aboneliğin başka veriye aitmiş gibi kalmasına yol açabilir.

### Koşullu ağaçta konum neden şaşırtır?

Liste dışındaki koşullu JSX'te de aynı kural işler. `isCompact ? <Details compact /> : <Details compact={false} />` ifadesinde iki dalın `Details` öğesi aynı ebeveyn konumunda ve aynı tiptedir; `compact` prop'u değişse de yerel state korunur. “İki farklı dal yazdım, form sıfırlanır” beklentisi yanlıştır. Sıfırlamak istersen kimlik kararını görünür kıl: `key={isCompact ? 'compact' : 'wide'}`. Sıfırlamak istemiyorsan key ekleme; yalnız görünümü prop ile değiştir.

Koşullu dallardan biri `<Details />`, diğeri `<p>Kapalı</p>` ise o konumda tip değişir. React eski `Details` alt ağacını kaldırır. Sonra tekrar `Details` gösterildiğinde önceki yerel taslak geri gelmez. Veriyi korumak ürün gereksinimiyse state'i daha yukarıdaki kalıcı bir ebeveynde saklaman gerekir. CSS ile gizlemek, DOM ve state'i tutar ama arka plandaki effect'leri de canlı bırakabilir; bunun maliyetini ayrıca değerlendir.

| Geçiş | Aynı konum / tip? | Key aynı mı? | Yerel state |
| --- | --- | --- | --- |
| `Details compact` → `Details wide` | Evet | Evet | Korunur |
| `Details key="a"` → `Details key="b"` | Evet | Hayır | Sıfırlanır |
| `Details` → `p` → `Details` | Hayır | İlgisiz | Yeniden başlar |

İç içe dizilerde key'in doğru seviyede bulunması da önemlidir. `items.map(item => <><h3>{item.label}</h3><Row /></>)` yazarsan döndürülen dış Fragment key'sizdir; içerideki `Row` key'i kardeş Fragment'ları tanımlamaz. Birden fazla DOM düğümü döndüren satırda `<Fragment key={item.id}>` kullan. Key'i `Row` içine prop gibi koymak veya daha içteki bir `<div>`'e taşımak, dış dizinin eşlemesini düzeltmez.

### Sonraki modüllerde kimlik

Form modülünde düzenlenen kayıt değişince taslağın korunup korunmayacağına `key` ile bilinçli karar vereceksin. Effect bölümünde bir bileşen unmount olduğunda cleanup'ın neden çalıştığını, farklı key'in neden yeni setup başlattığını izleyeceksin. Query cache'teki `queryKey` farklı bir kimlik sistemidir: sunucu verisinin cache adresini belirler, React bileşeninin yerel state kimliğini değil. Performansta kararsız key yüzünden her satırın yeniden mount olması, memoization denemelerini de boşa çıkarır.

## Sık hatalar

:::mistake[Index'i key yapmak]
Belirti → Input içeriği sıralama veya araya kayıt ekleme sonrası başka satırın yanında beliriyor.  
Neden → Index, veri öğesinin kimliği değil o anki konumudur.  
Düzeltme → Kardeş listesinde kararlı ve benzersiz veri id'sini key olarak kullan.
:::

:::mistake[Her render'da yeni key üretmek]
Belirti → Input her güncellemede temizleniyor veya effect cleanup/setup sürekli tekrarlanıyor.  
Neden → Yeni key her render'da React'e tamamen yeni component instance'ı söylüyor.  
Düzeltme → Kimliği öğe verisinden veya açık reset sınırından üret; rastgele değer kullanma.
:::

:::mistake[Key'i child prop'u gibi okumak]
Belirti → `props.key` undefined görünüyor.  
Neden → `key`, React'in reconciliation bilgisi; component'e normal prop olarak verilmez.  
Düzeltme → Aynı değeri hem `key={item.id}` hem `id={item.id}` ile gönder.
:::

:::mistake[Birden fazla öğeye aynı key'i vermek]
Belirti → React listede duplicate key uyarısı veriyor ve öğe güncellemeleri kararsızlaşıyor.  
Neden → Aynı kardeşler arasında hangi öğenin hangisi olduğu ayırt edilemiyor.  
Düzeltme → Verinin gerçekten benzersiz kimliğini seç; gerekiyorsa modelde bileşik ama kararlı bir key üret.
:::

:::sector
Ürün ekipleri liste id'sini API veya domain modelinde kararlı tutar ve React listelerinde aynı kimliği kullanır. Bu tercih yalnız uyarıyı kapatmaz; kullanıcının yarım doldurduğu input, açık accordion veya focus gibi component state'inin doğru kayıtla yaşamasını sağlar. Key'i reset aracı olarak kullanıyorsan hangi değişiklikte state'in bilerek silineceğini kod incelemesinde açıkla.
:::

## Özet

- Component state'i render ağacındaki konum, tür ve kimlikle saklanır.
- `key`, kardeş listelerinde aynı veri öğesini render'lar arasında tanımlar.
- Index ve rastgele key, değişken listelerde yanlış kimlik eşlemesi oluşturur.
- Key değişimi component state'ini bilerek sıfırlayabilir; `key` component prop'u değildir.

**Kendini yokla:** Liste başına eleman eklenince index key'in 0 numarası neden risklidir?  
*Cevap:* 0 numara artık başka veri öğesini gösterir; React eski component state'ini yeni öğeye bağlayabilir.

**Kendini yokla:** `key={record.id}` değiştiğinde React ne yapabilir?  
*Cevap:* Eski component instance'ını kaldırıp yeni instance kurabilir; o component'in state'i sıfırlanır.
