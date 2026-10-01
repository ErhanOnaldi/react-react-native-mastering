---
title: "Sayısı değişen form satırları"
minutes: 14
kind: concept
---

# Sayısı değişen form satırları

Bir film programında birden çok gösterim saati tutmak istiyorsun. Başta tek saat yeterli olabilir; sonra kullanıcı satır ekleyip silebilir. Her satırda bir saat alanı var ve Kaydet'e basınca kalan saatlerin doğru sırada gitmesini bekliyorsun.

## Önce listeyi sıradan bir dizi olarak çiz

JavaScript dizisini `map` ile ekrana basmayı biliyorsun. Liste değişebiliyorsa React'in her satırı tanıması için `key` gerekir. Bu ilk örnekte indeks `key` olarak kullanılıyor:

```tsx
{times.map((time, index) => (
  <input key={index} value={time} readOnly aria-label={`Gösterim ${index + 1}`} />
))}
```

Bu liste hiç değişmiyorsa her satırın sırası sabit kalır. Ama ortadaki gösterimi silince sonraki satırın indeksi değişir. React indeks `key`'ini kimlik sanarsa önceki satırın DOM durumunu yeni sıradaki başka gösterime taşıyabilir.

## Alan yoluyla satır kimliğini ayır

RHF `useFieldArray`, formdaki bir dizi alanını ekleme ve silme işlemleriyle yönetir. Form alanının adı yine sırayı gösteren indeksle yazılır; React'in `key` değeri ise satırın sabit kimliğini kullanır. Bu iki değerin görevleri farklıdır.

```tsx
const { control, register } = useForm<{ screenings: { time: string }[] }>({
  defaultValues: { screenings: [{ time: '' }, { time: '' }] },
})
const { fields } = useFieldArray({ control, name: 'screenings' })

return fields.map((field, index) => (
  <input
    key={field.id}
    aria-label={`Gösterim ${index + 1}`}
    {...register(`screenings.${index}.time`)}
  />
))
```

`screenings.0.time` ve `screenings.1.time` form içindeki adreslerdir. `field.id` React'in her satırı tanıması içindir. Form satırı silinip indeksler kaydığında form adresi değişebilir ama kalan satırın `field.id` değeri aynı kalır.

Şimdi ilk satıra “18:00”, ikinciye “21:00” yazıp ilk satırı silelim:

| An | Ekrandaki satır | Form adresi | React `key` |
|---|---|---|---|
| İlk durum | 18:00 | `screenings.0.time` | `id-a` |
| İlk durum | 21:00 | `screenings.1.time` | `id-b` |
| İlk satır silindi | 21:00 | `screenings.0.time` | `id-b` |

Kalan gösterim 0 adresine taşındı, ancak `id-b` kimliğini korudu. Böylece React onu aynı satır olarak izler. `key={index}` olsaydı React ikinci satırdan gelen DOM'u sıra 0'daki yeni satıra verebilirdi; input metni, focus veya çocuk component'in yerel durumu yanlış satırda görünebilirdi.

Burada iki ayrı sistem sırayla iş yapıyor. RHF silme işleminden sonra değerleri kalan satırların yeni indeksli adreslerine yerleştirir. React de `key` değerlerine bakıp hangi DOM satırını tutacağını anlar. `key={field.id}` satırın görünüm durumunu doğru gösterime bağlarken `register` adresi submit nesnesinde doğru sırayı üretir. Birini ötekinin yerine kullanırsan ya alan adresi ya da satırın React kimliği yanlış olur.

## Ekleme ve silmeyi form dizisine uygula

`useFieldArray` sana satır listesiyle birlikte `append` ve `remove` işlevlerini verir. `append`, yeni satır ekler; `remove(index)` o andaki sıradaki satırı çıkarır. Her yeni satıra alanların tamamını içeren bir nesne ver.

```tsx check
import { useFieldArray, useForm } from 'react-hook-form'

type ScreeningValues = { screenings: { time: string }[] }

export function ScreeningTimes() {
  const { control, register, handleSubmit } = useForm<ScreeningValues>({
    defaultValues: { screenings: [{ time: '' }] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'screenings' })

  return <form onSubmit={handleSubmit((values) => console.log(values))}>
    {fields.map((field, index) => (
      <div key={field.id}>
        <label htmlFor={`screening-${field.id}`}>Gösterim {index + 1}</label>
        <input id={`screening-${field.id}`} {...register(`screenings.${index}.time`)} />
        <button type="button" onClick={() => remove(index)}>Saati sil</button>
      </div>
    ))}
    <button type="button" onClick={() => append({ time: '' })}>Saat ekle</button>
    <button type="submit">Kaydet</button>
  </form>
}
```

Form ilk açıldığında bir boş saat görünür. “Saat ekle” yeni `{ time: '' }` nesnesi ekler; “Saati sil” o satırı kaldırır. Submit callback'i, silinen satır olmadan ve kalan değerler sıralarını koruyarak form değerlerini alır. Ekleme ve silme düğmelerinde `type="button"` var; form içindeki tür belirtilmemiş button varsayılan olarak submit olur ve yanlışlıkla formu gönderebilir.

`append`'e yalnızca boş bir nesne vermek tesadüfi bir tercih değil. Her satırın şekli `{ time: string }`; yeni satırın `time` alanı da baştan vardır. Yarın satıra salon alanı eklersen satır şekli `{ time: string; room: string }` olur ve `append` yeni nesnenin ikisini de sağlamalıdır. Böylece ekrandaki her satır aynı veri yapısını taşır, submit'te eksik property sürprizi çıkmaz.

:::mistake[Satır silince komşu saatin yazısı yer değiştiriyor]
**Belirti:** Bir saati sildikten sonra kalan input'ta başka satırın eski yazısı görünüyor. → **Neden:** `key={index}` sıra değişince React'e kararlı satır kimliği vermiyor. → **Düzeltme:** `fields.map` içinde `key={field.id}` kullan; indeksi yalnızca alan yolunda kullan.
:::

## `fields` neyi gösterir?

`fields`, satırları çizmek ve React key'lerini almak için kullanılır. Kullanıcı bir input'a yazdıkça buradaki nesnelerin anında güncellendiğini varsayma; alan değerlerinin güncel kaynağı RHF formudur. Gönderim anında `handleSubmit` callback'ine en güncel değerler gelir.

Örneğin ekranda “Toplam 2 gösterim” yazısı göstermek istiyorsan satır sayısı için `fields.length` uygundur. Ama “İlk gösterim saati: 18:00” gibi kullanıcı yazarken değişen bir özet istiyorsan güncel değeri ayrıca izlemelisin. Satır yapısı ile düzenlenen alan değerlerinin aynı şey olmadığını bu ayrım netleştirir.

Form yolundaki indeks yalnızca mevcut konumu belirtir; uzun süreli kimlik değildir. Silme veya sıralama sonrası başka değer alabilir. Bir gösterimi API'deki kaydıyla eşleştirmen gerekiyorsa kendi domain `id` alanını kullan. RHF'nin `field.id` değeri render içindir, sunucuya gönderilecek film veya gösterim kimliği değildir.

Mesela sunucudan gelen gösterim `id: 'screening-42'` taşıyabilir. Bu id kaydı güncellemek için kullanılır; RHF'nin `field.id` değeri ise React render'ında satırın yerini takip eder. İsimleri veya anlamları karıştırmamak, sunucuya yalnızca uygulamanın beklediği veriyi göndermeni sağlar. `field.id`'yi payload'a eklemek özel bir iş kuralı yoksa gereksiz bir UI ayrıntısını kalıcı veriye taşır.

:::mistake[Ekle düğmesine basınca form gönderiliyor]
**Belirti:** Yeni saat satırı açılırken submit callback'i de çalışıyor. → **Neden:** Form içindeki Ekle düğmesi varsayılan submit türünde. → **Düzeltme:** Ekleme ve silme düğmelerine `type="button"`, gerçek Kaydet düğmesine `type="submit"` yaz.
:::

:::info[Derinlemesine (isteğe bağlı)]
Satır içindeki değerleri kullanıcı yazarken başka bir yerde göstermek için `useWatch` ile belirli bir alanı izleyebilirsin. İzlemeyi küçük bir alt component'e koymak, bütün formun bu değişiklikte yeniden çizilmesini önleyebilir.

Bir alanı yalnızca görünmez yapmakla diziden çıkarmak aynı şey değildir. Submit değerinde de kalkması gereken satır için `remove` kullan. Bir alan component'i unmount olunca değerin korunup korunmayacağı ise form ayarına bağlıdır; `shouldUnregister` bu ileri davranışı kontrol eder.

`keyName` eskiden RHF'nin ürettiği kimlik alanının adını değiştirmek için kullanılıyordu. Güncel RHF 7 kullanımında varsayılan `field.id` alanını render key'i olarak tut; kendi film kimliğini ayrı bir property'de taşı.
:::

## Özet

- `useFieldArray`, formdaki dizi alanına satır ekleyip siler.
- Alan adresinde indeks kullanılır; React key'i için kararlı `field.id` gerekir.
- `append`'e satırın tam başlangıç nesnesini ver; silmede `remove(index)` kullan.
- `fields` satırları ve key'leri çizer; submit callback'i güncel değerleri alır.
- Ekleme ve silme düğmeleri `type="button"` olmalıdır.

**Yeni terimler:** `useFieldArray` — RHF'nin form içindeki değişken uzunluktaki nesne dizisini yönettiği hook. `field.id` — React'in satırı aynı satır olarak takip etmesi için RHF'nin verdiği kimlik. `domain id` — uygulama veya API'deki gerçek kaydı tanımlayan kimlik; RHF render id'sinden ayrıdır.

**Kendini yokla:** İkinci gösterimi silince üçüncünün form adresi değişebilir mi? Evet, yeni sıra adresi alır; `field.id` aynı kalır. `field.id` neden API payload'ına eklenmemeli? Yalnızca React'in satırı izlemesi için vardır.
