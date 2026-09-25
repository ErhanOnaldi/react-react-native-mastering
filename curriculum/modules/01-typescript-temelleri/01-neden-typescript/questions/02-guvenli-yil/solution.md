## Neden böyle?

Tip, `relese_date` yazım hatasını yakalar; boş string ise geçerli bir string olduğundan davranış kontrolü gerekir. `Date` nesnesi beklemiyoruz; TMDB JSON tarihi metindir. İleride API cevabını ayrıca doğrulayacağız.

`any` veya tip iddiası ile hatayı saklamak yerine verinin olası durumlarını modelle.
