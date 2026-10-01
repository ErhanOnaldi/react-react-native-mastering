Yeni izleme listesi adı boş olmasın; kayda gitmeden önce kenar boşlukları temizlensin.

## Gereksinimler
- Liste adı alanı boş veya yalnızca boşluksa gönderim yapılmaz ve Ad gerekli mesajı görünür.
- Geçerli adın başındaki ve sonundaki boşluklar kaldırılarak onSave callback'ine gönderilir.
- Input label'ı Liste adı, gönderme düğmesi Kaydet olmalı.

## Örnek
Kullanıcı "  Klasikler  " yazıp Kaydet'e basınca callback "Klasikler" alır.

## Sözleşme
- WatchlistForm.tsx dosyasında WatchlistForm({ onSave }: { onSave: (name: string) => void }) named export bileşenini tanımla.
- Hata, role=alert ile bulunabilir olmalı.

