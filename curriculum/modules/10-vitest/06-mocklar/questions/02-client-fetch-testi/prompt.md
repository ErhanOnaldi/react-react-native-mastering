Sinema’nın ortak API client’ı arama isteğini doğru parametrelerle ve yetkilendirmeyle göndermeli, başarılı cevabı çağırana korumalı. Testi gerçek ağa bağımlı kılma.

## Gereksinimler

- /search/movie yoluna query Başlangıç ve page 2 değerleriyle istek gönderilmeli.
- Authorization başlığı Bearer test-token olmalı.
- Sahte yanıttaki Başlangıç filmi sonuçta korunmalı.
- Her testten sonra global fetch eski değerine dönmeli.

## Örnek

İstek girdisi: query Başlangıç, page 2.
Yanıt: results içinde id 27205 ve title Başlangıç olan film.
Beklenen: sonuçtaki film aynı id ve başlığı taşır.

## Sözleşme

- Yazılacak dosya: tmdbClient.test.ts
- Test edilecek modül: @impl/tmdbClient
- Çağrı: tmdbClient.get<T>(path, params?)

## Kısıtlar

- URL query parametrelerinin sırasına bağlanma.
- Gerçek TMDB servisine istek gönderme.
