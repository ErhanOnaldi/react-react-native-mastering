## Sorun
Kart testlerinde 16 alanlı film nesnesini kopyalamak poster’sız ve boş tarih vakalarını görünmez kılıyor.

## Görev
`makeMovie(overrides: Partial<TmdbListMovie> = {}): TmdbListMovie` yaz. Geçerli varsayılanlar kullan: id 550, title "Dövüş Kulübü", `poster_path` string veya null sözleşmesine uygun, `release_date` string. Diğer zorunlu TMDB liste alanlarını da doldur. En sonda overrides uygula; her çağrıda yeni nesne ve yeni `genre_ids` dizisi üret.

## Örnek
`makeMovie({ poster_path: null, release_date: '' })` → bu alanlar aynen kalır; diğer alanlar geçerlidir.
