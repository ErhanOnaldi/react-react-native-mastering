## Neden böyle?

Normalize etmek API modelini değiştirmek değildir; görünüm için yeni bir nesne üretirsin. Kaynak veriyi mutasyona uğratma. Aynı sınırda ileride gerçek API cevabını da doğrulayacağız.

## Alternatif ve dikkat

Kaynak nesneyi değiştirmek yerine yeni nesne üretmek React state ile uyumludur. Null ve boş string posteri aynı fallback’e yönlendirirken dolu yolu koru.

## Sektörde ve devamında

Gerçek kart bileşeni `DisplayMovie` üzerinden kendi fallback görselini seçebilir.
