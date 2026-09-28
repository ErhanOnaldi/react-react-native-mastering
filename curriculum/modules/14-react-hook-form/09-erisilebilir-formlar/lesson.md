---
title: "Hata mesajını doğru alana bağla"
minutes: 14
kind: concept
---

# Hata mesajını doğru alana bağla

:::pain[Ekran okuyucu hangi alanı söylemeli?]
Kurs başlığı boş bırakılınca kırmızı “Başlık gerekli” metni görünüyor. Görsel olarak başlığın altında; ama ekran okuyucu input'a geldiğinde alanın adını söylemiyor ve hata metnini onunla ilişkilendirmiyor. Renk ve yakınlık tek başına programatik bilgi değildir.
:::

## Alanın adı ve hata ilişkisi

Erişilebilir form üç ayrı bilgiyi taşır: alanın adı, geçerli/geçersiz durumu ve açıklaması. Görünür `<label>` input'u adlandırır. `aria-invalid` geçersizliği belirtir. `aria-describedby` yardım veya hata metninin id'sine bağlanır. RHF hata nesnesini üretir; bu ARIA ilişkilerini otomatik olarak kurmaz.

:::model[Form deposu ve abonelik]
Değer ve alan hatası RHF form deposundadır; UI bu hata değişimini okuyup uygun ARIA özelliklerini DOM'a yazar. Yeni bağlamda erişilebilirlik durumu, form verisini ikinci state'e kopyalamadan semantik HTML ile açıklanır.
:::

Alan/hata eşleşmesi için kurallar:

1. Her input'un kalıcı ve görünür etiketi olsun. Placeholder etiketin yerini tutmaz; yazı girilince kaybolur.
2. `<label htmlFor="id">` ile input `id` değerini eşleştir. `name`, erişilebilir adın otomatik karşılığı değildir.
3. Hatalı durumda `aria-invalid="true"` ver; geçerliyken attribute'u kaldır veya false kullan.
4. Hata metnine bir `id` ver ve input'un `aria-describedby` değerini buna bağla. Yardım metni de varsa birden çok id'yi boşlukla ayır.
5. Hata metnini kısa ve düzeltilebilir yaz. Alan başına hata tercih et; form seviyesi sunucu hatasını ayrı göster.
6. Hata ilk kez göründüğünde `role="alert"` duyurmayı sağlayabilir; çok sayıda hatayı aynı anda alert yapmak gürültülüdür. Gerekiyorsa submit'te ilk hatalı alana focus taşı.
7. Ekran okuyucu adını RTL testinde `getByRole` veya `getByLabelText` ile aramak, semantik bağlantının kullanıcıya görünen karşılığını doğrular.

## Odak ve hata sırasını takip et

Bir bilet rezervasyonunda “Katılımcı adı” boş gönderildi:

| Sıra | DOM/form değişimi | Yardımcı teknolojiye giden bilgi |
|---|---|---|
| 1 | Label ve input id eşleşir | “Katılımcı adı, düzenleme” |
| 2 | Submit sonrası alan hatası oluşur | Form bu alanı geçersiz işaretler |
| 3 | Hata paragrafı DOM'a eklenir | “Ad gerekli” duyurulabilir |
| 4 | Input `aria-describedby` ile hata id'sine bağlanır | Alan odağına dönünce hata açıklaması bulunur |
| 5 | Kullanıcı ad yazar, hata temizlenir | Geçersiz durumu kalkar, açıklama bağlantısı kaldırılır |

İlişki DOM kimlikleri üzerinden kurulur. İki form aynı sayfadaysa sabit `participant-error` id'sini iki kez üretmemelisin; her örnek için benzersiz id üretmek adına `useId` kullanabilirsin. `useId` veri id'si değildir; list key'i veya sunucu kayıt anahtarı yerine kullanılmaz.

## Önce görsel ama kopuk, sonra bağlı

Aşağıdaki kodda placeholder alanın tek adı, hata metni de ilişkisizdir:

```tsx
<input placeholder="Katılımcı adı" aria-invalid={Boolean(errors.name)} />
{errors.name && <p className="text-red-600">{errors.name.message}</p>}
```

Label, geçersizlik ve hata id'sini açıkça bağla:

```tsx check
import { useId } from 'react'
import { useForm } from 'react-hook-form'

type GuestValues = { guestName: string }

export function GuestForm() {
  const errorId = useId()
  const { register, handleSubmit, formState: { errors } } = useForm<GuestValues>({
    defaultValues: { guestName: '' },
  })
  const hasError = Boolean(errors.guestName)
  return <form onSubmit={handleSubmit((values) => console.log(values))}>
    <label htmlFor="guest-name">Katılımcı adı</label>
    <input id="guest-name" aria-invalid={hasError || undefined}
      aria-describedby={hasError ? errorId : undefined}
      {...register('guestName', { required: 'Ad gerekli' })} />
    {errors.guestName && <p id={errorId} role="alert">{errors.guestName.message}</p>}
    <button type="submit">Devam et</button>
  </form>
}
```

Input her zaman aynı id ile etikete bağlı kalır. Yalnız hata varken `aria-invalid` ve açıklama ilişkisi kurulur; hata elementi yokken kırık id referansı oluşmaz. `role="alert"` hatayı duyurur, ama focus yönetimi ayrı karardır. Birkaç hata aynı anda beliriyorsa form başında hata özeti ve alanlara bağlantı da sunabilirsin.

## Checkbox, seçim ve hata metni

Checkbox'ta `<label>` yine gereklidir; seçilmiş durumunu `checked`/RHF alanı verir. Özel seçim bileşeninde uygun native semantiği kullan: tek tercih için radio grubu, aç/kapa için checkbox, birkaç bağımsız tercih için checkbox grubu. Sadece `div`'e click handler eklemek klavye erişimi sağlamaz.

Hata mesajını yalnız renk ile anlatma. Hata metninde neyin yanlış ve nasıl düzeltileceği yazsın: “Geçersiz değer” yerine “Başlangıç tarihi bugünden sonra olmalı.” `aria-describedby` yardım metnini de gösterebilir; ekran okuyucu metni tekrarlıyorsa açıklama alanlarını sadeleştir.

:::mistake[Hata görünür ama input ile ilişkisiz]
**Belirti:** Ekran okuyucu input adını söyler, hata hakkında bilgi vermez. → **Neden:** Hata DOM'da var ama input'un `aria-describedby` değeri hata id'sine işaret etmiyor. → **Düzeltme:** Hata id'sini input'a bağla ve hata yokken bağlantıyı kaldır.
:::

:::mistake[Placeholder etiket gibi kullanılıyor]
**Belirti:** Kullanıcı yazmaya başlayınca alanın adı kayboluyor. → **Neden:** Placeholder geçici ipucudur; label değildir. → **Düzeltme:** Her input için görünür `<label>` ve eşleşen `htmlFor`/`id` ekle.
:::

:::mistake[Sayfada aynı hata id'si çoğalıyor]
**Belirti:** İki formun ilk alanı aynı hata metnini duyuruyor. → **Neden:** Kopyalanmış sabit DOM id'leri benzersiz değil. → **Düzeltme:** `useId` ile instance başına id üret veya benzersiz kayıt anahtarı ekle.
:::

:::sector
Ekiplerde form bileşenlerinin API'sine label, yardım metni, hata metni ve `aria-*` bağlantıları dahil edilir. Tasarım QA'sında klavye ile alanları gezmek, submit etmek ve hata bağlarını ekran okuyucuyla kontrol etmek gerekir. Otomatik testler semantik bağlantıyı yakalar; gerçek yardımcı teknoloji deneyimini tek başına kanıtlamaz.
:::

## Bir formu klavyeyle ve semantik sorguyla kontrol et

Formu sadece mouse ile kullanma. Tab ile alanlar ve düğmeler arasında ilerle; label'ların odağı doğru input'a taşıdığını, Enter/Space'in beklenen submit veya seçim davranışını verdiğini ve hata sonrası focus'un kaybolmadığını gör. Yıldız gibi bir seçim kontrolü butonlardan oluşuyorsa her buton adı ve seçili durumu anlaşılır olmalı. Tek bir `div`'e click handler yazmak bu davranışları sağlamaz.

Birden fazla alan hatası varsa hepsini `role="alert"` olarak işaretlemek ekran okuyucuya art arda bildirim yağdırabilir. Tasarımına göre submit sonrası hata özeti duyurup odaklayabilir, alan mesajlarını da `aria-describedby` ile ilişkilendirebilirsin. Hata özeti her mesajı tekrarlıyorsa ya özetin içeriğini kısalt ya da canlı duyuru davranışını düzenle. Ekran okuyucuda mesaj sırasının formdaki alan sırasıyla tutarlı olması da kullanıcının hataları düzeltmesini kolaylaştırır.

Hata düzeldiğinde `aria-invalid` değerini kaldır. Eski hata id'sini `aria-describedby` içinde tutarsan ekran okuyucu artık görünmeyen açıklamaya bağlantı verebilir. Yardım metni sürekli görünüyorsa hata temizlense de onun id'si kalabilir; birden çok açıklama varsa boşlukla ayrılmış id listesi kur. ID oluştururken `useId` kullanmak aynı component'in iki kopyasında benzersizlik sağlar; listelerde her öğe için key'in yerine geçmez.

RTL'de `getByRole('textbox', { name: 'Katılımcı adı' })` kullanmak, input'un erişilebilir adını da görev davranışının parçası yapar. `getByTestId` DOM'un kullanıcıya görünmeyen ayrıntısına bağlanır; yalnız rol/ad sorgusu mümkün olmadığında tercih et. Buna rağmen jsdom'un ekran okuyucu olmadığını unutma: otomatik test aria ilişkisinin varlığını doğrular, gerçek odak ve duyuru deneyimini manuel kontrol de tamamlar.

Form tasarımı uzun label metinlerinde de anlaşılır kalmalı. Yardım metnini placeholder'a sıkıştırma; mobilde input dolunca ipucu kaybolur. Hata mesajını alanın altına koymak görsel hiyerarşiyi destekler, ama DOM sırası ve `aria-describedby` bağı da aynı alanı göstermeli. Renk kullanıyorsan ikon veya metinle anlamı tekrar et.

## Özet ve kendini yokla

- Görünür label alanın adını belirler; placeholder kalıcı ad değildir.
- `aria-invalid` durumu, `aria-describedby` yardım/hata açıklamasını taşır.
- Hata elementi görünürken benzersiz id ile input'a bağlanmalı; hata yokken kırık bağlantı kalmamalıdır.
- Semantik native elementleri seçmek klavye ve ekran okuyucu davranışını kolaylaştırır.

**Kendini yokla:** Input'ta yalnız `name="email"` olması ekran okuyucuya “E-posta” adını verir mi? Hayır, label veya erişilebilir ad gerekir. İki formda hata id'leri aynı olabilir mi? Hayır, id DOM'da benzersiz olmalıdır.
