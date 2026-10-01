Sinema'nın film yükleyicisi bir süre sonra film bilgisi döndürür. Bu Promise'in tipini ve bekleme sonrasında gelen film tipini ayrı ayrı tanımla.

## Gereksinimler

- `Movie` tipi `{ id: number; title: string }` olmalı.
- `MoviePromise`, `Promise<Movie>` ile aynı tip olmalı.
- `LoadedMovie`, `MoviePromise` çözüldüğünde gelen değer tipi olmalı.
- `loadMovie()` bir filmi asenkron olarak döndürmeli.
- `movieLabel(movie)` `"<başlık> (#<id>)"` biçiminde metin üretmeli.

## Örnek

`loadMovie()` çağrısının tipi `Promise<Movie>`; sonucunu beklediğinde `Movie` gelir. Bu film için `movieLabel` sonucu `"Dövüş Kulübü (#550)"` olur.

## Sözleşme

- Dosya: `task.ts`.
- Export tipleri: `Movie`, `MoviePromise`, `LoadedMovie`.
- Export fonksiyonlar: `loadMovie(): MoviePromise`, `movieLabel(movie: LoadedMovie): string`.
