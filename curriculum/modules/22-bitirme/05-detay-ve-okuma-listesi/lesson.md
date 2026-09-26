---
title: "Eser detayı ve okuma listesi"
minutes: 10
kind: project
---

# Eser detayı ve okuma listesi

:::pain[Problem]
Sinema'da film kartından detayına geçince film `id`'si değiştiği halde eski ekranın kalmasını görmüştün: URL'deki kimlik veriyi seçmeliydi. Kitaplık'ta bir de Open Library'nin kirli verisi var. Dune'un açıklaması metin, başka bir eserin açıklaması `{ value: '...' }`, Suç ve Ceza'nın yazar adresi ise 404 dönüyor. Tek bir başarısız yazar isteği bütün detay ekranını düşürmemeli.

Okuma listesi de başka bir sorun çıkarır: `useState` ile eklediğin kitap yenilemede kaybolur; ham `localStorage` kaydına güvenirsen bozuk bir JSON uygulamayı açılmaz hale getirir.
:::

İki görevin var. Önce eser ekranını gerçek API cevabıyla kur, sonra kullanıcıya ait listeyi ekle. Her görevde önce görünen sorunu çöz; sonraki katmanı ancak ihtiyaç doğduğunda ekle.

## URL'deki eser kimliği veriyi seçer

`/works/:workId` adresindeki `workId`, `/works/OL893414W.json` isteğinin anahtarıdır. 4. dersteki `queryOptions` düzenini burada **başka bir kaynak** için kullan: arama key'inde `q` ve `page` vardı; detay key'inde eser id'si olmalı. Aynı bileşen açıkken `/works/OL24252290W` adresine gidince yeni eser görünmelidir.

Eser cevabında `description` iki biçimde gelebilir. Şemayla iki biçimi doğrula, sonra UI'a tek bir `string | null` aktar. `covers` içinde `-1` varsa bu bir kapak değil, “kapak yok” işaretidir. Detayda büyük görsel için URL kalıbı `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg`.

```ts check
import { z } from 'zod'

const descriptionSchema = z
  .union([z.string(), z.object({ value: z.string() })])
  .optional()
  .transform((description) =>
    typeof description === 'string' ? description : (description?.value ?? null),
  )

descriptionSchema.parse({ value: 'Arrakis...' }) // 'Arrakis...'
descriptionSchema.parse(undefined) // null
```

Yazar kimliği eser cevabındaki `authors[].author.key` alanından gelir. Yazar için ayrı istek at; bulunamazsa eser başlığını ve açıklamasını yine göster, ad yerine **“Yazar bilinmiyor”** yaz. Bu, Sinema'daki tek isteğe bağlı film detayından farklı bir durum: bağımlı ikinci istek başarısız olabilir.

:::mistake[Sık hata]
`Promise.all([getWork(id), getAuthor(id)])` burada uygun değildir: yazar id'sini ancak eser geldikten sonra biliyorsun. Üstelik yazar 404'ü tüm `Promise.all` sonucunu reddeder. Önce eseri doğrula; sonra varsa yazarını iste ve yazar hatasını kendi sınırında ele al.
:::

## Liste: sunucu verisi değil, kullanıcının verisi

“Okuma listem (n)” menüde, kayıt formu detayda, listenin kendisi ayrı sayfada. Aynı veriyi üç yerde kopyalama. 2. dersteki state haritana dön: bu bilgi istemciye ait; sunucu arama önbelleği olan TanStack Query'ye koymak zorunda değilsin. Seçtiğin paylaşılan state çözümünün tek sahibi olsun.

`localStorage` kalıcılık sağlar, ama doğruluk garantisi vermez. Kullanıcı DevTools'ta kaydı değiştirmiş, eski sürüm farklı alanlarla kaydetmiş veya JSON yarım kalmış olabilir. Okurken `JSON.parse` hatasını yakala; şekli Zod ile doğrula; geçersizse boş listeyle başla.

## Form: “Okudum” seçimi yeni bir kural doğurur

Başta durum ve not yeterli görünür. **Okudum** seçildiğinde ise puan (1–5) zorunlu olur. Bu ilişkiyi yalnız JSX'te alanı gizleyerek kurma; Zod doğrulaması da aynı kuralı bilmeli. Böylece elle gönderilen ya da saklanan hatalı veri de reddedilir.

RHF, alanların değerini ve hatasını yönetir. Zod, alanlar arası kuralı ve notun 280 karakter sınırını tek yerde tanımlar. Zod dönüşümü (`coerce`/`transform`) kullanırsan RHF'nin ham girdi tipiyle submit sonrası tipi farklı olabilir; `useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>` biçimini kullan.

```tsx
const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { status: 'want', note: '', rating: '' },
})
```

Bu parça tek başına derlenmez; `schema`, `useForm` ve `zodResolver` import'ları senin form dosyanda bulunacak. `useWatch` ile yalnız “Okudum” iken Puan alanını göster. Hata mesajını ilgili alanın altında ve ekran okuyucunun duyacağı biçimde sun.

## Tekrar merdiveni

| Önceki bağlam | Buradaki yeni kıvrım |
| --- | --- |
| Sinema detayında `id` → tek film isteği | Eser id'si → eser, ardından bağımlı yazar isteği |
| Aramada Zod → kirli liste verisini temizleme | Detayda union → aynı açıklamanın iki biçimini tek tipe çevirme |
| Favorilerde yerel saklama | Bozuk kayıt kontrolü ve form verisiyle birleşme |
| RHF'de tek alan hatası | Durum ve puan arasında koşullu kural |

:::sector[Sektörde]
Bir kaynağın hata sınırını ürün ihtiyacı belirler. Yazar profili yüklenmese de kitabın başlığı değerlidir; eser 404 ise ortada gösterilecek kitap yoktur. Hataları aynı “Bir sorun oluştu” mesajına indirgemek, kullanıcıya sonraki adımı söylemez.
:::

Şimdi önce **Eser detayı**, sonra **Okuma listesi** görevini yap. Test adları gereksinim belgendeki K-10–K-21 maddelerini somutlaştırır.
