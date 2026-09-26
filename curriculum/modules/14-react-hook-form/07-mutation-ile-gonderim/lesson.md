---
title: "Formu mutation ile gönder"
minutes: 7
kind: concept
---

# Formu mutation ile gönder

:::pain[Problem]
Yorum formu geçerli görünüyor ama “Gönder” tıklamasında ağ hatası olursa kullanıcıya hiçbir şey söylenmiyor. Form doğrulaması ile sunucu isteği ayrı sorumluluklar.
:::

## İki ayrı başarı koşulu

Formun geçerli olması, sunucunun kaydı kabul ettiği anlamına gelmez. `handleSubmit` istemcideki alan kurallarını geçirir; `useMutation` ağdaki yazma işleminin bekleme, başarı ve hata durumunu yönetir. Bu iki aşamanın mesajları ve temizleme zamanı farklıdır. Kullanıcı geçerli veri girmiş olsa bile sunucu hatasıyla karşılaşabilir.

Sinema yorumunda RHF ile toplanan veri mutation'a aktarılır. Önceki cache derslerindeki ağ hata yönetimi burada form deneyimine bağlanır. Gönderim başarısızsa alanlar korunur; başarılıysa uygun bildirim ve gerekirse `reset` yapılır.

## Önceki modülle birleşim

`handleSubmit` geçerli veriyi üretir; `useMutation` asenkron yazmayı yönetir. DummyJSON `POST /comments/add` gövdesi `{ body, postId, userId }` biçimindedir. Boş `body` 400 döner; başarılı istek 201 ve oluşturulan yorumu döndürür. `fetch` başarısız HTTP durumunda throw etmediği için `response.ok` kontrolü gerekir.

```tsx
const mutation = useMutation({ mutationFn: addComment })
// <form onSubmit={handleSubmit((values) => mutation.mutate(values))}>
//   <button disabled={mutation.isPending}>Gönder</button>
// </form>
```

Bu kesitte `addComment` ve `handleSubmit` bileşen kapsamında tanımlıdır. `mutation.isError` için mesaj, `isSuccess` için başarı geri bildirimi ver. RHF alan hatası ile sunucu hatasını aynı mesaj sanma.

:::mistake
`isSubmitting`, `mutate()` callback'i hemen döndüğü için ağ isteği bitene kadar true kalmayabilir. Beklemek istiyorsan `await mutation.mutateAsync(values)` kullan veya butonda `mutation.isPending` göster.
:::

:::sector
Sunucuya giden `body` ile ekrandaki puanı ayrı tut: DummyJSON yorum endpoint'i puan alanı kabul etmiyor. Sinema'nın puanlaması TMDB'de zaten ayrı mutation.
:::
