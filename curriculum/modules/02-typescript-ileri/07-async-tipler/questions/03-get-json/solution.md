## Neden böyle?

- **Alternatif:** Doğrudan `response.json()` döndürmek 404/401 hata JSON’unu başarı sanabilir.
- **Tuzak:** `as T` çağıranın iddiasıdır; sunucu cevabını doğrulamaz.
- **Sektörde:** HTTP client’larında Bearer başlığı ve `response.ok` kontrolü temel sınırdır.
- **Sonraki adım:** 15. modülde `unknown` JSON’u Zod ile parse ederek bu iddiayı kanıtlayacaksın.
