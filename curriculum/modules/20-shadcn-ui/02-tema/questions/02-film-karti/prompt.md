Bir film kartı açık ve koyu temada aynı anlamsal yüzey renklerini kullansın; çağıran ekran gerektiğinde varsayılan köşe görünümünü değiştirebilsin.

## Gereksinimler
- Semantik `article` içinde `title` değerini ikinci seviye başlık olarak göster.
- Kartta `bg-card`, `text-card-foreground` ve varsayılan `rounded-lg` sınıfları bulunsun.
- Dışarıdan gelen `className` sınıfları varsayılanlarla birleştirilsin; çakışan utility için gelen değer kazansın.

## Örnek
`<ThemeCard title="Dövüş Kulübü" className="rounded-none" />` ikinci seviye başlığı bulunan, keskin köşeli bir kart gösterir.

## Sözleşme
- `ThemeCard.tsx` → `ThemeCard` named export'u.
- Props: `title: string`, `className?: string`.
- Kart `article` rolüyle, başlık `h2` olarak bulunur.
