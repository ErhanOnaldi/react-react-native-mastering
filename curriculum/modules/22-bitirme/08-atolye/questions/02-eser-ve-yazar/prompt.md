Eser sayfasında bir kitaptan diğerine geçince başlık değişiyor ama yazar bilgisi bir önceki kitapta kalıyor. Bir kitaba git, sonra başka bir kitaba geç: yazar hâlâ ilk kitabınkini gösteriyor. Geri döndüğünde de aynı karışıklık sürüyor.

## Giriş ve tekrar adımları

Testler `BookDetail.tsx` içindeki `BookDetail` bileşenini, eser kimliğini adres çubuğundan alacak şekilde açar.

1. Bir esere git; başlık ve o esere ait yazar görünür.
2. Farklı bir esere geç: başlık doğru güncellenir ama yazar bilgisi eskisinde kalıyor.
3. Geri dönünce de gösterilen yazar, üzerinde durulan esere ait değil.

`BookDetail.tsx` bu belirtiden kurtulmalı: hangi eser açıksa, yazar bilgisi de ona ait olmalı.
