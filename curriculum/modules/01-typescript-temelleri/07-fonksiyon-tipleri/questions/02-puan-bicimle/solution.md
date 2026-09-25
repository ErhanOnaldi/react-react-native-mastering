## Neden böyle?

`toFixed` string döndürür; kullanıcıya görünen sondaki sıfırı korur. `digits?: number` tek başına varsayılan değeri uygulamaz. Projede bu fikri `formatVote` adına taşıyacaksın.

## Alternatif ve dikkat

`Math.round` sayı üretir; `toFixed` kullanıcıya gereken tek ondalıklı metni korur. 0 değerini diğer puanlarla aynı biçimlemek “henüz oy yok” anlamını siler.

## Sektörde ve devamında

Projede aynı davranış `formatVote` adıyla ortak kullanılacak.
