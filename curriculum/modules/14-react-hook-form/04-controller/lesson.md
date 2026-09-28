---
title: "Özel girişleri forma bağla"
minutes: 14
kind: concept
---

# Özel girişleri forma bağla

:::pain[Seçim formda görünmüyor]
Atölye rezervasyonunda renkli bir seviye seçici var. Kullanıcı “İleri” seçiyor; buton seçili görünmesine rağmen gönderilen nesnede seviye hâlâ boş. Tasarım bileşeni native input gibi bir `ref` ve event vermiyor.
:::

## İki farklı alan arayüzü

`register`, browser'ın native input API'siyle uyumlu alanlara uygundur. Özel tasarım bileşeni ise çoğunlukla `value`, `onChange` ve bazen `onBlur` prop'ları alır. RHF'deki `Controller`, form deposundaki alan değerini bu controlled API'ye bağlar. İki tarafta da tek bir değer kaynağı kalır.

:::model[Form deposu ve abonelik]
Alan değerleri RHF form deposunda kalır; özel bileşen yalnız o alanın güncel değerini alıp değişikliği geri bildirir. Yeni bağlamda fark, native input'un `register` bağlantısının yerini `field.value` ve `field.onChange` köprüsünün almasıdır.
:::

Karar kuralları:

1. DOM input `register`'ın ref/event bağlantısını kabul ediyorsa doğrudan kaydet.
2. Tasarım bileşeni kendi `value`/`onChange` sözleşmesine sahipse `Controller` ile bağla.
3. `Controller`'ın `name` değeri form tipindeki alana karşılık gelsin; `control` aynı `useForm` örneğinden gelsin.
4. `field.value` bileşene, `field.onChange` de bileşenin değişim callback'ine bağlansın. Bileşen blur callback'i destekliyorsa `field.onBlur` aktar.
5. Controlled bileşende `undefined` başlangıç kullanma. `defaultValues` ile alan tipine uygun değer ver; örneğin seçim yoksa `null` veya `0` gibi tasarımın tanımladığı değer.
6. Controller'ın `rules` alan kurallarını ve `fieldState.error` o alanın hatasını verir. Native alanla aynı doğrulama akışı korunur.

## Bir seçim olayını baştan sona izle

Bir atölye kayıt formunda `level` alanı `'basic' | 'advanced'` olsun. Özel `LevelPicker` bileşeni butonlar çizer, seçileni `value` prop'uyla alır ve tıklanan string'i `onChange` ile yollar:

| Adım | UI'de olan | Form deposunda olan |
|---|---|---|
| İlk render | “Başlangıç” seçili görünür | `level = 'basic'` |
| Kullanıcı ileri seçer | Picker `onChange('advanced')` çağırır | `field.onChange` yeni değeri yazar |
| Render | Picker yeni `value` alır | `level = 'advanced'` |
| Submit | `handleSubmit` alanları toplar | callback'te `level: 'advanced'` |

`field.onChange` aktarılmazsa yalnız görsel state değişebilir; RHF değeri değişmez. Picker kendi içinde ayrıca state tutuyorsa UI ile submit arasında ikinci kaynak da oluşabilir. Seçili buton durumunu prop'tan türet; formun state'ini klonlama.

## Önce kırık, sonra köprü

Bu sürümde picker formdan kopuktur. Butonun görünümü kendi state'iyle değişse de form değeri boş kalır:

```tsx
function DetachedLevel() {
  const [selected, setSelected] = useState('basic')
  return <LevelPicker value={selected} onChange={setSelected} />
}
```

RHF controlled field'i ile bağla:

```tsx check
import type { ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'

type Enrollment = { level: 'basic' | 'advanced' }
type LevelPickerProps = {
  value: Enrollment['level']
  onChange: (value: Enrollment['level']) => void
}
declare function LevelPicker(props: LevelPickerProps): ReactElement

export function EnrollmentForm() {
  const { control, handleSubmit } = useForm<Enrollment>({
    defaultValues: { level: 'basic' },
  })
  return <form onSubmit={handleSubmit((values) => console.log(values))}>
    <Controller
      control={control}
      name="level"
      render={({ field }) => <LevelPicker value={field.value} onChange={field.onChange} />}
    />
    <button type="submit">Kaydol</button>
  </form>
}
```

Örnekte `LevelPicker` yerel UI kit'i varsayılmıştır; gerçek formda onu import edersin. `Controller` alanı kaydeder, `render` controlled prop'ları besler. Native metin alanını aynı formda `register` ile tutmak normaldir; her alanı Controller'a taşımak ek katman ve daha çok kod getirir.

## Bileşen sözleşmesini iyi tasarla

Özel girişlerin kullanımı kolay olsun diye erişilebilir davranış da prop sözleşmesinde yer almalıdır. Seçim butonları `aria-pressed` veya radio semantiğiyle değeri anlatmalı. Bileşen blur olayını iletemiyorsa `touched` temelli doğrulama beklediğin gibi çalışmayabilir; blur'ı da API'ye eklemek ya da uygun `onBlur` callback'i tasarlamak gerekir.

Puan, tarih seçici, autocomplete ve zengin metin editörü gibi alanlar controlled olabilir; fakat her üçüncü taraf input aynı `onChange(value)` biçimini kullanmaz. Bazıları event verir, bazıları `onValueChange`, bazıları `selected` adını kullanır. Controller katmanında bu özel API ile RHF field API'sini eşleştir; dış bileşenin isimlerini formun her yerine sızdırma.

:::mistake[UI seçimi değişiyor, submit değeri sabit]
**Belirti:** Bileşen seçili görünüyor ama callback eski değeri alıyor. → **Neden:** `field.value` verilmiş fakat bileşenin değişim prop'una `field.onChange` bağlanmamış. → **Düzeltme:** Bileşenin gerçek API'sine göre value ve change callback'ini eşle.
:::

:::mistake[Input ilk render'da controlled uyarısı veriyor]
**Belirti:** Değer önce boş, sonra controlled gibi davranıyor. → **Neden:** Özel bileşenin `value` prop'u başlangıçta `undefined`. → **Düzeltme:** `defaultValues` içinde string, boolean veya bileşenin kabul ettiği boş seçim değerini açıkça belirle.
:::

:::mistake[Tüm alanlar Controller ile sarılıyor]
**Belirti:** Basit metin alanında çok sayıda render prop'u ve eşleme kodu var. → **Neden:** Native input için controlled köprü gerekmiyor. → **Düzeltme:** Native alanlarda `register`, özel controlled UI'de Controller kullan.
:::

:::sector
Tasarım sistemlerinde form bileşenleri `value`, `onChange`, `onBlur`, `name`, `disabled` ve hata ilişkisi gibi tutarlı bir API sunarsa RHF veya başka bir form aracına bağlamak kolaylaşır. Takım, her formda aynı özel eşleme kodunu kopyalamak yerine bir adapter bileşeni yazabilir.
:::

## Controller'da odak ve hata akışı

RHF alanı submit'te invalid bulduğunda ilk hatalı alana focus vermeyi deneyebilir. Bunun için controlled bileşenin focus edilebilir DOM öğesini RHF'ye ulaştırabilmesi gerekir. Üçüncü taraf bileşen `ref` yerine `inputRef` kabul ediyorsa `field.ref`'i bu prop'a bağlamak gerekebilir. Görselde hata mesajı çıkması, otomatik odak davranışının çalıştığı anlamına gelmez; klavyeyle submit edip odağın nereye gittiğini ayrıca dene.

`fieldState` alanın touched, dirty ve error bilgisini taşır. Bileşene `aria-invalid` ve `aria-describedby` vermek için bu state'i kullanabilirsin. Formda `formState.errors` ile alanı yeniden bulup aynı bilgiyi kurmak yerine render callback'indeki `fieldState` çoğu zaman daha yakındır. Fakat tasarım bileşeninin API'si `error` prop'u istiyorsa adapter içinde bu prop'u üret.

Bir controlled bileşen değişiklikte tüm seçimi değil yalnız alt değeri bildiriyorsa adapter bunu dönüştürür. Örneğin tarih aralığı picker'ı `{ start, end }` döndürebilir ama backend iki ayrı alan bekleyebilir. Form tipini UI bileşeninin API'sine körlemesine bağlama; formun gönderim anlamını belirle, sonra adapter'da dönüştür. Bu katmanda tarih formatı, timezone ve boş seçim (`null`) davranışını açık tut.

Controller'ın `render` prop'u bir render fonksiyonudur; içine her render'da yeni yardımcı bileşen tanımlamak veya input'u koşullu farklı ağaç konumlarına taşımak state resetlerine yol açabilir. Alanı sabit bir ağaç konumunda tut. Seçim değişimini event objesinden value'ya dönüştürmen gerekiyorsa `onChange={(event) => field.onChange(event.target.value)}` gibi bir adapter yaz; bileşenin verdiği callback imzasını öğrenmeden spread ederek bağlama.

Bu dersin seçim kuralı bir performans numarası değil, sözleşme uyumudur. Native alanın basit API'sine özel köprü eklemek bakım işidir. Karmaşık UI kit alanı ise form state'ini kendi local state'inde tutarsa iki değer kaynağını senkron tutmak zorunda kalırsın. Tek kaynağı RHF'de bırakıp UI'yi değer prop'larıyla sürmek test, reset ve submit davranışını öngörülebilir yapar.

Bir bileşenin `onChange` prop'u React'in standart event imzasını kullanıyorsa field callback'ini doğrudan vermek doğru olmayabilir. Bazı bileşenler `(event) => void`, bazıları `(value) => void` bekler; React Hook Form ise hem event'i hem de değeri kabul edebilen overload'lara sahiptir. Tip denetleyicisi uyumsuzluk gösteriyorsa callback'i wrapper ile çevir ve çıkan değerin gerçekten form tipine ait olduğunu kontrol et. `as unknown as` ile susturmak, yanlış değerin sessizce submit edilmesine neden olabilir.

Özel bileşen seçim listesi şeklindeyse native `<select>` yerine düğme grubu kullanmak erişilebilirlik semantiğini de senin sorumluluğuna verir. `role="radiogroup"`, `role="radio"`, `aria-checked`, roving tab index ve ok tuşları gibi davranışları sıfırdan uygulamak karmaşıktır. Mümkünse browser'ın native radio input'larını stilize et; özel UI gerçekten gerekiyorsa erişilebilir primitive sağlayan bir tasarım sistemi seç. Form bağlantısı, erişilebilir klavye davranışının yerine geçmez.

`Controller`'ın `name` alanına aynı adla iki input bağlamak çoğunlukla istemediğin bir durumdur. Paylaşılan değere sahip radio grubu gibi örnekte bu bilinçli olabilir; her input'un değerini veya seçili olma koşulunu ayrıca kur. İki bağımsız picker'a aynı `name` verirsen son değişiklik diğerinin değerini ezer. Form şemasındaki alan adları ürün anlamına göre benzersiz olsun.

## Özet ve kendini yokla

- Native input'larda `register`, controlled özel bileşenlerde `Controller` kullan.
- `field.value` ve `field.onChange` tek form deposunu korur; ayrı local state açma.
- Başlangıç değeri ve blur/change sözleşmesi özel bileşenin gerçek API'sine uymalıdır.

**Kendini yokla:** Özel picker neden yalnız `field.value` ile çalışmaz? Değişiklik form deposuna geri gitmez. Bir native textarea'yı neden Controller ile sarmak gerekmeyebilir? `register` onun DOM ref ve event bağlantısını zaten sağlar.
