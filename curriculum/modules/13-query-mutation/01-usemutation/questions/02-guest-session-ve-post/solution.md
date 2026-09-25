## Neden böyle?

`getGuestSession` oturumu yeniden kullanır; her tıklamada yeni oturum açmak farklı puan listeleri yaratır. `fetch` 400/500 için kendiliğinden reject etmez, `response.ok` şarttır. Gerçek projede ortak `tmdbClient` kullanılabilir; burada HTTP akışını açık görüyorsun. Sonraki görevde bu fonksiyonu mutation’a bağlayacaksın.
