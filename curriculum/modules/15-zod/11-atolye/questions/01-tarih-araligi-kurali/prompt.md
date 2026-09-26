İzleme planı formunda plan adı, başlangıç ve bitiş tarihi girilir (tarihler `YYYY-AA-GG` biçiminde düz metin alanlarıdır).

`PlanForm.tsx` içindeki `PlanForm` bileşenini tamamla:

- Üç alan da boş bırakılamaz.
- Bitiş tarihi, başlangıç tarihinden önce olamaz; olursa hata ilgili alanın altında okunabilir ve alan `aria-invalid` ile işaretli olmalı.

## Arayüz sözleşmesi

- Hata mesajı `önce olamaz` ifadesini içersin.
- Geçerli bir aralıkla gönderildiğinde `onSubmit`, girilen üç değerle çağrılmalı.

`PlanForm`, `{ onSubmit }: { onSubmit: (values: { title: string; startDate: string; endDate: string }) => void }` prop'unu alır.
