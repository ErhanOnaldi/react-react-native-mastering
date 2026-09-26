## Neden böyle?

Seçili id dizisi tek state'tir. Sayaç o dizinin uzunluğudur; ayrı state'e kopyalanırsa seçim ve temizleme yollarının ikisinde de güncellenmesi gerekir. Checkbox'ların `checked` değeri de aynı listeden gelir.

Alternatif olarak seçili id'leri `Set` ile tutup her değişimde yeni `Set` oluşturabilirsin. Aynı `Set`'i yerinde değiştirmek React'in güncellemeyi kaçırmasına yol açabilir. Modül 6'da filtre değerleri URL'den geldiğinde de sayaç gibi özetler ayrı state değil, kaynak değerden hesaplanacak.
