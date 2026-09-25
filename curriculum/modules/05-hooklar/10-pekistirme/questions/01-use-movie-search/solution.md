Bu soru timer cleanup, fetch cleanup ve reducer’ı bir araya getirir. İki ayrı effect’in farklı dış sistemlere senkron olduğunu gör: biri saat, biri ağ. Gerçek arama ekranında cache ve tekrar deneme eksikliği daha sonra görünür.

## Alternatif ve tuzak

Timer ve ağ effect’ini tek effect’e toplamak hangi cleanup’ın neyi durdurduğunu belirsizleştirir. Eski isteğin AbortError’ı error action’ı değildir.

## Sektörde ve sonra

Arama ekranında controlled input bu hook akışını kullanıcının yazmasıyla sınayacak.
