## Neden böyle?

- **Alternatif:** `JSON.parse` sonucunu `unknown` tutup çağırana doğrulatabilirdin; burada generic `T` yalnızca dönüş tipini gösterir.
- **Tuzak:** `as T` çağıranın iddiasıdır; JSON alanlarını kontrol etmez.
- **Sektörde:** JSON metnini okumak ile verinin beklenen şekle uyduğunu doğrulamak ayrı işlerdir.
- **Sonraki adım:** Runtime şema doğrulamasını Zod modülünde öğreneceksin.
