---
title: "Class çakışmalarını bilinçli çöz"
minutes: 17
kind: concept
---

# Class çakışmalarını bilinçli çöz

:::pain[Padding kimin kararı?]
Bir ortak kart `p-2` ile geliyor. Sayfa içinde kullanan kişi `p-4` ekliyor ama kart hâlâ dar kalıyor. DOM'da iki class görünmesine rağmen CSS'in hangisini uygulayacağını HTML'deki yazım sırası tek başına belirlemiyor.
:::

## String birleştirmek yetmez

Koşullu görünüm oluştururken elle `'tab ' + (active ? 'on' : '')` yazmak boşluk ve boş string hatalarına açıktır. `clsx` koşullu değerleri class string'inde toplar. Fakat `clsx('p-2', 'p-4')` ikisini de korur; Tailwind class gruplarının anlamını çözmez.

Tailwind CSS kuralları build çıktısında kendi sırasına göre bulunur. Aynı HTML class listesinde `p-2 p-4` olması, tarayıcının mutlaka `p-4` seçtiği anlamına gelmez. Tüketiciye override sözleşmesi sunan bir component, birleştirme sırasında Tailwind çatışmasını çözmelidir.

:::model[Koşullu birleştirme ve çakışma çözümü]
1. `clsx` truthy class parçalarını tek string'e dönüştürür; class'ların CSS anlamını çözmez.
2. `tailwind-merge`, bilinen Tailwind utility gruplarını yorumlayıp çatışan aynı kararları ayıklar.
3. Aynı grupta son gelen utility kazanır; `cn` bu nedenle önce `clsx`, sonra `twMerge` çağırır.
4. Son girdiyi tüketiciden alırsan, component'in temel görünümü dışarıdan kontrollü biçimde override edilebilir.
:::

![clsx birleştirir, tailwind-merge padding çakışmasında son class'ı tutar](diagrams/class-cakismasi.svg)

Bu sırada birinci adımda koşullar netleşir, ikinci adımda yalnız Tailwind'in tanıdığı utility çakışmaları çözülür. Keyfi CSS seçicilerinin cascade sırasını, inline style'ı veya bütün eklenti class'larını `tailwind-merge` çözecek diye varsayma.

## Çağrıyı adım adım izleyelim

```ts check
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function mergeUtilityClasses(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

const isActive = true
const result = mergeUtilityClasses('rounded p-2', isActive && 'bg-emerald-700', 'p-4')
```

Çalışma sırasını tabloya dökelim:

| Adım | İşlem | Değer |
|---|---|---|
| 1 | `inputs` argümanları alınır | `['rounded p-2', true && 'bg-emerald-700', 'p-4']` |
| 2 | `clsx(inputs)` koşulları çözer | `rounded p-2 bg-emerald-700 p-4` |
| 3 | `twMerge(...)` utility gruplarını tarar | `p-2` ve `p-4` aynı grupta |
| 4 | Son padding seçilir | `rounded bg-emerald-700 p-4` |

`rounded` ve `bg-emerald-700` farklı CSS kararlarıdır; bu yüzden kalırlar. `p-2` ve `p-4` aynı padding alanının tam değerini seçtiği için çatışır ve son olan kalır.

Kısmi çakışma daha inceliklidir. `p-2` tüm yönleri, `px-4` yatay yönleri etkiler. Bu ikisi tümüyle birbirinin alternatifi değildir; yatay padding `px-4`, dikey padding `p-2` değerinden gelebilir. Manuel `split(' ')` ile önek karşılaştırmak bu yön ilişkilerini ve `hover:` gibi modifier gruplarını doğru modelleyemez.

## Önce kırık, sonra doğru örnek

Elle birleştirme koşulu anlamayı güçleştirir:

```ts
function tabClass(active: boolean): string {
  return 'rounded ' + (active ? 'bg-emerald-700 text-white' : '')
}
```

Bir sonraki dalda boşluk veya separator hatası oluşabilir. `clsx` ile koşulu veri olarak ver:

```ts check
import { clsx } from 'clsx'

function tabClass(active: boolean): string {
  return clsx('rounded', active && 'bg-emerald-700 text-white')
}

const inactive = tabClass(false)
```

Bu fonksiyon padding override çatışmasını hâlâ çözmez. `clsx`'in görevi yalnız doğru parçaları bir araya getirmektir. Component'in kendi class'ı ile tüketicinin class'ı aynı utility grubunda çakışacaksa `tailwind-merge` eklenir:

```ts check
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function mergeUtilityClasses(...values: ClassValue[]): string {
  return twMerge(clsx(values))
}

const cardClass = mergeUtilityClasses('rounded-xl p-2', 'p-6')
```

Bu örnek görev bileşenlerinin isimlerini kullanmaz; başka bir senaryoda aynı prensibi gösterir. UI primitive'inde `className` son girdi olur. Tüketici böylece padding'i değiştirebilirken köşe ve border gibi ilgisiz class'lar korunur.

## Modifier ve keyfi CSS sınırı

`hover:p-2` ile `p-4` farklı koşullarda çalışır; hover olmadığında biri, hover durumunda diğeri geçerlidir. Birleştirme aracı modifier gruplarını da hesaba katar, ancak projedeki Tailwind sürümü ve eklentiler önem taşır. Bilinmeyen custom class'ların hangi utility ile çatıştığını araç çıkaramayabilir.

Inline style (`style={{ padding: 8 }}`) ve utility class aynı cascade içinde yarışıyorsa `cn` inline style'ı class string'inden kaldıramaz. Tasarım sistemi `className` API'si veriyorsa aynı alanı hem inline style hem Tailwind class ile yönetme; tek sahip belirle.

`cn` tüm class'ların tek başına son doğruluk kaynağı değildir. Gerçek CSS'i, computed style'ı tarayıcı belirler. `twMerge` DOM class string'ini sadeleştirir; testte çıkan string, tarayıcıda görülen pikselin yerine geçmez.

:::mistake[Belirti → neden → düzeltme]
Koşullu false class'lar string'de görünüyor → doğrudan array'i `join` ederek birleştirdin → boolean ve null değerleri işleyen `clsx` kullan.
:::

:::mistake[Belirti → neden → düzeltme]
`p-2 p-4` birlikte kalıyor → yalnız `clsx` kullanılmış → birleştirilmiş string'i `tailwind-merge`'e ver.
:::

:::mistake[Belirti → neden → düzeltme]
Dış `className` temel görünümü değiştiremiyor → temel class son girdi → tüketicinin override'ını birleştirme çağrısının sonuna koy.
:::

:::sector
Design system ekipleri `className` override davranışını bileşenler arasında tutarlı yapar. `cn` yaygın bir sözleşmedir; yine de public bileşenin hangi stil kararlarının değiştirilebilir olduğunu dokümante etmek gerekir. Keyfi kullanıcı CSS'ine izin verilecekse her kombinasyonun tasarım kalitesini sağlayamazsın.
:::

## Girdilerin türü ve sınırları

`ClassValue` tipi `clsx`'in desteklediği string, boolean, nullish değer, dizi ve koşul nesnelerini temsil eder. Bu nedenle `cn` parametresini `string[]` yapmak esnekliği azaltır ve geçerli koşullu kullanımları tip hatasına dönüştürür. `...inputs` rest parametresi çağırana class parçalarını ayrı argümanlar olarak vermeyi sağlar; `clsx(inputs)` bu parçaları tek seferde değerlendirir.

`clsx` iç içe dizileri de açabildiğinden class seçimini gruplamak mümkündür. Örneğin temel class listesi, seçili state class'ları ve tüketicinin ek class'ı ayrı değişkenlerde tutulabilir. Ancak çok fazla ara değişken tanımlamak tek satırlık bir birleştirme işini takip etmeyi zorlaştırır. Gruplama, gerçek bir anlam veya koşul sınırı varsa yararlıdır.

`tailwind-merge` sürümü Tailwind'in utility isimlerini ve grup kurallarını bilir. Özel eklentiyle tanımladığın yeni utility'ler veya projeye özgü class isimleri çakışma tablosunda olmayabilir. Bu durumda config ile genişletmek mümkün olsa da UI kit'te çoğu override'ı standart utility'lerle ifade etmek daha taşınabilir olur. Çakışma aracı bilinmeyen class'ı silip doğru karar verdiğini garanti etmez.

Responsive ve state modifier'ları aynı gruba eklenince karar koşula göre değişebilir. `md:p-4` ile `p-2` aynı viewport'ta etkin değildir; küçük görünümde base kural, `md` eşikten sonra responsive kural devrededir. Merge aracı aynı modifier kapsamındaki conflict'leri değerlendirir; class listesinde `p-4` metinsel olarak sonda diye `md:p-4` tüm boyutlarda kazanmaz. Her iki sınıfın koşulunu ve hangi CSS property'yi etkilediğini düşün.

Özel class adları da utility ile eşdeğer olmayabilir. `card-padding` adlı bir custom class'ın `p-4` ile çatıştığını `tailwind-merge` kendiliğinden bilemeyebilir. Aynı property'yi hem custom class hem utility ile yönetmek cascade'e bağımlılık getirir. Tasarım sisteminde override için tanınan Tailwind utility'lerini kullanmak, tüketiciye daha güvenilir API verir.

Class birleştirme sonucunu bir component abstraction'ı üzerinde düşün: temel padding `p-3`, kullanım yeri `p-6` veriyor. `cn(base, className)` tüketici override'ını sağlar. Ancak component padding'i kritik bir düzen kuralıysa çağıranın bunu değiştirmesini istemeyebilirsin; `className` kabul etme kararı da public API tasarımıdır. Her component'in mutlaka her class'ı override edilebilir olması gerekmez.

Kod incelemesinde `cn` fonksiyonunun adı değil, hangi girişleri aldığı ve neyi garanti ettiği önemlidir. Yardımcı class string'ini deterministik biçimde sadeleştirmeli, HTML props'larını veya inline style'ı yönetmeye kalkmamalıdır. Bu sınır küçük kalırsa test ve yeniden kullanım kolaylaşır.

Yardımcı fonksiyonun saf olması test ve kullanımını kolaylaştırır. `cn` DOM'a dokunmaz, state saklamaz ve çağrıldığı component'ten bağımsızdır. `cn('p-2', 'p-4')` sonucu her çağrıda aynı olduğu için sınıf birleştirme davranışını küçük birim örnekleriyle değerlendirebilirsin. Görsel sonucun doğru olup olmadığını ise render edilen element ve tarayıcı stiliyle ayrıca kontrol et.

## Özet

- `clsx` koşullu parçaları birleştirir.
- `tailwind-merge` bilinen Tailwind utility çatışmalarını temizler.
- `cn` önce `clsx`, sonra `twMerge` çağırır.
- Son girdide tüketici class'ı varsa override davranışı öngörülebilir olur.
- Class birleştirme computed CSS veya keyfi cascade çözümü değildir.

**Kendini yokla:** `clsx` tek başına `p-2` ile `p-4`'ten birini siler mi? Hayır, ikisini de string'e koyar.

**Kendini yokla:** `p-2` ve `px-4` tamamen aynı grupta mıdır? Hayır; yatay ve dikey alanları farklı kapsamda etkiler.
