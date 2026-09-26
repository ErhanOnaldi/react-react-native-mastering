---
title: "Rol ve erişilebilir ad"
minutes: 8
kind: concept
---

# Rol ve erişilebilir ad

:::pain[Problem]
Arama kutusunu test id ile bulan test, tasarımcı id’yi değiştirince kırıldı. Ekran okuyucu ise kutuyu hâlâ Film ara etiketiyle buluyor.
:::

## Kullanıcının bulabildiği öğeyi bul

DOM sorgusu, testin hangi öğeyi hangi özellik sayesinde tanıdığını söyler. Rol ve erişilebilir ad, düğme veya input'un kullanıcıya sunduğu anlamı temsil eder. Test id teknik bir işaret olabilir, fakat görünen arayüz sözleşmesini açıklamaz. `getBy`, `queryBy` ve `findBy` de öğenin hemen, hiç veya gecikerek bulunması beklentisini ayırır.

Sinema arama kutusunun label'ı ekran okuyucu için de RTL testi için de aynı adı sağlar. Önceki a11y ipuçları burada pratik geri bildirim kazanır. Yanlış sorgu seçmek, gerçek kullanıcı davranışını testten gizleyebilir.

## İhtiyaç ve çözüm

Önce `getByRole` ve `name` kullan. `name`, görünen metinden ya da `label`’dan hesaplanır. `searchbox` rolü arama input’unu, `button` rolü düğmeyi belirtir. `getByLabelText` de etiketli input için uygundur. `getByTestId` son çaredir.

`getBy` öğe yoksa hemen hata verir. Yokluğunu sınarken `queryBy` kullan. Öğenin sonradan gelmesini beklemek için bir sonraki derste `findBy` gerekir.

## Aynı ekran, farklı sorgu

Sinema arama kutusuna `<label htmlFor="search">Film ara</label>` bağlandığında erişilebilir adı vardır. Bir test id eklemesen de kullanıcı ve ekran okuyucu bu adı bulur.

```tsx title="SearchBox.test.tsx"
const input = screen.getByRole('searchbox', { name: 'Film ara' })
expect(input).toHaveValue('')
expect(screen.queryByRole('alert')).not.toBeInTheDocument()
```

`getByRole` öğenin **şu anda** bulunmasını bekler; yoksa hemen hata verir. `queryByRole` yokluk assertion’ı içindir. Gecikmeyle gelecek bir öğe için `findByRole` kullanacaksın. Bu üçlü arasındaki fark, beklemenin nerede olması gerektiğini de test adında görünür kılar.

| İhtiyaç | Sorgu |
| --- | --- |
| Şimdi var olmalı | `getByRole` |
| Şimdi olmamalı | `queryByRole` |
| Birazdan gelmeli | `findByRole` |

Başlıkta `level: 2` ekleyebilirsin; fakat kullanıcı açısından seviye sözleşmesi önemli değilse gereksiz kısıt koyma. `<label>` ilişkisini bozarsan `name` sorgusu başarısız olur: bu bir test kırılması olduğu kadar erişilebilirlik sinyalidir.

:::mistake
`getByText('Film ara')` çoğunlukla label öğesini bulur, input’u değil. Input’un değerini veya yazılabilirliğini sınamak için input’un kendisini sorgula.
:::

:::sector[Sektörde]
Role/name sorguları erişilebilirlik ile test dayanıklılığını aynı anda iyileştirir. Etiket kaybolursa hem ekran okuyucu hem test bunu fark eder.
:::
