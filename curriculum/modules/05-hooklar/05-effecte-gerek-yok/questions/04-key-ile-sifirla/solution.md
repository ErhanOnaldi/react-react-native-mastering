Key yalnızca listeler için değil, bileşen kimliği için de kullanılır. Bütün yerel state’in sıfırlanması isteniyorsa açık çözümdür. Yalnızca tek alanı koruyup diğerini sıfırlamak istenirse state tasarımını ayrıca düşün.

## Alternatif ve tuzak

Notu effect’te boşaltmak yeni film için bir render boyunca eski notu gösterebilir. Key bütün alt state’i sıfırlar; yalnızca seçili alanı sıfırlamak istiyorsan state sınırını değiştir.

## Sektörde ve sonra

Detay sayfası route parametresine geçtiğinde aynı kimlik sorunu tekrar doğabilir.
