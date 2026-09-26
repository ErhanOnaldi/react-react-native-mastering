Sinema'nın yorum formu (14–15. modül) çalışıyor ama iki sorunu var: id'ler elle yazıldığı için form sayfada iki kez render edilirse çakışıyor, ve puan için beş ayrı `aria-pressed` düğmesi var. Aslında bu **tek seçimli bir grup**: doğru rolü `radiogroup`, doğru klavye düzeni yön tuşları.

## Kurulum
`pnpm dlx shadcn@latest add form label textarea radio-group`

## Dosya ve export sözleşmesi
- `src/components/ui/form.tsx` → `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
- `src/components/ui/label.tsx` → `Label`, `textarea.tsx` → `Textarea`, `radio-group.tsx` → `RadioGroup`, `RadioGroupItem`
- `src/features/watchlists/ReviewForm.tsx` → `ReviewForm({ postId })` export'u ve DummyJSON `POST /comments/add` mutation'ı aynen kalsın.

## Davranış
- Form kopyalanmış `Form…` parçalarıyla kurulsun; elle yazılmış `id`/`aria-describedby` kalmasın.
- **Puan**: adı **Puan** olan bir `radiogroup` (Radix `RadioGroup`); içinde **1 yıldız** … **5 yıldız** adlı beş `radio`. Yön tuşları seçimi değiştirsin. (`FormLabel` bir `div`'i adlandıramaz; gruba adı `aria-label` ya da `aria-labelledby` ile ver.)
- **Yorum**: **Yorum** etiketli `Textarea`.
- Boş gönderimde istek atılmasın; **Puan seç** ve **Yorum gerekli** mesajları görünsün ve `FormControl` sayesinde ilgili alana (`aria-invalid` + `aria-describedby`) bağlansın.
- Geçerli gönderimde istek gitsin, **Yorum kaydedildi** görünsün; gönder düğmesinin adı **Gönder**.

Mesajları `src/features/watchlists/schemas.ts` içindeki `reviewSchema` belirlesin.
