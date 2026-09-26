Kopyalanmış shadcn `form.tsx` dosyasını açtığında içinde Context, `useId`, Slot ve RHF'in `useFormState`'i var. Onu "sihirli kutu" olarak kullanmadan önce bir kez **kendin yaz**: neyi satın aldığını gör.

## Dosyalar
- `form.tsx` (düzenlenecek): `Form`, `FormField` ve iki Context hazır. `FormItem`, `useFormField`, `FormLabel`, `FormControl`, `FormMessage` senin.
- `ReviewForm.tsx` (salt okunur): bu parçaları kullanan yorum formu. **Hiçbir id elle yazılmamış**; bağları senin parçaların kuracak.
- `reviewSchema.ts` (salt okunur): önceki görevin şeması.

## Gereksinimler
- `FormItem` her alan için `useId()` ile bir kimlik üretip `FormItemContext`'e koysun.
- `useFormField()` alan adını (`FormFieldContext`), kimliği (`FormItemContext`) ve RHF alan hatasını birleştirip `{ name, error, formItemId, formMessageId }` döndürsün. Parçalar yanlış yerde kullanılırsa anlaşılır hata fırlatsın.
- `FormLabel` kendi kontrolüne `htmlFor` ile bağlansın.
- `FormControl` (Slot) tek çocuğuna `id`, `aria-invalid` ve **yalnızca hata varken** `aria-describedby` versin.
- `FormMessage` hata varsa mesajı `formMessageId` kimliğiyle göstersin, yoksa hiçbir şey render etmesin.
- Hata düzelince mesaj kalksın; sayfada iki form olsa da kimlikler çakışmasın.

Önizlemede boş gönder, sonra alanları doldur. Ekran okuyucu yoksa tarayıcının erişilebilirlik panelinde textarea'nın "Description" alanına bak.
