## Neden böyle?
Kullanıcı şemayı hiç görmez; yalnızca `FormMessage`'ın gösterdiği metni görür. Bu yüzden her geçersiz durumun kısa Türkçe bir mesajı olmalı.

Zod 4'te iki düzey var:
- **Kontrol düzeyi**: `.min(1, { error: 'Yorum gerekli' })`: yalnızca o kontrol düştüğünde.
- **Şema düzeyi**: `z.number({ error: 'Puan seç' })`: tip uymadığında (değer yok, `NaN`, string). Formda "hiç seçilmedi" durumu tam olarak budur.

Öncelik kontrol düzeyinden şema düzeyine doğrudur; birini verip diğerini boş bırakmak, bazı durumlarda yine İngilizce mesaj demektir. `trim()` önce gelir; böylece yalnızca boşluk içeren yorum temizlendikten sonra `min(1)` kuralına takılır.

### Zod 3'ten gelenler için
`required_error`, `invalid_type_error` ve `errorMap` Zod 4'te `error` parametresinde birleşti. Fonksiyon da verebilirsin: `z.number({ error: (issue) => issue.input === undefined ? 'Puan seç' : 'Puan sayı olmalı' })`.

### Sık hata
`trim()`'i `min()`'den sonra yazmak: `'   '` önce uzunluk kontrolünden (3 karakter) geçer, sonra boş stringe dönüşür. Sıra önemli; önce temizle, sonra ölç.

### Sıradaki adım
Sonraki görevde bu şemayı, hazır form parçalarını bir araya getirerek kullanacaksın.
