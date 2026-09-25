`keyof T` geçerli anahtarları, `T[K]` seçilen anahtarın değer tipini taşır. `T[keyof T]` yazmak bütün alanların union'ını döndürürdü; seçimin kesinliği kaybolurdu.
