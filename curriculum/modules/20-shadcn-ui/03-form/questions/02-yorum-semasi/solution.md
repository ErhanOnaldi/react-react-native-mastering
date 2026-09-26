## Neden böyle?
Kullanıcı şemayı hiç görmez; yalnızca `FormMessage`'ın gösterdiği metni görür. Mesaj vermediğin her kural, ekrana Zod'un İngilizce ve teknik varsayılanını taşır.

Zod 4'te iki düzey var:
- **Kontrol düzeyi**: `.min(1, { error: 'Yorum gerekli' })`: yalnızca o kontrol düştüğünde.
- **Şema düzeyi**: `z.number({ error: 'Puan seç' })`: tip uymadığında (değer yok, `NaN`, string). Formda "hiç seçilmedi" durumu tam olarak budur.

Öncelik kontrol düzeyinden şema düzeyine doğrudur; birini verip diğerini boş bırakmak, bazı durumlarda yine İngilizce mesaj demektir.

### Zod 3'ten gelenler için
`required_error`, `invalid_type_error` ve `errorMap` Zod 4'te `error` parametresinde birleşti. Fonksiyon da verebilirsin: `z.number({ error: (issue) => issue.input === undefined ? 'Puan seç' : 'Puan sayı olmalı' })`.

### Sık hata
`trim()`'i `min()`'den sonra yazmak: `'   '` önce uzunluk kontrolünden (3 karakter) geçer, sonra boş stringe dönüşür. Sıra önemli; önce temizle, sonra ölç.

### Sıradaki adım
Sonraki görevde bu şemayı kullanan formun **parçalarını** (FormItem, FormLabel, FormControl, FormMessage) kendin yazacaksın.
