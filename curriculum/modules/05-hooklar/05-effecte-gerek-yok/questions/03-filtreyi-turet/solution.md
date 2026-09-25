Türetilmiş veri için ikinci state iki doğru kaynak yaratır. Prop değiştiği render’da hesaplamak anında doğru ekran verir. Gerçekten pahalı hesap ölçülürse daha sonra memoization değerlendirilir; burada gereksizdir.

## Alternatif ve tuzak

Effect ve ikinci state, kısa süreli eski liste gösterebilir. Basit `filter` için memoization da gerekmez.

## Sektörde ve sonra

URL’den gelen query ile filtreleme Router modülünde aynı ilkeyi yeniden kullanacak.
