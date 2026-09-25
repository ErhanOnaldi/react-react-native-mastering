---
title: "Tek bir TMDB kapısı"
minutes: 10
kind: concept
---

# Tek bir TMDB kapısı

:::pain[Problem]
Detay sayfası Bearer başlığını ekliyor, arama sayfası unutuyor: sahte TMDB birinde 200, ötekinde 401 dönüyor. Hata mesajları da dört yerde farklı.
:::

## İhtiyaçtan karar

`tmdbClient.get<T>(path, params?)` URL, `language=tr-TR`, Bearer ve HTTP kontrolünü toplar. Başarısız cevap için `ApiError(status, statusCode, message)` fırlatır. Feature API fonksiyonları bu kapıyı kullanır.

## Sinema’da dene

Client ağ sözleşmesidir; `getTrendingMovies(page)` gibi film anlamını `features/movies/api/movies-api.ts` taşır. `T` derleme zamanı vaadidir, çalışma zamanında JSON doğrulaması değildir; bunu modül 15’te Zod ile ekleyeceğiz.

## HTTP ile film anlamını ayır

```ts check
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusCode: number | null,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function getMovieDetails(client: { get<T>(path: string): Promise<T> }, id: number) {
  return client.get<{ id: number; title: string }>(`/movie/${id}`)
}
```

Önce bir sayfada `fetch` ve `response.ok` ile çalışan akışı düşün. İkinci sayfada aynı Bearer ve dil satırları kopyalandığında ortak client ihtiyacı doğar. `ApiError`, yalnız “istek başarısız” demek yerine HTTP `status` ve TMDB `status_code` değerlerini birlikte taşır. Böylece 404 için “film bulunamadı”, 401 için kimlik bilgisi uyarısı gösterebilirsin; bu karar yine UI’ya aittir.

`get<T>` kullanmak `as T` gibi derleme zamanı bilgisidir. Sunucu beklenmedik JSON döndürürse TypeScript onu çalışma anında durdurmaz. Önce merkezî hata ve tip sınırını kuruyoruz; veri doğrulaması modül 15’te ayrı bir ihtiyaç olarak gelecek.

:::mistake[Sık hata]
`fetch` 404’te otomatik reject etmez: `response.ok` kontrol edilmelidir. Token’ı query string’e koyma; test sunucusu Bearer bekler.
:::

:::sector[Sektörde]
İstemciye verilen Vite env değeri gizli sır değildir. Bu yerel projede TMDB token’ı doğrudan kullanıyoruz; üretimde proxy/BFF sınırı düşünülür.
:::
