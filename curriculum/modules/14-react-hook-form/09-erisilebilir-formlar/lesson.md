---
title: "Hata duyulan form"
minutes: 7
kind: concept
---

# Hata duyulan form

:::pain[Problem]
“Ad gerekli” yazısı ekranda görünüyor, fakat ekran okuyucu hangi alana ait olduğunu bilmiyor. Bir hata mesajının görünmesi tek başına erişilebilirlik sağlamaz.
:::

## Alanı ve hatayı bağla

`<label htmlFor="name">Liste adı</label>` ve `<input id="name">` aynı kimliği kullanır. Hata varken `aria-invalid={true}` ekle. `aria-describedby="name-error"`, hata metninin `id` değerini gösterir; hata yoksa `undefined` olabilir. Böylece kullanıcı alana geldiğinde açıklamayı duyabilir.

```tsx
<label htmlFor="name">Liste adı</label>
<input id="name" aria-invalid={Boolean(errors.name)}
  aria-describedby={errors.name ? 'name-error' : undefined}
  {...register('name', { required: 'Ad gerekli' })} />
{errors.name && <p id="name-error" role="alert">{errors.name.message}</p>}
```

Bu kesitte `errors` ve `register` form hook'undan gelir. Testte `getByRole('textbox', { name: 'Liste adı' })` ve `getByLabelText` kullan; yalnızca CSS seçicisine bağlanma. `userEvent` ile yazıp hata mesajının kaybolduğunu da gözle.

:::mistake
`placeholder` label değildir. Hata mesajını sadece kırmızı renkle ayırt etme; metin ve programatik ilişki kur.
:::

:::sector
Her alan için kararlı ve benzersiz `id` kullan. Bir sayfada iki form varsa aynı `name-error` id'sini iki kez üretme.
:::
