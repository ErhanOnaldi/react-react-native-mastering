---
title: "Formda stil, veri ve hata bir arada"
minutes: 15
kind: concept
---

# Formda stil, veri ve hata bir arada

React Hook Form (RHF) alan değerlerini ve doğrulama durumunu yönetir; Zod verinin kurallarını tanımlar. shadcn tarzı form parçaları bu ikisinin yerine geçmez. Onları hazır parçalar gibi düşün: aynı görünümü korurken her alanın label'ını, kontrolünü ve varsa hata mesajını birlikte kurmana yardım eder.

## Bir alanı önce HTML ile doğru bağla

Sinema'da ziyaretçi izleme listesine kısa bir not eklesin. Alanın etiketi ve kontrolü şu kadar basit olabilir:

```tsx
<label htmlFor="watch-note">İzleme notu</label>
<textarea id="watch-note" name="note" />
```

`htmlFor` ile `id` aynı değeri gösterdiği için etikete tıklayınca doğru textarea focus alır. `name` ise form verisindeki alanın adıdır. `name` ve `id` benzer görünse de farklı işler yapar: biri RHF/Zod tarafındaki `note` alanını, diğeri ekrandaki belirli DOM öğesini bulur.

Şimdi hatayı alana bağlayalım:

```tsx
<label htmlFor="watch-note">İzleme notu</label>
<textarea id="watch-note" name="note" aria-invalid="true" aria-describedby="watch-note-error" />
<p id="watch-note-error">Not boş olamaz</p>
```

`aria-invalid` kontrolün geçersiz olduğunu, `aria-describedby` ise açıklama metninin id'sini söyler. Tarayıcının **accessibility tree**'si, görsel DOM'dan ayrı olarak ekran okuyucu gibi yardımcı teknolojilere rol, ad ve açıklama sunan yapıdır. Hata mesajı yalnızca piksel olarak görünür olmamalı; bu ağaçta da ilgili kontrolün açıklaması olarak yer almalıdır.

RHF doğrulama hatasını kaydettiğinde bu bağ koşullu olur: hata yokken `aria-invalid` verme ve henüz DOM'da olmayan hata id'sini `aria-describedby` içine yazma. Hata oluşunca metin görünür, id DOM'da bulunur ve kontrol o id'yi açıklar. Mesaj temizlenince bu referans da kalkar.

| An | Hata durumu | Kontrolün bağlantısı |
| --- | --- | --- |
| İlk görünüm | Hata yok | Label kontrolü adlandırır; hata açıklaması yoktur. |
| Boş gönderim | Hata var | Kontrol geçersiz olur ve hata id'sini açıklar. |
| Düzeltme | Hata temizlenir | Geçersizlik ve hata açıklaması bağlantısı kalkar. |

![RHF alan adı ve DOM id'si, kontrolü hata mesajına bağlar](diagrams/form-baglari.svg)

## Form parçaları neyi birlikte tutar?

Aynı fikri tekrar kullanılabilir parçalara taşıdığında görünüş ve bağlar aynı grupta kalır:

```tsx
<FormField name="note" control={form.control} render={({ field }) => (
  <FormItem>
    <FormLabel>İzleme notu</FormLabel>
    <FormControl><Textarea {...field} /></FormControl>
    <p>Bu notu daha sonra yalnızca sen görürsün.</p>
    <FormMessage />
  </FormItem>
)} />
```

Burada `FormField` RHF alanını belirtir. `FormItem` tek alanın parçalarını bir arada tutar; `FormLabel` etiketi, `FormControl` gerçek input'u, `FormMessage` varsa hatayı gösterir. Yardım metni de aynı grupta durduğu için formu okuyan kişi hangi açıklamanın hangi alana ait olduğunu anlayabilir. Projedeki hazır parçalarda bulunmayan bir isim kullanmak zorunda değilsin; normal bir `p` öğesi de yardımcı metin olabilir.

Bu parçaları ayrı kullanmak, örneğin hata için ikinci bir elle yazılmış label id'si üretmek zorunda kalmamanı sağlar. Her FormItem'a özgü DOM kimliği, sayfada aynı formdan iki tane olsa bile etiketlerin çakışmasını önler. İki formun RHF alan adı `note` olabilir; fakat ekrandaki iki `textarea` farklı öğelerdir ve ayrı id'lere ihtiyaç duyar.

Bir hata metni uzunsa düzeni de içeriğe göre kur. Alanı ve hata mesajını aynı FormItem içinde bırak; dar ekranda düğmelerin satır kırmasına izin ver. Hata metnini gizlemek veya düğmeleri `absolute` konumlandırmak sorunu çözmez: kullanıcı mesajı okuyamaz ya da uzun metinle düğmeler üst üste gelir.

## Şema, kullanıcı metnini nasıl temizler?

Form kontrolünden gelen değer kullanıcı girdisidir. Şema bunu doğrulayabilir ve gerektiğinde temizleyebilir:

```ts check
import { z } from 'zod'

const noteSchema = z.object({
  note: z.string().trim().min(1, { error: 'Bir not yaz' }),
})
```

`trim()` baştaki ve sondaki boşlukları kaldırır; `.min(1)` temizlenmiş metnin boş kalmasını engeller. **Transform**, doğrulanan girdiyi başka bir değere dönüştürme işlemidir. Bu örnekte şema boşlukları silerek temiz bir `note` üretir; form gönderildiğinde callback'e ham `'  Güzel film  '` değil `'Güzel film'` gider. Dönüşüm, yalnızca hatayı yakalamak değil sonraki koda düzenli veri vermek için yararlıdır.

Kurallar sayı alanında da art arda uygulanabilir:

```ts check
import { z } from 'zod'

const screeningSchema = z.object({
  screenings: z.number({ error: 'Seans sayısı gerekli' })
    .int({ error: 'Seans sayısı tam sayı olmalı' })
    .min(1, { error: 'En az bir seans seç' })
    .max(12, { error: 'En fazla 12 seans seç' }),
})
```

`z.number` sayının kendisini bekler; `.int`, `.min` ve `.max` farklı geçersiz durumlara kendi mesajlarını verir. HTML number input'u ise kullanıcı girdisini metin olarak sunabilir. RHF'in `valueAsNumber` seçeneği bu değeri JavaScript sayısına çevirir; boş alanı da ayrıca ele almak gerekir, çünkü boş değer geçerli bir seans sayısı değildir. **Coerce**, girdiyi hedef tipe çevirmeyi deneyen dönüşümdür; Zod tarafında sayısal metni sayıya çevirebilir ama boş girdinin ne anlama geldiği kararını yine sen vermelisin.

Zod'da dönüşüm öncesi giriş tipi ile doğrulamadan sonraki çıktı tipi ayrılabilir; bu nedenle RHF'e hangi tipi verdiğini, callback'in hangi temizlenmiş tipi alacağını bilerek eşleştir. Bir alanın kurallarını tek yerde tutmanın nedeni de budur. Aynı `screenings` için bir yerde 1–12, başka yerde 0–20 kuralı yazarsan kullanıcı aynı değeri bir ekranda geçerli, diğerinde geçersiz görür. Şema sınırı ortaklaştırır; form parçaları bu kuralların sonucunu doğru alanda gösterir.

Şemadan tip çıkarırken `z.infer<typeof noteSchema>` doğrulanmış çıktı tipini verir. Dönüşümün öncesi ve sonrasını ayrı ayrı adlandırman gerekiyorsa `z.input<typeof noteSchema>` girdi tipini, `z.output<typeof noteSchema>` çıktı tipini verir. Böylece formun kabul ettiği değeri callback'in aldığı temizlenmiş değerle karıştırmazsın.

## FormControl'ün çocuğu gerçek kontrol olmalı

Kopyalanmış shadcn formunda `FormControl`, Radix `Slot` kullanan bir parçadır. **Slot**, kendi başına yeni bir DOM öğesi çizmek yerine özelliklerini tek çocuğuna aktaran yardımcıdır. `FormControl` id ve ARIA özelliklerini `Textarea`'ya veya `Input`'a verir; bu yüzden sarmalayıcı `div` değil, gerçek form kontrolü onun doğrudan çocuğu olmalıdır.

Gerçek bir hata şöyle görünür:

```tsx
<FormControl>
  <div className="relative">
    <textarea />
    <span>120 karakter</span>
  </div>
</FormControl>
```

Hata mesajı ekranda görünür ama ekran okuyucu alana geldiğinde etiketi veya hatayı okumaz. `FormControl` özellikleri `div`'e aktarılmıştır; textarea bu özellikleri almamıştır. Çözüm: `FormControl`'ü doğrudan `textarea` etrafına koy, sayaç gibi görsel yardımcıları aynı `FormItem` içinde kardeş öğe olarak bırak.

Birden çok açıklama olduğunda `aria-describedby` id'leri boşlukla ayırarak listeleyebilir. Her id gerçekten DOM'da bulunan metni göstermeli. Ayrıca renk tek başına hata belirtisi olmamalı; metin veya simge de kullan. **WCAG**, web erişilebilirliği için yönergeler bütünüdür; erişilebilir ad, hata ilişkisi ve yeterli kontrast bu kullanıcı deneyiminin parçalarıdır.

:::info[Derinlemesine (isteğe bağlı)]
shadcn form parçalarının iç implementasyonunda `Context`, bir üst bileşenin bilgisini alt bileşenlere vermek için kullandığı React mekanizmasıdır. `useFormState({ name })` yalnızca ilgili alanın durum değişimini izlemek için bir subscription (abonelik) kurar; `getFieldState` de hata bilgisini okur. Bu bağlantıların içini bilmek, bir form parçasını geliştirirken yararlıdır. Hazır parçaları kullandığında senin ana işin doğru alanı ve gerçek kontrolü doğru FormField/FormControl içinde birleştirmektir.
:::

## Özet

- RHF alan değerini ve hata durumunu, Zod doğrulama ve dönüşüm kurallarını yönetir.
- Her alanın `name`'i form verisini, `id`'si DOM öğesini bulur; ikisi aynı görevde değildir.
- Label, gerçek kontrol ve hata mesajını aynı FormItem içinde tut; hata id'sini yalnızca gerçekten varsa bağla.
- FormControl'e doğrudan gerçek input veya textarea ver; sayaç gibi öğeleri kardeş olarak tut.
- Şema girdiyi doğrulayabilir ve `trim` gibi transform ile temizlenmiş çıktı üretebilir.

**Yeni terimler**

- **Accessibility tree:** Ekran okuyucu gibi araçların kullandığı rol, ad ve açıklama ağacı.
- **Transform:** Şema içindeki doğrulanmış girdiyi başka bir değere dönüştürme.
- **Coerce:** Girdiyi hedef tipe çevirmeyi deneyen dönüşüm.
- **Slot:** Özellikleri tek çocuğuna aktaran, ek DOM öğesi üretmeyen yardımcı.
- **Context:** React'te üst bileşenin bilgisini alt bileşenlere ulaştıran mekanizma.
- **Subscription:** Bir durum değişince ilgili kodun haberdar edilmesini sağlayan abonelik.
- **WCAG:** Web erişilebilirliği için yönergeler bütünü.

Kendini yokla: Aynı form iki kere görünürken `name="note"` aynı olabilir mi? Cevap: Evet. Form verisi alan adı aynı olabilir; DOM öğelerini ayırmak için `id` değerleri farklı olmalıdır.

Kendini yokla: Hata mesajı görünüyor ama kontrol hata açıklamasını almıyorsa önce neye bakarsın? Cevap: `aria-describedby` kontrolün kendisinde mi ve gerçekten var olan hata id'sini mi gösteriyor diye bakarım.
