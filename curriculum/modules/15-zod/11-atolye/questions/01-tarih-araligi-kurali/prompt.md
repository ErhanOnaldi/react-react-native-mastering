İzleme planında bitiş tarihi başlangıçtan önce seçilebiliyor ve kullanıcı uyarı almıyor. Başlangıçtan önce bir tarih girip Planı kaydet'e bas; form gönderilmeden ilgili alanda anlaşılır bir uyarı görünsün.

## Gereksinimler
- Plan adı, başlangıç ve bitiş tarihi boş bırakılamaz.
- Bitiş başlangıçtan önceyse gönderim yapılmamalı; hata Bitiş tarihi alanına bağlı, okunabilir olmalı ve alan geçersiz durumunu bildirmeli.
- Geçerli aralıkla gönderildiğinde callback üç girilen değeri almalı.

## Örnek
2026-07-10 başlangıç ve 2026-07-05 bitiş → hata ve gönderim yok. 2026-07-10 ile 2026-07-20 → üç alan callback'e gider.

## Sözleşme
- PlanForm.tsx içinde PlanForm({ onSubmit }: { onSubmit: (values: { title: string; startDate: string; endDate: string }) => void }) bileşenini tanımla.
- Plan adı, Başlangıç tarihi, Bitiş tarihi etiketleri ve Planı kaydet düğmesi bulunmalı.
- Hata metni önce olamaz ifadesini içermeli; Bitiş tarihi input'u hatanın id'sini aria-describedby ile kullanmalı.

