---
title: "İlkel tipler ve inference"
minutes: 13
kind: concept
---

# İlkel tipler ve inference

:::pain[Matematik yerine metin birleştirme]
Bir e-ticaret sepetinde kargo ücretini hesaplamak istiyorsun. Ürün fiyatı `250`, kargo bedeli ise API'den metin olarak `"35"` geldi. Kodu `total = price + shipping` diye yazdın. `285` lira toplam beklerken ekranda birdenbire `25035 TL` çıktı. JavaScript sessizce sayıyı metne dönüştürdü ve iki değeri uç uca yapıştırdı. Ne bir hata fırlatıldı ne de bir uyarı verildi; kullanıcıya fahiş bir hesap sunuldu.
:::

## Üç temel yapı taşı ve JavaScript'in esnekliği

JavaScript dünyasında neredeyse her şey nesnelerden oluşur gibi görünse de en alttaki temel veriler ilkel (primitive) tiplerdir. TypeScript bu ilkel değerleri üç ana tip altında izler:

1. `string`: Tek tırnak, çift tırnak veya template literal ile tanımlanan tüm metinler (`'standard'`, `"İstanbul"`, `` `Teslimat: ${day}` ``).
2. `number`: JavaScript'te tamsayı ve ondalıklı sayı ayrımı yoktur; tüm sayılar IEEE 754 64-bit kayan noktalı sayı olarak `number` tipindedir (`42`, `3.14`, `-12`, `0`).
3. `boolean`: Yalnızca iki mantıksal değer alabilir: `true` veya `false`.

JavaScript'te değişkenler dinamiktir; bir değişkene önce bir sayı, ardından bir metin atayabilirsin. TypeScript ise değişkenin ilk değerine bakarak onun tipini **çıkarır (infer eder)** ve o değişkenin ömrü boyunca bu tipe sadık kalmasını zorunlu kılar.

## Tip çıkarımı (Inference): TypeScript senin yerine düşünür

TypeScript öğrenmeye başlayanların en sık yaptığı hata her değişkenin yanına açıkça tip yazmaktır (`const name: string = 'Ahmet'`). Oysa TypeScript'in çıkarım motoru oldukça gelişmiştir. Eşitliğin sağ tarafındaki değer zaten kesin bir bilgi veriyorsa, tipi tekrar yazmak koda hiçbir şey katmaz; aksine gürültü oluşturur.

```ts check
// Çıkarım (inference): TypeScript sağ tarafa bakıp tipi kendisi anlar
const customerName = 'Zeynep' // tipi: 'Zeynep' (literal)
let orderCount = 3            // tipi: number
let isVipMember = false       // tipi: boolean

// Aşağıdaki satır tip hatası üretir:
// orderCount = 'beş' -> Type 'string' is not assignable to type 'number'
orderCount = orderCount + 1
void customerName; void isVipMember
```

TypeScript `orderCount` değişkeninin ilk değerinin `3` olduğunu gördüğü anda onun tipini `number` olarak belirler. Sonrasında o değişkene metin atamaya kalkarsan derleme durur.

## Sabit mi değişken mi: `const` ile `let` arasındaki çıkarım farkı

Tip çıkarımının en kritik zihinsel modellerinden biri, değişkenin nasıl tanımlandığına bağlı olarak tipin daralması veya genişlemesidir (literal widening):

- **`const` ile tanımlama:** Değişken sonradan başka bir değere yeniden atanamaz. Değer hiçbir zaman değişmeyeceği için TypeScript en dar ve kesin tipi çıkarır. Buna **literal tip** denir. Örneğin `const delivery = 'kargo'` dendiğinde tip `string` değil, tam olarak `'kargo'` literalidir.
- **`let` ile tanımlama:** Değişkenin değeri gelecekte değişebilir. `let delivery = 'kargo'` yazdığında TypeScript bu değişkenin ileride başka bir metin de alabileceğini varsayar ve tipi genişleterek genel `string` olarak belirler.

Bu farkı bir karşılaştırma tablosuyla adım adım inceleyelim:

| Tanımlama Biçimi | İlk Değer | Çıkarılan Tip | Gelecekteki Atama İzni |
| --- | --- | --- | --- |
| `const method = 'express'` | `'express'` | `'express'` (literal) | Hiçbir atama yapılamaz (`const` kuralı). |
| `let method = 'express'` | `'express'` | `string` (geniş tip) | `method = 'standard'` gibi her `string` geçerlidir. |
| `const threshold = 100` | `100` | `100` (literal) | Yeniden atanamaz. |
| `let threshold = 100` | `100` | `number` (geniş tip) | `threshold = 250` gibi her `number` geçerlidir. |
| `const active = true` | `true` | `true` (literal) | Yeniden atanamaz. |
| `let active = true` | `true` | `boolean` (geniş tip) | `active = false` geçerlidir. |

Bu mekanizma, sonraki derslerde göreceğimiz "yalnızca belirli seçenekleri kabul eden" union tiplerinin temelini oluşturur.

## Ne zaman açık tip yazmalısın?

Tüm değişkenlere açık tip yazmak gereksiz bir yüktür; ancak bazı durumlarda TypeScript sağ taraftan tipi tek başına çıkaramaz veya sözleşmeyi açıkça belirlemek gerekir. Açık tip yazmanın şart olduğu üç ana durum vardır:

### 1. Boş koleksiyonlar ve başlangıç değerleri
Boş bir dizi oluşturduğunda TypeScript dizinin içine ne koyacağını bilemez ve tipi `never[]` veya `any[]` olarak varsayar. Böyle yerlerde niyetini açıkça belirtmelisin:

```ts check
// Açık tip ZORUNLUDUR: Boş dizide çıkarım yapılamaz
const trackingNumbers: string[] = []
trackingNumbers.push('TR-90210')
```

### 2. Fonksiyon parametreleri
Bir fonksiyon yazarken parametrelerin hangi tipleri kabul edeceğini TypeScript tahmin edemez. Fonksiyon sınırları daima açık tiplerle mühürlenmelidir:

```ts check
function calculateShipping(weightKg: number, isExpress: boolean): number {
  const baseRate = 25
  const expressMultiplier = isExpress ? 1.5 : 1.0
  return weightKg * baseRate * expressMultiplier
}

const fee = calculateShipping(4.5, true)
void fee
```

### 3. Değişkenin türü başlangıçta henüz kesinleşmediğinde
Bir değer henüz gelmemişse ve başlangıçta `null` tutacaksa açık tip yazılır: `let currentOrderId: number | null = null`.

## Önce kırık, sonra doğru: Metin ve sayı dönüşümleri

Dış sistemlerden (özellikle URL query parametreleri veya HTML form girdileri) gelen sayısal değerler daima `string` olarak gelir. JavaScript'in otomatik tip dönüştürmesi en tehlikeli tuzaklardan biridir:

```ts
// Kırık senaryo:
function applyDiscount(price: number, rawInput: string) {
  // rawInput formdan gelen "15" olsun
  // JavaScript'te çıkarma işlemi metni sayıya çevirir: 100 - "15" -> 85
  // Ancak toplama işlemi metin birleştirir: 100 + "15" -> "10015"
  return price + rawInput // HATA: "10015" döner!
}
```

TypeScript burada derleme hatası verir: `Operator '+' cannot be applied to types 'number' and 'string'`. Doğru yaklaşım, sınır noktasında açık dönüşüm yapmaktır:

```ts check
function applyDiscount(price: number, rawDiscount: string): number {
  const discount = Number(rawDiscount)
  if (Number.isNaN(discount)) {
    return price
  }
  return price - discount
}

const finalPrice = applyDiscount(200, '40')
void finalPrice
```

## Sınır durumları ve sık yapılan hatalar

:::mistake[Sayısal string'i doğrudan number sanmak]
- **Belirti:** `deliveryDays.toFixed(0)` çağrısının tarayıcıda `deliveryDays.toFixed is not a function` hatasıyla patlaması.
- **Neden:** URL'den veya form alanından okunan değer `"3"` gibi bir metindir. Değer sayı gibi görünse de tipi `string`'dir; `string` üzerinde `toFixed` bulunmaz.
- **Düzeltme:** Tip sistemini kandırmaya çalışma (`as number` yazma); değeri `Number(val)` ile gerçekten sayıya dönüştür.
:::

:::mistake[Gereksiz açık tip yazarak kod gürültüsü üretmek]
- **Belirti:** Her satırda `const total: number = 0; const label: string = 'Kargo';` gibi tekrarlar bulunması.
- **Neden:** Tip çıkarımına güvenmemek. Kod uzar, okunabilirlik düşer ve refactor sırasında sağ taraf değiştiğinde sol tarafı da elle güncellemek zorunda kalırsın.
- **Düzeltme:** Sağdaki değer açık bir ilkel değerse tipi TypeScript'in çıkarımına bırak.
:::

:::mistake[0 değerini yokluk (nullish) zannetmek]
- **Belirti:** İndirim oranı `0` olduğunda sistemin "İndirim bilgisi girilmedi" hatası vermesi.
- **Neden:** `if (discountRate)` kontrolü `0` değerini de `false` sayar. Oysa `0` geçerli ve anlamlı bir sayıdır.
- **Düzeltme:** Kontrolü `discountRate === null` veya `typeof discountRate === 'undefined'` şeklinde açıkça yaz.
:::

:::sector[Sektörde nasıl uygulanır?]
Modern TypeScript projelerinde ESLint kuralları (özellikle `@typescript-eslint/no-inferrable-types`) basit ilkel değişkenlerde gereksiz açık tip yazılmasını yasaklar ve otomatik olarak temizler. 

Sektör standartlarında altın kural şudur: **"Fonksiyon sınırlarında açık tip yaz; fonksiyon gövdesinde tip çıkarımına güven."** Bu kural hem kodun kendi kendini belgelemesini sağlar hem de gereksiz tip kalabalığını önler.
:::

## Özet

- Üç ana ilkel tip `string`, `number` ve `boolean`'dır.
- TypeScript değerin ilk atanışına bakarak tipi otomatik olarak çıkarır (inference).
- `const` değişmeyen kesin literal tipi çıkarırken (`'express'`), `let` yeniden atamaya izin vermek için geniş tipi (`string`) çıkarır.
- Boş koleksiyonlarda ve fonksiyon parametrelerinde açık tip yazmak zorunludur; yerel ilkel değişkenlerde ise çıkarıma bırakılmalıdır.
- Metin olarak gelen sayısal girdiler açıkça `Number()` ile dönüştürülmelidir.

### Kendini yokla

**Soru 1:** `let status = 'active'` ve `const role = 'admin'` tanımlandığında TypeScript bu iki değişken için sırasıyla hangi tipleri çıkarır?  
*Cevap:* `status` değişkeni `let` ile tanımlandığı için ileride başka metinler de alabileceği varsayılarak geniş `string` tipinde çıkarılır. `role` değişkeni ise `const` ile tanımlandığı için asla değişmeyeceğinden dar `'admin'` literal tipinde çıkarılır.

**Soru 2:** `const items = []` şeklinde tanımlanan bir değişkene daha sonra metin eklemek istediğinde neden tip hatası alırsın?  
*Cevap:* Boş dizi başlangıçta hiçbir eleman taşımadığı için TypeScript onun içindeki tipi bilemez ve genellikle `never[]` çıkarır. `never` hiçbir değere izin vermediği için sonradan `items.push('kitap')` çağrılamaz. Çözüm, baştan `const items: string[] = []` yazmaktır.
