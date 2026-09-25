## Neden böyle?

Cache’den silmek sunucudaki puanı değiştirmez. DELETE sonucu başarılı olsa bile okuma cache’i eski kalabilir; ikinci görevde invalidation ile birleştireceksin. `fetch` 401’de reject etmediği için açık hata kontrolü şart.
