Film detayına doğrudan bir adresle girildiğinde doğru statik kaydı göster. Hatalı adres ve listede bulunmayan film için açıklayıcı durum sun.

## Gereksinimler

- Adresteki pozitif tam sayı kimliği `movies` içindeki filmle eşleştiğinde başlığı `<h1>` içinde göster.
- Sayısal olmayan veya eksik kimlikte `Geçersiz film adresi` metnini göster.
- Sayısal biçimi geçerli ama listede bulunmayan kimlikte `Film bulunamadı` metnini göster.

## Örnek

`/movie/603` → `Matrix`; `/movie/xyz` → `Geçersiz film adresi`; `/movie/999` → `Film bulunamadı`.

## Sözleşme

- `MovieDetails.tsx` içinden `MovieDetails` named export edilir.
- Prop: `movies: { id: number; title: string }[]`.
- Route deseni `/movie/:id` olarak açılır.
