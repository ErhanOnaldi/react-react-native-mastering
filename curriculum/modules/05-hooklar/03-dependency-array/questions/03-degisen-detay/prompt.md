Film detayı aynı bileşen açıkken farklı bir film kimliği alabilir. `MovieDetails`, prop değiştiğinde eski başlıkta takılı kalmadan yeni filmin başlığını göstermeli.

## Gereksinimler

- İlk render `id={550}` ile `Dövüş Kulübü` başlığını gösterir.
- Aynı bileşen `id={27205}` ile yeniden render edildiğinde `Başlangıç` başlığı görünür.
- Yeni kimlik için `/movie/27205` isteği atılır.
- TMDB yetkilendirme başlığı korunur.

## Örnek

`<MovieDetails id={550} />` → `Dövüş Kulübü`; aynı instance `<MovieDetails id={27205} />` olduğunda → `Başlangıç`.

## Sözleşme

- Dosya ve export: `MovieDetails.tsx` → `MovieDetails`
- Prop: `{ id: number }`
- Testler başlığı metin olarak ve `/3/movie/27205` isteğini kontrol eder.
