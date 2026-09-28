Bir taslak seçip başlığını değiştir, sonra başka taslağa geç. Form yeni taslağın değerlerini göstermiyor; önceki metin ekranda kalıyor. Bitiş tarihini boşaltıp kaydettiğinde de boş değer tutarsız ele alınıyor.

## Gereksinimler
- draft prop'u farklı kayıt olduğunda Başlık ve Bitiş tarihi alanları yeni kaydın değerlerini göstermeli.
- Geçersiz, boş olmayan tarih metninde Geçerli bir tarih ile başlayan hata gösterilmeli ve kayıt yapılmamalı.
- Boş tarih “tarih yok” sayılmalı; boş değerle kayıt yapılabilmeli.

## Örnek
Taslak A tarih taşır, Taslak B'nin dueDate alanı boş. B'ye geçince input boş görünür; taslak A'da tarihi silip kaydetmek dueDate: undefined gönderir.

## Sözleşme
- DraftEditor.tsx içinde DraftEditor({ draft, onSave }: { draft: Draft; onSave: (values: { title: string; dueDate: string | undefined }) => void }) bileşenini dışa aktar.
- Draft tipi id, title ve dueDate string alanlarını taşır.
- Alan etiketleri Başlık ve Bitiş tarihi, düğme Kaydet olmalı.

