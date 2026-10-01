Sinema'da bir film için başlık, yıl, puan ve kısa açıklamayı aynı kartta göster. Kart açık ve koyu temada aynı anlamsal yüzey renklerini kullansın; çağıran ekran gerektiğinde varsayılan köşe görünümünü değiştirebilsin.

## Gereksinimler
- Semantik `article` içinde `title` değerini ikinci seviye başlık olarak, `year` ve `rating` değerlerini ayrı metinler olarak, `overview` değerini paragraf olarak göster.
- Kartta `bg-card`, `text-card-foreground`, `rounded-lg` ve `p-4` sınıfları bulunsun.
- Dışarıdan gelen `className` sınıfları varsayılanlarla birleştirilsin; çakışan utility için gelen değer kazansın.

## Örnek
`<ThemeCard title="Dövüş Kulübü" year={1999} rating={8.8} overview="Bir kulüpte başlayan hikâye." className="rounded-none" />` bu bilgileri gösteren, keskin köşeli bir kart üretir.

## Sözleşme
- `ThemeCard.tsx` → `ThemeCard` named export'u.
- Props: `title: string`, `year: number`, `rating: number`, `overview: string`, `className?: string`.
- Kart `article` rolüyle, başlık `h2` olarak bulunur.
