Film listesi için başlığın ve boş sonuç mesajının doğru durumda göründüğünü test et.

## Gereksinimler
- Tek film olduğunda film adı bir başlık olarak görünür.
- Liste boş olduğunda “Film bulunamadı” durum mesajı görünür.
- Boş listede film başlığı bulunmaz.

## Örnek
`movies=[]` → “Film bulunamadı”; `movies=[Matrix]` → “Matrix” başlığı.

## Sözleşme
- `MovieResults.test.tsx` dosyasına test yaz.
- Bileşen `@impl/MovieResults` yolundan import edilir ve `movies` prop’u alır.
- Film girdisi en az `{ id: number, title: string }` alanlarını taşır.
- Başlık heading rolüyle; boş mesaj status rolüyle sunulur.

## Kısıtlar
- İki mutantın her birini yakalayacak beklenti yaz.
