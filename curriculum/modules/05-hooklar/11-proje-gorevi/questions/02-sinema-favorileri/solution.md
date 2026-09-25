Context prop drilling acısını azaltır; değeri kullanan kartlar favori değişiminde yeniden render olur. Bu kabul edilebilir küçük bir global durumdur. Büyük uygulamada Context’i sınırlı tutmak gerekir.

## Alternatif ve tuzak

Provider’ın dışında kullanılan hook açıklayıcı hata vermeli. Tekrarlanan id ekleme veya dizi mutasyonu favori görünümünü tutarsızlaştırır.

## Sektörde ve sonra

Router geldiğinde provider’ı sayfalar arasında yaşayan ağacın üstünde tutman gerekecek.
