## Neden böyle?

`useSuspenseQuery` bekleyen Promise’i en yakın `Suspense` sınırına, hatayı hata sınırına taşır. Bu yüzden iki sarmalayıcı içerik bileşeninin dışında durur; içerik yalnızca hazır film verisini çizer. Aynı `['movie', id]` key’i her film için ayrı cache kaydı tutar.
