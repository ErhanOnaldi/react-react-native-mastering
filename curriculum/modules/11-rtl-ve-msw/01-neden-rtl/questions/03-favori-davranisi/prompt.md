## Sorun
Sinema’da favori butonunun handler’ını doğrudan çağıran test geçiyor; buton disabled olsa bile bunu kaçırıyor.

## Görev
`@impl/FavoriteButton` bileşenine kullanıcı odaklı test yaz. Başta "Favorilere ekle" butonunu rol ve adıyla bul, tıkla ve callback’e film id’si 550 gittiğini sına. Favori durumunda "Favorilerden çıkar" adını da doğrula. CSS class’ı sorgulama.

## Örnek
`<FavoriteButton movieId={550} isFavorite={false} onToggle={fn} />` → tıklama sonrası `fn(550)`.

Mutant etiketlerini okuyup testlerinin her iki hatayı yakalamasını sağla.
