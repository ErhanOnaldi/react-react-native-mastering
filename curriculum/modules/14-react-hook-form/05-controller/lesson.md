---
title: "Özel girişleri forma bağla"
minutes: 14
kind: concept
---

# Özel girişleri forma bağla

Sinema'da bir film için tür seçiyorsun. Normal bir metin kutusunu `register` ile forma bağlayabiliyorsun; ama tasarım sistemindeki tür seçici sıradan `<input>` değil. Kendi `value` ve `onChange` prop'larını kullanıyor. Bu iki arayüzü `Controller` ile birbirine bağlayacağız.

## Önce seçicinin kendi sözleşmesine bakalım

React'te controlled component, ekranda gösterdiği değeri prop'tan alan ve değişikliği callback ile bildiren component'tir. Callback, bir olay olduğunda component'in çağırdığı fonksiyondur. Örneğin bu tür seçici “Dram” değerini gösterir ve kullanıcı başka türe basınca yeni değeri `onChange` ile gönderir:

```tsx
type GenrePickerProps = {
  value: string
  onChange: (nextGenre: string) => void
}

function GenrePicker({ value, onChange }: GenrePickerProps) {
  return <select value={value} onChange={(event) => onChange(event.target.value)}>
    <option value="Drama">Dram</option>
    <option value="Comedy">Komedi</option>
  </select>
}
```

`value` seçili türü dışarıdan alır; seçim değişince `onChange` yeni türü yukarı bildirir. Component kendi içinde aynı değerin ikinci bir kopyasını tutmaz. Böylece ekrandaki seçimle formda gönderilecek değer aynı kaynaktan gelir.

## RHF değerini özel seçiciye bağla

`register` native input'ların `ref`, `name`, `onChange` ve `onBlur` bağlantılarını sağlar. Özel component bu bağlantı biçimini kabul etmeyebilir. RHF'nin `Controller` bileşeni formdaki tek alanı kaydeder ve `render` fonksiyonuna o alanın prop'larını verir. `render` prop'u, prop olarak verilen ve component'in UI'sini oluşturan fonksiyondur.

```tsx
const { control, handleSubmit } = useForm<{ genre: string }>({
  defaultValues: { genre: 'Drama' },
})

return <form onSubmit={handleSubmit((values) => console.log(values))}>
  <Controller
    control={control}
    name="genre"
    render={({ field }) => (
      <GenrePicker value={field.value} onChange={field.onChange} />
    )}
  />
  <button type="submit">Kaydet</button>
</form>
```

İlk render'da `field.value` “Drama” olur ve seçici Dram'ı gösterir. Kullanıcı Komedi'yi seçince seçici `onChange('Comedy')` çağırır; `field.onChange` bu değeri forma yazar. Submit'te RHF `{ genre: 'Comedy' }` verir. `control` ile `name` aynı `useForm` örneğine ve form tipindeki alana işaret ettiği için bu bağlantı formun geri kalanıyla birlikte çalışır.

Buradaki iki yönlü bağlantıyı ayrı ayrı takip et: ilk yönde RHF'den seçiciye `value` gider; ikinci yönde seçiciden RHF'ye `onChange` ile yeni değer döner. İlk yön olmazsa seçici hangi türün seçili olduğunu bilemez. İkinci yön olmazsa görüntü değişmiş gibi olsa bile submit eski türü alır. Değerin yalnız bir yerde tutulması reset'i ve doğrulamayı da öngörülebilir yapar.

:::tip[render prop]
`render` prop'u, başka bir component'ten aldığı verilerle UI döndüren fonksiyondur. Burada `Controller` alan verisini fonksiyona verir, sen de o veriyle seçiciyi çizersin.
:::

## Seçici event gönderiyorsa araya çevirici koy

Her özel component `onChange`'e doğrudan seçilen metni vermez. Bazısı browser'ın `event` nesnesini verir; bu nesnenin `target.value` alanında metin bulunur. Özel component'in API'sini RHF'nin beklediği alana dönüştüren küçük parçaya adapter denir.

```tsx
<Controller
  control={control}
  name="genre"
  render={({ field }) => (
    <select
      value={field.value}
      onChange={(event) => field.onChange(event.target.value)}
      onBlur={field.onBlur}
      ref={field.ref}
    >
      <option value="Drama">Dram</option>
      <option value="Comedy">Komedi</option>
    </select>
  )}
/>
```

Burada browser event'i seçili metne çevrilip `field.onChange`'e verilir. `onBlur` alanın odaktan çıktığını RHF'ye bildirir; `ref` de RHF'nin gerektiğinde alana odaklanmasına yardım eder. Bu düz `<select>` için `register` daha kısa olurdu. Bu örnek, özel component event gönderdiğinde dönüşümün nerede yapılacağını gösteriyor.

:::mistake[Seçim değişiyor ama submit eski değeri alıyor]
**Belirti:** Ekranda Komedi seçili, callback'te hâlâ Dram var. → **Neden:** `field.value` seçiciye verilmiş ama değişim callback'i `field.onChange`'e bağlanmamış. → **Düzeltme:** Seçicinin gerçek `onChange` API'sini öğren ve yeni değeri RHF'ye geri yolla.
:::

## Kuralları ve alan hatasını aynı yerde göster

Controller alanı için `rules` verebilirsin. Örneğin tür seçimi boş olamasın diye required kuralı ekleyelim. `fieldState` bu Controller alanının kendi `error` bilgisini taşır; böylece doğru mesajı seçicinin yanında gösterebiliriz.

```tsx
<Controller
  control={control}
  name="genre"
  rules={{ required: 'Bir tür seç' }}
  render={({ field, fieldState }) => (
    <>
      <GenrePicker value={field.value} onChange={field.onChange} />
      {fieldState.error && <p role="alert">{fieldState.error.message}</p>}
    </>
  )}
/>
```

Form gönderildiğinde tür boşsa callback çağrılmaz ve alan hatası görünür. Bir tür seçince `field.onChange` değeri forma yazar; RHF doğrulamayı ayarına göre yeniden çalıştırır ve hata kalkar. Hata mesajı aynı alanın yakınında durduğu için kullanıcı neyi düzeltmesi gerektiğini görür.

`fieldState.error` bu Controller'ın bağladığı tek alanı anlatır. Formda puan, tür ve yorum gibi birkaç alan varsa her alan kendi hata bilgisini böyle alabilir; başka bir alanın hatasını yanlışlıkla bu seçicinin yanına koymazsın. Bu, formun tüm hatalarını dolaşıp `name` ile tekrar eşleştirmekten daha doğrudandır.

Sinema yorum ekranında aynı formda native bir metin alanı ve özel bir puan seçici bulunabilir. Native yorum alanını `register` ile tut; özel puan seçici `Controller` ile bağlanır. Alan kurallarını `rules` içinde belirt, mesajı ilgili `fieldState.error` üzerinden göster. `Controller` kullanmak, her input'u aynı kalıba sokmak demek değildir.

Controlled component'in başlangıç değeri de belirgin olmalı. Tür alanında başlangıç seçimi varsa `defaultValues` içinde o türü ver; seçim yoksa component'in API'sinin tanıdığı boş değeri (örneğin `''` veya `null`) seç. Başta `undefined`, sonra string verirsen component bir render'da değeri dışarıdan, diğerinde içeriden yönetmeye çalışabilir.

Özel component blur callback'i sunuyorsa `field.onBlur`'ı da bağla. Böylece RHF alanın odaktan çıktığını bilir ve `onBlur` gibi bir doğrulama ayarı kullanıldığında doğru zamanda çalışabilir. Component `ref` veya `inputRef` kabul ediyorsa `field.ref`'i o prop'a vermek, submit sonrası ilk geçersiz alana odaklanmayı mümkün kılar. Bu bağlantılar her UI kit'inde aynı isimde olmayabilir; component'in sözleşmesine bak.

:::mistake[Basit input gereksiz yere Controller ile sarılmış]
**Belirti:** Sıradan bir metin alanı için fazladan callback eşleme kodu var. → **Neden:** `Controller`, tüm RHF alanlarının zorunlu yolu sanılmış. → **Düzeltme:** Native input'ta `register`; kendi controlled API'si olan özel component'te `Controller` kullan.
:::

## Seçim arayüzünün sorumluluğu

`Controller` form ile component arasındaki değer bağlantısını yapar; component'in erişilebilir davranışını kendiliğinden sağlamaz. Düğmeyle çalışan özel bir seçim UI'si, seçili durumu ve klavye kullanımını da anlaşılır kılmalıdır. Mümkünse native `<select>` veya radio input kullan; tasarım sistemi özel bir seçim sunuyorsa onun bu davranışları nasıl sağladığını kontrol et.

:::info[Derinlemesine (isteğe bağlı)]
Üçüncü taraf UI kit'lerinde callback tipi değişebilir: biri `(value) => void`, diğeri `(event) => void` bekler. TypeScript bazen `onChange` için birden fazla imza, yani overload, sunar. Tip uyuşmazlığında imzayı körlemesine cast etmek yerine küçük bir wrapper yazıp gerçek değeri açıkça çıkar.

Bir tasarım sistemi için aynı eşlemeyi birçok kez yazıyorsan adapter component oluşturabilirsin. Bu component, UI kit'inin özel prop'larını RHF alanıyla eşler; her formda aynı dönüştürme kodunu tekrarlamazsın.
:::

## Özet

- `register` native input bağlantısı içindir; özel controlled component'i `Controller` ile bağla.
- `field.value` component'e gider, `field.onChange` yeni değeri forma geri yazar.
- Component event veriyorsa `target.value` gibi gerekli değeri adapter ile çıkar.
- Alan kurallarını `rules`, alan hatasını `fieldState.error` ile göster.

**Yeni terimler:** `controlled component` — değerini prop'tan alıp değişikliği callback ile bildiren component. `render prop` — aldığı veriden UI oluşturan ve prop olarak verilen fonksiyon. `adapter` — iki farklı API biçimini birbirine çeviren küçük katman. `fieldState` — Controller ile bağlanan tek alanın error/dirty/touched durumları.

**Kendini yokla:** Seçici yalnız `field.value` alıyorsa neden yetmez? Kullanıcı değişikliğinin forma geri dönmesi için `field.onChange` de bağlanmalı. Native input'u neden çoğu zaman Controller'a sarmayız? `register` onun için gereken bağlantıyı zaten kurar.
