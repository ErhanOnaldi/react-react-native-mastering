---
title: "Sayısı değişen form satırları"
minutes: 14
kind: concept
---

# Sayısı değişen form satırları

:::pain[Satır silince başka değer kayboluyor]
Etkinlik planına üç konuşmacı ekledin. Ortadaki satırı silince son konuşmacının adı ilk satırda beliriyor; input odağı da başka bir satıra taşınıyor. Dizi indeksini React `key` olarak kullandığında satır kimliği ile konumu birbirine karışıyor.
:::

## Konum ile alan kimliği farklıdır

Sabit sayıda alanı tek tek kaydedebilirsin; fakat kullanıcı satır ekleyip sildiğinde alan adları dizin yoluna göre değişir. `useFieldArray`, RHF form deposundaki alan dizisini append/remove gibi işlemlerle yönetir. Her satıra verdiği `field.id`, React'in satır kimliğidir. Form yolunda indeks kullanılır; render key'inde sabit id kullanılır.

:::model[Form deposu ve abonelik]
Dizi satırlarının değerleri de form deposundadır; `useFieldArray` yalnız kayıtlı satır yapısını yönetir. Yeni bağlamda değişen, tek alan yerine üyeliği değişen bir koleksiyonun render edilmesidir; React key'i bu satırların kimliğini korur.
:::

Kurallar:

1. `useFieldArray({ control, name })` içindeki `name`, form tipindeki dizi alanı olmalı.
2. RHF 7 alan dizisi öğelerini nesne olarak bekler; `{ speaker: '' }` gibi satır şekli belirle.
3. `fields` render için satır kimliği ve alan yapısını verir. Input değerlerinin güncel kaynağı yine form deposudur.
4. `append` yeni satır ekler; gerekli alt alanları başlangıç değeriyle birlikte ver.
5. `remove(index)` ilgili satırı çıkarır. Alan yollarındaki indeksler sonraki render'da kaydırılır.
6. `fields.map` içinde `key={field.id}` kullan. Dizi indeksini `register` alan yolunda kullanman doğrudur; `key` olarak kullanman değildir.
7. Ekle/sil düğmelerini `type="button"` yap; aksi halde formun içindeki varsayılan button submit edebilir.

## Silme sonrası kimlikleri izleyelim

Bir program başvurusunda alanlar `sessions: { label: string }[]` olsun:

| Önce | RHF alan yolu | React key | Sonra ikinci satır silinince |
|---|---|---|---|
| Sabah | `sessions.0.label` | `f_a9` | `sessions.0.label`, `f_a9` |
| Öğle | `sessions.1.label` | `f_b4` | Silindi |
| Akşam | `sessions.2.label` | `f_c2` | `sessions.1.label`, `f_c2` |

Akşam satırının form yolu `sessions.2.label`'dan `sessions.1.label`'a döner, ama satır kimliği `f_c2` kalır. React böylece DOM/input state'ini aynı konuşmacıya bağlar. `key={index}` olsaydı üçüncü satır ikinci sıraya geldiğinde React mevcut ikinci satır düğümünü yeniden kullanabilirdi; focus, uncontrolled input değeri veya alt bileşen state'i yanlış kayda eşleşirdi.

## Önce kırık satır, sonra kararlı satır

İndeks `key` olarak kullanıldığında satır silme davranışı kimliği değil sırayı takip eder:

```tsx
{fields.map((field, index) => (
  <SessionRow key={index} field={field} index={index} />
))}
```

Dizinin konumu alan adına devam eder; React kimliği için `field.id` kullan:

```tsx check
import { useFieldArray, useForm } from 'react-hook-form'

type SessionValues = { sessions: { label: string }[] }

export function SessionForm() {
  const { control, register, handleSubmit } = useForm<SessionValues>({
    defaultValues: { sessions: [{ label: '' }] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'sessions' })
  return <form onSubmit={handleSubmit((values) => console.log(values))}>
    {fields.map((field, index) => (
      <div key={field.id}>
        <label htmlFor={`session-${field.id}`}>Oturum {index + 1}</label>
        <input id={`session-${field.id}`} {...register(`sessions.${index}.label`)} />
        <button type="button" onClick={() => remove(index)}>Bu oturumu sil</button>
      </div>
    ))}
    <button type="button" onClick={() => append({ label: '' })}>Oturum ekle</button>
    <button type="submit">Kaydet</button>
  </form>
}
```

Başlangıçta bir boş satır kurulduğu için alan ekleme davranışı nettir. `fields` ile sırayı çizersin, `register` ile güncel değeri RHF'ye bağlarsın. Eğer yeni satır eklerken tüm alan değerleri verilmezse kontrollü alt bileşenlerde undefined kaynaklı sorunlar çıkabilir.

## Dizi içindeki değerleri doğru oku

`fields` yapısı esas olarak satırları ve kararlı kimlikleri render etmek içindir; kullanıcı input'a yazdıkça her değerin anlık güncel halini bu nesnelerden okuyacağını varsayma. Canlı bir özet gerekiyorsa belirli yolu `useWatch` ile izle veya submit anında callback'e gelen nesneyi kullan. `useWatch` aboneliğini olabildiğince küçük bileşene koyarsan formun geri kalanı gereksiz render almaz.

`remove` sonrası indeksleri elinde saklayıp sonraki olayda kullanma; indeks o anki sıra bilgisidir. Kimliği uzun süre saklaman gerekiyorsa verinin kendi id'sini kullan. RHF'nin `field.id` değerini iş modeli kimliği veya API verisi gibi göndermek de doğru değildir; bu React render key'i içindir.

:::mistake[Silme sonrası yanlış satırın yazısı görünüyor]
**Belirti:** Bir satırı silince komşunun metni yer değiştiriyor. → **Neden:** İndeks `key` olarak kullanılmış ve React DOM düğümünü yeni sıradaki başka kayda vermiş. → **Düzeltme:** `key={field.id}` kullan; indeks yalnızca `register` yolunda kalsın.
:::

:::mistake[Yeni satır gönderimde eksik nesne]
**Belirti:** Submit nesnesinde yeni satırın alanı yok veya undefined. → **Neden:** `append` alt alan başlangıç değerini vermemiş. → **Düzeltme:** Her eklemede tam nesne şekli gönder, örneğin `{ label: '' }`.
:::

:::mistake[Ekle düğmesine basınca form da gidiyor]
**Belirti:** Yeni input açılırken submit callback'i çalışıyor. → **Neden:** Form içindeki button varsayılan olarak submit türünde. → **Düzeltme:** Ekleme ve silme düğmelerine açıkça `type="button"` yaz.
:::

:::sector
Dinamik adres, telefon, ürün veya katılımcı satırlarında indeks adresleme için kullanışlıdır; kimlik değildir. UI listelerinde kararlı key kuralını tüm ekipte aynı tutmak, satır içindeki focus, expanded state ve doğrulama mesajlarının başka kayda sıçramasını önler.
:::

## Dizi alanı değişince ne izlenir?

`fields` dizisi append, remove veya move gibi yapısal işlemlerle değişir. Tek bir input'un değeri değişince bu yapısal satır tanımının değiştiğini varsayma; bu nedenle alan değerini göstermek için `fields` nesnesine güvenme. Submit callback'i her zaman güncel form değerlerini alır. Formda “seçilen oturum sayısı” gibi canlı bir özet gerekiyorsa `useWatch({ control, name: 'sessions' })` ile yalnız o diziyi izle.

Dizinin içinde alanı koşullu gizliyorsan değer davranışını da kararlaştır. Alan DOM'dan unmount olduğunda değer varsayılan olarak korunabilir veya `shouldUnregister` ile çıkarılabilir. Bir satırı silmek ise explicit `remove` çağrısıdır; yalnız CSS ile gizlemek aynı sonucu vermez. Kullanıcı arayüzünde kaldırılmış bir satırın submit payload'ında kalması istenmiyorsa satırı field array işleminden gerçekten çıkar.

Satır üzerinde başka React state'i varsa (örneğin genişletilmiş yardım bölümü), `field.id` o state'in aynı mantıksal satırda kalmasına yardım eder. Backend'den gelen `id` ile RHF `field.id` farklı amaçlara sahip olabilir; aynı objede alan adı çakışıyorsa `keyName` ayarıyla özel bir key alanı seçmek yerine güncel RHF API'sini kontrol et ve domain id'sini ayrı tut. Form render id'sini kalıcı veriye yazma.

Dinamik formda erişilebilir adları da tekrar üret. Her satır için “Oturum 1”, “Oturum 2” gibi güncel sıra gösterilebilir; `id` değerleri ise satır silinince kararlı kalabilir. Silme sonrası görsel sıra ile DOM label ilişkisinin eşleştiğini ve klavye odağının anlamlı bir alana gittiğini doğrula. Satır kaldırma düğmesine basıldıktan sonra focus kaybolursa kalan satıra veya ekleme düğmesine odak taşı.

Nested field yolunun string olması, TypeScript'in her runtime veriyi doğruladığı anlamına gelmez. Form değer tipi `sessions` alanını dizi olarak sınırlar ve doğru path yazmana yardımcı olur; ama localStorage'a daha önce kaydedilmiş hatalı bir satır varsa RHF bunu otomatik düzeltmez. Dış kaynaktan gelen taslağı forma başlangıç değeri yapmadan önce şema ile doğrula veya güvenli bir varsayılan üret.

Satır ekleme veya silme sonrası doğrulamanın ne zaman çalışacağını da seç. `mode: 'onBlur'` seçtiysen yeni boş satır eklenirken hata görünmeyebilir; submit'te required kuralı yine devreye girer. Bir alanı kaldırmak o alandaki hatayı da kaldırmalı. Kullanıcının hâlâ düzenlediği satırda hata göstermek yerine her satır için anlaşılır sıra ve hata mesajını birlikte sun.

## Özet ve kendini yokla

- `useFieldArray` ekleme/silmeyi form deposuyla senkron yürütür.
- Alan yolu indeks kullanır; React key'i `field.id` kullanır.
- `fields` render yapısı içindir; anlık değer izlemesi gerektiğinde `useWatch` gerekir.
- Düğme türü ve satırın tam başlangıç nesnesi açık olmalıdır.

**Kendini yokla:** İkinci satırı silince üçüncü satırın adı değişir mi? Hayır; yalnız indeksli adresi değişir, id aynı kalır. `field.id` API'ye gönderilmeli mi? Hayır, bu render kimliğidir.
