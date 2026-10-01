Taslakta bitiş tarihi boş bırakılabiliyor. Formun ham boş metnini kayıt verisi olarak göndermek yerine “tarih yok” değerine dönüştür; dolu ama geçersiz bir tarihi reddet.

## Gereksinimler
- Başlangıç draft'ının Başlık ve Bitiş tarihi değerleri alanlarda gösterilmeli.
- Geçersiz, boş olmayan tarih metninde Geçerli bir tarih ile başlayan hata gösterilmeli ve kayıt yapılmamalı.
- Boş tarih “tarih yok” sayılmalı; boş değerle kayıt yapılabilmeli.

## Örnek
dueDate boş olan taslakta input boş görünür; kaydetmek dueDate: undefined gönderir.

## Sözleşme
- DraftEditor.tsx içinde DraftEditor({ draft, onSave }: { draft: Draft; onSave: (values: { title: string; dueDate: string | undefined }) => void }) bileşenini dışa aktar.
- Draft tipi id, title ve dueDate string alanlarını taşır.
- Alan etiketleri Başlık ve Bitiş tarihi, düğme Kaydet olmalı.
