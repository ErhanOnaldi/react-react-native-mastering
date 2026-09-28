Sinema'da iki yol sayfalı liste, bir yol tek film ayrıntısı döndürüyor. Seçilen yolun cevabı doğru biçimde eşleşmeli; liste ve detay birbirinin yerine kullanılamaz.

## Gereksinimler

- `/trending/movie/week` ve `/movie/popular` sayfalı film cevabı olmalı.
- `/movie/550` film ayrıntısı ve `runtime: number | null` taşımalı.
- Yol ile dönen cevabın tipi birbirine bağlı olmalı.
- Verilen cevap haritasından seçilen yolun değerini döndürmeli.

## Örnek

`/movie/550` yolu ayrıntı nesnesini; `/movie/popular` yolu `results` içeren sayfayı döndürür.

## Sözleşme

- Dosya: `task.ts`
- Export tipleri: `Movie`, `MovieDetails`, `Paginated<T>`, `EndpointMap`.
- Export fonksiyon: `readEndpoint<K extends keyof EndpointMap>(path: K, responses: EndpointMap): EndpointMap[K]`.
