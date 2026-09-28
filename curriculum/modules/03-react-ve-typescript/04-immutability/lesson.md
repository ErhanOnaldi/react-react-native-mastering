---
title: "State'i mutasyonsuz güncelle"
minutes: 15
kind: concept
---

# State'i mutasyonsuz güncelle

:::pain[Değişen nesne, değişmeyen ekran]
Yemek planında bir tarifi “hazırlandı” diye işaretliyorsun. Konsolda tarifin alanı `true`, ama satırdaki etiket eski halinde. Diziye yeni kopya vermiş olsan da dizinin içindeki tarifi yerinde değiştirmiş olabilirsin. Böylece aynı nesne referansını hem eski hem yeni state diye kullanmış olursun.
:::

## State değeri ve referans ilişkisi

React state'i bir değer ve onun kimliği olarak düşün. Sayı veya string gibi ilkel değerlerde değişiklik yeni bir değer üretir. Dizi ve nesne gibi yapılarda ise değişken, içeriğin kendisi değil o içeriği gösteren bir referanstır. `push` veya alan ataması referansın gösterdiği içeriği yerinde değiştirir; yeni state değeri üretmez.

State güncellemesinde şu kurallar geçerlidir:

1. **Önceki state'i değiştirme.** Eski render'lar, memo'lar ve başka bileşenler aynı nesneye referans tutuyor olabilir. Yerinde değişiklik bu gözlemcilerin geçmişini de değiştirir.
2. **Değişen her seviyede yeni referans oluştur.** Nesne içindeki alan değişiyorsa yeni nesne gerekir; o nesneyi taşıyan dizi state ise yeni dizi de gerekir. Değişmeyen dalları paylaşmak güvenlidir.
3. **Yeni state'i setter'a ver.** Yeni referans React'e farklı state değeri sağlar ve güncellemeyi görünür kılar. Aynı referansı geri vermek React'in `Object.is` karşılaştırmasında aynı değer olarak görülebilir.
4. **Updater kullanırken aynı kurala uy.** Setter fonksiyon biçiminde çağrılsa bile `current.push(...)` veya `current.item.done = true` mutasyondur. Fonksiyonel biçim eski state'i değiştirme izni vermez.
5. **Değişiklik kapsamını koru.** Yalnız bir satır güncellenecekse diğer satırları aynı bırak. Tüm listeyi yeniden oluşturabilirsin ama diğer öğelerin verisini sıfırlamamalısın.

![Eski state'i mutasyona uğratmak ile değişen yolu yeni referanslarla üretmenin farkı](diagrams/referans-yolu.svg "Değişen referans yolu")

Bu, “her nesne mutlaka derin kopyalanmalı” demek değildir. Değişen yolu kopyala; değiştirmediğin alt nesneleri paylaş. Böylece hangi değerlerin değiştiği hem React'e hem kodu okuyan kişiye görünür olur.

Neden kimlik bu kadar önemli? React state değerlerini `Object.is` ile karşılaştırır. Aynı dizi referansını geri vermek değişiklik yok sinyali olabilir; yeni dizi üretmek ise yeni bir değer verir. Bu karşılaştırma nesnenin içeriğini derinlemesine taramaz, “içinde bir alan değişti mi?” diye bakmaz. React'in her state setter'da bütün uygulamayı yeniden hesaplamasını önleyen ucuz karşılaştırma budur.

| İşlem | Dış dizi referansı | İç nesne referansı | Önceki state |
| --- | --- | --- | --- |
| `push` ile ekleyip aynı diziyi verme | Aynı | Aynılar | Değişmiş olur |
| Yeni dizi, eski öğeler | Yeni | Aynılar | İçerik korunur |
| Yeni dizi ve değişen öğeye yeni nesne | Yeni | Yalnız hedef yeni | Tamamı korunur |

İkinci satır listeye yeni satır eklemek için yeterlidir; üçüncü satır mevcut satırın alanını değiştirmek için gerekir. Derin kopya her zaman “daha güvenli” değildir: tüm alt ağaçları gereksiz yere yenilersen React'in referans eşitliğinden yararlanmasını engeller ve iş yükünü büyütür. Hedefin yalnızca değişen yol için yeni kimlik üretmektir.

## Dizi içinde bir nesneyi güncelle

Kütüphane rafındaki kitapların okundu bilgisini tutalım:

```ts check
type Book = { id: number; title: string; read: boolean }

function markRead(books: Book[], id: number): Book[] {
  return books.map((book) =>
    book.id === id ? { ...book, read: true } : book,
  )
}

const shelf = [
  { id: 1, title: 'Aylak Adam', read: false },
  { id: 2, title: 'Kürk Mantolu Madonna', read: false },
]
const nextShelf = markRead(shelf, 2)
void nextShelf
```

`map` yeni bir dizi üretir. Eşleşen kitap için object spread yeni nesne üretip `read` değerini değiştirir. Diğer kitap aynı nesne olarak kalır; ona dokunmadığımız için kopyalamaya gerek yoktur. Bu yapıda önceki `shelf` aynen `read: false` değerlerini taşır.

Şimdi işlemi React state'e bağlayalım. Başlangıç kodu listeyi `push` ile değiştiriyor varsayalım:

```tsx
function addTag(tag: string) {
  tags.push(tag)
  setTags(tags)
}
```

Görünen belirti, etiket sayısının tıklamadan sonra yenilenmemesi olabilir. `tags` referansı değişmedi; ayrıca önceki render'ın state'i de sessizce değiştirilmiş oldu. Doğru güncelleme yeni dizi oluşturur:

```tsx check
import { useState } from 'react'

function TagList() {
  const [tags, setTags] = useState(['doğa'])
  function addTag(tag: string) {
    setTags((current) => [...current, tag])
  }
  return <button onClick={() => addTag('macera')}>Etiket: {tags.length}</button>
}

const list = <TagList />
void list
```

Updater'ın `current` değeri bir önceki state'tir; spread onu okur ama değiştirmez. `filter` silme için yeni dizi üretir, `map` dönüştürme için yeni dizi üretir. `sort` varsayılan olarak diziyi yerinde sıralar; state'te kullanacaksan önce kopyala (`[...items].sort(...)`) veya yeni dizi döndüren başka bir yaklaşım seç.

## Kopyalama derinliği: yalnız değişen yol

Nesne içindeki nesneye erişiyorsan her üst seviyeyi kopyalaman gerekir. Örneğin `profile.preferences.theme` değişince yeni preferences, yeni profile gerekir:

```ts
const nextProfile = {
  ...profile,
  preferences: {
    ...profile.preferences,
    theme: 'dark',
  },
}
```

`{ ...profile }` yalnız üst nesneyi kopyalar; `preferences` referansı eskiyle aynı kalır. Sonra `nextProfile.preferences.theme = 'dark'` dersen eski `profile` da aynı iç nesneye baktığı için değişmiş olur. Bu nedenle “yeni dış nesne yaptım” tek başına yeterli değildir: değişen değere giden her seviyedeki referans yenilenmelidir.

TypeScript'in `readonly` işaretleri yanlışlıkla mutasyon yazmanı engelleyebilir ama React update'inin yerini almaz. `readonly Book[]`, derleyiciye bu diziyi mutasyona uğratmama sözüdür; yeni array üretme ve setter çağırma sorumluluğu yine sende kalır. Ayrıca `readonly` yalnız derleme anında etkilidir, runtime veriyi dondurmaz.

Değişiklik fonksiyonunu state dışında saf bir yardımcı olarak yazmak da güncelleme politikasını görünür kılar. Yardımcıya eski state ve hedef id verirsin, yeni değeri döndürür; böylece önceki değerle sonraki değeri yan yana karşılaştırabilirsin. State güncellemesi tek yerde toplanır ve event handler yalnız hangi id'nin değişeceğini bildirir. Yine de her update için yeni helper açmak gerekmez: tek satırlık `map` ifadesi daha açıksa onu doğrudan updater içinde bırak.

Kopyalama sırasında alan silmek de güncelleme hatasıdır. Örneğin bir kitabı `read: true` yapmak için `{ id: book.id, read: true }` döndürürsen `title` alanını unutabilirsin; tsc bu nesne tipini reddeder. `{ ...book, read: true }` eski ve değişmeyen alanları taşır. Eğer alanı bilerek kaldırıyorsan bu başka bir domain güncellemesidir ve bütün çağıranların o yeni biçimi kabul etmesi gerekir.

## Sık hatalar

:::mistake[Önceki state'i `push` ile değiştirmek]
Belirti → Yeni öğe bazen görünmüyor veya başka ekrandaki liste beklenmedik biçimde değişiyor.  
Neden → Dizi yerinde değişti ve aynı referans setter'a geri verildi.  
Düzeltme → `setItems(current => [...current, item])` ile yeni dizi döndür.
:::

:::mistake[Dış nesneyi kopyalayıp iç nesneyi mutasyona uğratmak]
Belirti → Bir güncelleme geçmiş render'da da görünmüş gibi veya memo'lu çocuk güncellenmemiş gibi davranıyor.  
Neden → Yalnız dış nesne kopyalandı; değişen iç referans eskiyle ortak kaldı.  
Düzeltme → Değişen alana giden her seviyeyi spread ederek yeni referans oluştur.
:::

:::mistake[State dizisini doğrudan `sort` etmek]
Belirti → Sıralama ekranı değişirken başka yerde orijinal sıra da değişiyor.  
Neden → `sort` aldığı diziyi yerinde düzenler.  
Düzeltme → Önce `[...items]` kopyala ve kopyayı sırala; sıralama yalnız gösterim içinse state'e ikinci kopya yazmadan türet.
:::

:::mistake[Tüm öğeleri gereksiz yere kopyalayıp içeriği kaybetmek]
Belirti → Tek bir tarif işaretlenince diğer tariflerin notları sıfırlanıyor.  
Neden → Yeni nesne kurarken eski alanlar spread ile korunmadı.  
Düzeltme → Değişen nesnede `{ ...book, read: true }` kullan; yeni dizi üretirken değiştirmediğin öğeleri aynen döndür.
:::

:::sector
Ekiplerde immutable update kuralı, React render'ının yanında undo/redo, memoization ve state değişikliklerinin izlenmesini de kolaylaştırır. Kod incelemede “hangi seviyelerde yeni referans oluşuyor?” sorusu özellikle nested state'te işe yarar. State yapısı sürekli karmaşık kopyalar gerektiriyorsa veriyi normalize etmek veya bir reducer'a taşımak ayrı bir tasarım seçeneğidir.
:::

## Özet

- State içindeki dizi ve nesneleri yerinde değiştirme; yeni değer üret.
- İç içe yapıda değişen alana giden her seviyeyi kopyala.
- `map`, `filter` ve spread yeni yapılar oluşturmaya yardım eder; `push` ve `sort` mutasyondur.
- Değişmeyen dalları paylaş; değişen nesnenin diğer alanlarını spread ile koru.

**Kendini yokla:** Yeni bir dizi üretip içindeki bir nesnenin alanını yerinde değiştirirsen eski state korunmuş olur mu?  
*Cevap:* Hayır. Dizi yeni olsa da iç nesne eski referanssa o nesne mutasyona uğramıştır.

**Kendini yokla:** Bir diziye tek eleman eklemek için updater içinde güvenli ifade nedir?  
*Cevap:* `current => [...current, item]`; eski dizi okunur, yeni dizi döner.
