## Neden böyle?

POST ve DELETE aynı listeyi etkiler ama hata halinde invalidation yapmamak gereksiz GET’i önler. Key içinde sessionId bulunması farklı oturumların cache’lerini ayırır. Form modülünde aynı mutation kalıbını yorum gönderme için kullanacaksın.
