## Neden böyle?

Tip, `relese_date` yazım hatasını yakalar; boş string ise geçerli bir string olduğundan davranış kontrolü gerekir. `Date` nesnesi beklemiyoruz; TMDB JSON tarihi metindir. İleride API cevabını ayrıca doğrulayacağız.

## Alternatif ve dikkat

Alan adını serbest string ile okumak kısa görünür, ama yazım hatasını gizler. Boş string için erken dönüş yap; `slice` kendiliğinden kullanıcıya anlamlı metin üretmez.

## Sektörde ve devamında

Kart etiketinde de aynı tarih kararını kullanacaksın.
