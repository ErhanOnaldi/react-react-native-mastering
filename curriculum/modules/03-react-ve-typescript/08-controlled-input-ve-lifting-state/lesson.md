---
title: "Controlled input ve state'i ortak ebeveyne taşı"
minutes: 18
kind: concept
---

# Controlled input ve state'i ortak ebeveyne taşı

:::pain[Input değişiyor, liste değişmiyor]
Tarif planlayıcıda malzeme adını input'a yazıyorsun ama öneri listesi aynı kalıyor. Input kendi DOM değerini, liste başka bir state kopyasını tutuyor. İki bileşen aynı seçimi kullanmadığı için her etkileşimde birini diğerine eşitlemen gerekiyor.
:::

## Tek değer, tek sahibi olsun

Bir değer birden fazla bileşene lazımsa state'i onları kapsayan en yakın ortak ebeveynde tut. Ebeveyn değeri aşağıya props olarak verir; çocuk kullanıcı etkileşimini callback ile yukarı bildirir. Böylece input ve liste aynı kaynağa bakar, senkronizasyon kodu yerine tek bir state değişikliği yaşanır.

Önce kırık bir düzeni görelim: `defaultValue` input'a yazıyı gösteriyor, ama başka state'te duran liste sorgudan habersiz.

```tsx
<>
<input aria-label="Malzeme" defaultValue={ingredient} />
  <ul>{visibleRecipes.map((recipe) => <li key={recipe.id}>{recipe.name}</li>)}</ul>
</>
```

Bu input'un DOM'daki değerini değiştirmek, React state'i veya `visibleRecipes` değerini değiştirmez. Dışarıdan DOM'u okuyup ayrı state'i güncellemek zorunda kalırsın.

Bir de sorgu ile görünen sonuçları ikisini de state'te tutarsan her değişimde ikisini birlikte güncellemelisin. Bu çift yazma, boş sorguda veya hızlı tekrar yazmada birinin unutulmasına kapı açar.

![Props aşağı iner, olay callback'i yukarı çıkar](diagram:veri-akisi "Ortak ebeveynin state sahipliği")

Veri akışını şu kesin kurallarla kur:

1. **State'in sahibi ihtiyacı belirler.** Bir state'i hangi bileşenler okuyup değiştirecek? Hepsini kapsayan en yakın ortak parent o state'in doğal sahibidir.
2. **Değer props olarak aşağı akar.** Kontrollü input'un `value` değeri parent state'inden gelir; input kendi DOM değerini bağımsız kaynak olarak kullanmaz.
3. **Olay yeni değeri yukarı bildirir.** Input'un `onChange` handler'ı string'i parent callback'ine yollar. Parent setter ile state'i günceller.
4. **Sonraki render aynı kaynağı dağıtır.** Yeni state hem input'a hem filtrelenmiş liste hesabına ulaşır. Çocuklar birbirlerini doğrudan güncellemez.
5. **Türetilen görünümü ikinci state yapma.** Görünür tarifler, sabit tarif verisi ve malzeme seçiminden hesaplanabiliyorsa her render'da `filter` ile üret.

Bir state'e gerçekten birden çok bağımsız kopya gerektiği durumlar olabilir; o zaman bunun nedeni ve güncelleme politikası açık olmalıdır. Bir sorgu metnini input state'i ve list state'i olarak iki kez saklamak çoğu zaman böyle bir neden değildir. Aynı veri iki yerdeyse birinin eskimesi için fırsat yaratmış olursun.

:::model[State snapshot ve updater kuyruğu]
Handler, oluşturulduğu render'ın state fotoğrafını görür; setter mevcut değişkeni anında değiştirmez, yeni render için güncelleme kuyruğa koyar. Bu bağlamda input callback'i parent'a yeni metni taşır; parent'ın sonraki render'ı hem input `value` prop'unu hem filtrelenmiş görünümü aynı snapshot'tan üretir.
:::

## Controlled ve uncontrolled input farkı

Controlled input, değerini React prop'undan alır. Parent `value="Ada"` verdiğinde ekranda Ada görünür. Kullanıcı harf yazınca event handler yeni değeri parent'a iletmelidir; parent state'ini günceller ve yeni değer tekrar prop olarak gelir. Handler güncellemezse React eski `value` değerini tekrar yazar ve input yazılan karakteri tutmaz.

Uncontrolled input ise mevcut değerini DOM içinde tutar; React'ten çoğu zaman yalnız `defaultValue` gibi başlangıç değeri alır. Basit formda bu yaklaşım işe yarayabilir. Fakat aynı metin başka bir bileşenin davranışını belirleyecekse, değer DOM içinde saklı kaldığında listeye paylaşılması için ayrıca okuma ve eşitleme gerekir. Controlled input bu paylaşım sınırını açık kılar.

`defaultValue` başlangıç içindir; prop sonraki render'da değişti diye input'un değerini değiştirmez. `value` ise her render'da görünür alanın kaynağıdır. Bir alan controlled başlayıp sonra `undefined` yapılırsa React kontrol biçiminin değiştiğine dair uyarı verebilir; string input için başlangıçta `''` gibi kararlı bir değer kullan. Parent server verisi gelene kadar bekliyorsa yükleme/boş durumunu input'un veri sözleşmesinden ayrı düşün.

## Seçim akışını izleyelim

Bir tarif planlayıcıda `ingredient` parent state'i olsun; giriş alanı ile öneri listesi iki çocuk olsun. Seçimi yazan çocuk listeyi doğrudan değiştirmez:

```tsx check
import { useState } from 'react'

type Recipe = { id: number; name: string; ingredient: string }
const recipes: Recipe[] = [
  { id: 1, name: 'Mercimek çorbası', ingredient: 'mercimek' },
  { id: 2, name: 'Domatesli makarna', ingredient: 'domates' },
  { id: 3, name: 'Domates salatası', ingredient: 'domates' },
]

function IngredientField({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return <label>Malzeme<input value={value} onChange={(event) => onChange(event.currentTarget.value)} /></label>
}

function RecipeNames({ items }: { items: Recipe[] }) {
  return <ul>{items.map((recipe) => <li key={recipe.id}>{recipe.name}</li>)}</ul>
}

function MealPlanner() {
  const [ingredient, setIngredient] = useState('')
  const visibleRecipes = recipes.filter((recipe) =>
    recipe.ingredient.includes(ingredient.toLocaleLowerCase('tr').trim()),
  )

  return (
    <section>
      <IngredientField value={ingredient} onChange={setIngredient} />
      <RecipeNames items={visibleRecipes} />
    </section>
  )
}

const planner = <MealPlanner />
void planner
```

Şimdi “d” yazıldığında ne olduğunu tabloya dökelim. İlk render `ingredient === ''`; boş metin her malzeme içinde bulunur, üç tarif listelenir. Kullanıcı “d” yazınca çocuk callback'i çağırır. Parent setter'ı eski `ingredient` değerini değiştirmez; React yeni render başlatır. Yeni render'da input `value="d"` olur ve iki domatesli tarif gösterilir.

| An | Parent state'i | Input / listede görünen | Liste hesabı |
| --- | --- | --- | --- |
| İlk render ve commit | `ingredient = ''` | Boş / üç tarif | Üç tarifin hepsi |
| Yazma handler'ı | Hâlâ `''` snapshot'ı | DOM event'inde `d`, liste eski | Henüz eski render |
| Callback ve kuyruk | `setIngredient('d')` | Commit'e dek eski liste | İkinci state yazılmaz |
| Sonraki render | `ingredient = 'd'` | DOM'da henüz eski liste | `recipes.filter(...)` iki tarif üretir |
| Commit | `ingredient = 'd'` | `d` / iki tarif | Hesaplanan sonuç DOM'a yansır |
| Varsa effect | Yeni değeri yakalar | `d` / iki tarif | Liste için effect gerekmez |

Liste sonucu state'te kopyalanmadığı için `ingredient` ile görünüm arasında güncelleme sırası problemi yoktur. Bu veri küçük ve hesaplaması ucuzsa `filter` render sırasında doğrudan çalışmalıdır. Performans problemi ölçülürse sonraki aşamada memoization düşünülebilir.

Bu owner modeli yalnız arama için değildir. Bir formdaki teslimat yöntemi ile ücret özeti aynı seçime bakıyorsa seçim state'i bu ikisini kapsayan parent'ta olur. Eğer bir alt bileşen kendi kendine state tutuyorsa, bunun yalnız yerel bir etkileşim olduğu net olmalı; başka kardeşin aynı değeri bilmesi gerekiyorsa state'i yukarı taşı. Yukarı taşımak sınırsızca root'a taşımak demek değildir: mümkün olan en yakın ortak ebeveyn, prop zincirini kısa tutar.

## Bileşen sınırını seç

Bir `IngredientField` alt bileşeni value ve callback'i props olarak alıyor. O, metni parent'tan alır, typed event'ten çıkarır ve yukarı iletir. `RecipeNames` ise aynı parent state'inden hesaplanan tarifleri gösterir. Her çocuk yalnız kendi sorumluluğunu taşır: input yazma arayüzü, liste gösterim, parent ortak state sahipliği.

Türkçe aramada `toLowerCase()` yerine `toLocaleLowerCase('tr')` kullanmak Türkçe `I/İ` harflerini doğru eşlemeye yardım eder. Bu örnekte malzeme filtresi yapıyoruz; aksan duyarsız arama, sıralama veya sunucu araması ayrı gereksinimlerdir.

### Ebeveynin sahibi olduğu değerin sınırları

State'i yukarı taşırken yalnız gerçekten paylaşılan değeri taşı. Bir tarif satırının açık/kapalı ayrıntı panelini yalnız o satır kullanıyorsa bu state satırda kalabilir. Malzeme metnini ise hem input hem sonuç listesi kullandığı için parent sahiplenir. Her yerel state'i uygulamanın en üstüne koyarsan küçük bir input değişimi gereksiz geniş bir ağaçta hesap başlatır ve prop zincirini uzatır. En yakın ortak ebeveyn, hem doğruluk hem anlaşılır bileşen sınırı sağlar.

Ebeveynin setter'ını doğrudan `onChange` olarak geçirmek kolaydır; fakat yeniden kullanılabilir bir child'ın API'si `onChange(next: string)` olsun. Böylece parent değerin nereden geldiğini bilmek zorunda kalmaz, child da parent'ın state yapısını bilmez. Yarın aynı değer bir `<select>` veya erişilebilir bir seçim grubu üzerinden girilirse parent'ın iş kuralı değişmez. Callback'in adı olay gibi görünse de taşıdığı şey DOM event'i değil yeni veridir.

Uncontrolled alan için `defaultValue` ile başlangıç değeri verilebilir ve gönderim anında `FormData` ya da ref ile okunabilir. Bu, yazdıkça başka panelin değişmesi gerekmeyen kısa formlarda makul bir seçimdir. React state'i ile DOM değeri arasında sürekli eşitleme gerektiren bir ürün davranışı varsa controlled tasarım daha açık olur. Bir input'a hem `value` hem `defaultValue` verip iki sahip yaratma; hangi kaynağın son sözü söylediği belirsizleşir.

| Kullanıcı işi | Değerin sahibi | Ekrandaki sonuç |
| --- | --- | --- |
| Malzeme alanına “do” yaz | Parent `ingredient` | İki domatesli tarif kalır |
| Alanı sil | Aynı parent state'i `''` olur | Üç tarif döner |
| Parent değeri düğmeyle temizlesin | Yine aynı parent | Controlled input da boş görünür |
| Yalnız `defaultValue` değişsin | DOM kendi değerini tutar | Yazılmış metin otomatik temizlenmez |

### Sonraki modüllerde veri sahibi

Form modülünde bir alanın değeri, hata mesajı ve gönderim özeti aynı girdiye bakacak; tek sahip seçimi bunların ayrışmasını önleyecek. Query cache sunucudan gelen kayıtların ortak kaynağı olduğunda aynı veriyi ikinci bir yerel state'e kopyalamama kuralı tekrar karşına çıkacak. Effect'i bir input ile listeyi eşitlemek için kullanma; effect dış sistem içindir. Performans bölümünde parent render'ının hangi çocukları etkilediğini ölçüp gerekiyorsa bileşen sınırını daraltacaksın; doğru veri akışını bozmadan iyileştireceksin.

## Sık hatalar

:::mistake[Controlled input'a callback vermemek]
Belirti → Yazdığın karakter görünmeden kayboluyor veya input eski değerde kalıyor.  
Neden → `value` prop'u kontrollü; event sonrası parent state'i değişmedi.  
Düzeltme → `onChange` içinde yeni string'i parent'a gönder ve owner state'ini güncelle.
:::

:::mistake[Aynı sorguyu iki state'te saklamak]
Belirti → Input “domates” gösterirken liste hâlâ önceki malzemeyi kullanıyor.  
Neden → Input ve liste farklı state sahiplerine veya senkronize kopyalara bakıyor.  
Düzeltme → Sorguyu en yakın ortak ebeveynde tek kez tut; değeri aşağı geçir.
:::

:::mistake[Filtrelenmiş sonucu state olarak saklamak]
Belirti → Query değişince sonuç listesi bir etkileşim geriden geliyor.  
Neden → Türetilmiş listeyi ayrı setter/effect ile senkronlamak gerekiyor.  
Düzeltme → Filtre sonucunu render sırasında kaynak veri ve `ingredient` değerinden hesapla.
:::

:::mistake[Input event'ini callback API'sine sızdırmak]
Belirti → Parent, `event.currentTarget.value` gibi DOM ayrıntılarını bilmek zorunda kalıyor.  
Neden → Bileşen sınırı kullanıcı değerini değil event nesnesini aktarıyor.  
Düzeltme → Child içinde tipli event'i oku ve `onChange(value: string)` çağır.
:::

:::sector
Uygulamalarda tek state sahibi belirlemek form alanları, filtreler ve görünür listelerin aynı değere dayanmasını sağlar. UI bileşeni tasarım sisteminde tekrar kullanılacaksa kontrollü API (`value`, `onChange`) parent'a daha fazla kontrol verir; yalnız yerel kısa formdaysa uncontrolled yaklaşım da uygun olabilir. Seçimi bileşenler arası veri paylaşımı ihtiyacına göre yap.
:::

## Özet

- Birden çok bileşenin kullandığı state'i en yakın ortak ebeveynde tut.
- Controlled input değerini props'tan alır ve yeni değeri callback ile owner'a bildirir.
- Setter çağrısı yeni snapshot oluşturur; event handler'ın elindeki değer anında değişmez.
- Filtrelenmiş liste gibi görünümü kaynak state'ten render sırasında türet.

**Kendini yokla:** Input ile liste aynı sorguyu kullanacaksa sorgunun sahibi kim olmalı?  
*Cevap:* İkisini kapsayan en yakın ortak üst bileşen.

**Kendini yokla:** `visibleRecipes` neden ikinci bir state değildir?  
*Cevap:* Her render'da mevcut `recipes` ve `ingredient` değerinden hesaplanan türetilmiş görünümdür.
