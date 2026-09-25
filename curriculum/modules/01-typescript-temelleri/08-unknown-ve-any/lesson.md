---
title: unknown ve any
minutes: 8
kind: concept
---

# unknown ve any

:::pain[Problem]
`res.json()` sonucunu film sanıp doğrudan `.title` okudun. Sunucu hata gövdesi döndürürse başlık `undefined` oluyor.
:::

## Bilmediğini dürüstçe söyle
`any` tip denetimini kapatır. `unknown` da değerin şeklini bilmediğini söyler ama okumadan önce kontrol ister. Bu ders yalnızca küçük bir elle kontrol örneği kurar; tüm API şemasını elle doğrulamak zahmetlidir.

```ts check
function titleOf(value: unknown): string {
  if (typeof value !== 'object' || value === null || !('title' in value)) return 'Başlık yok'
  return typeof value.title === 'string' ? value.title : 'Başlık yok'
}
void titleOf
```

`as Movie` bir kanıt değildir; derleyiciye güvenmesini söylersin. Yanlış veri aynı şekilde çalışma zamanında kırılır. Daha sonra Zod ile çalışma zamanı doğrulamasını öğreneceksin.

:::mistake
`unknown` değerine hemen `as` eklemek kontrolü atlar. Önce `typeof`, null ve alan denetimi yap.
:::

## Güven sınırını görünür yap
Ağ cevabı başarı nesnesi yerine `{ status_code: 7 }` olabilir. `any` ile `raw.title` okursan `undefined` görürsün ve tip kontrolü şikâyet etmez. `unknown` ile aynı satır geçmez; önce verinin nesne olup olmadığını, null olmadığını, sonra alanın varlığını ve değerinin string olduğunu sınarsın.

`as Movie` yazmak kısa görünür. Ancak bu ifade JavaScript çıktısında kalmaz; eksik `title` alanı eklemez. Yalnızca derleyicinin şüphesini bastırır. Gerçek doğrulama koşul veya şema ile çalışma zamanında yapılır.

## Küçük kontrol, büyük maliyet
Bu derste yalnızca `title` alanını denetleyeceksin. Tam Movie için id, başlık, poster, tür id'leri, puan ve diğer bütün alanları kontrol etmek gerekir. Tek tek yazılan kontroller uzadığında Zod gibi bir şema aracı ihtiyaç haline gelir. O araca kadar `unknown` seçerek sınırdaki belirsizliği dürüstçe taşı.

:::tip
Kontrolden sonra tip daralır; sonucu yeni bir değişkene aktarıp uygulamanın geri kalanında güvenle kullanabilirsin. Önce başarısız durumlardan dönmek kodu sade tutar.
:::

## Sektörde
API sınırında veri belirsizdir. Tip notasyonu ile gerçek veri kontrolünün görevlerini ayrı düşün.
