---
title: "Generics: aynı kabuk, farklı veri"
minutes: 8
kind: concept
---

# Generics: aynı kabuk, farklı veri

:::pain[Problem]
Trend ve popüler cevapları için ayrı ayrı `page`, `results`, `total_pages`, `total_results` yazdın. Bir alana yapılan düzeltme öteki cevapta unutuldu.
:::

## Önce bildiğin yöntem

`MovieListResponse` ve `GenreListResponse` ayrı tipler olabilir. Ama ikisinde de aynı dört sayfalama alanı tekrar eder. `results` değişirken kabuk aynı kalır.

## Generic kabuk

```ts check
type Paginated<T> = { page: number; results: T[]; total_pages: number; total_results: number }
type Movie = { id: number; title: string }
type MovieListResponse = Paginated<Movie>
const response: MovieListResponse = { page: 1, results: [{ id: 550, title: 'Dövüş Kulübü' }], total_pages: 2, total_results: 21 }
const title: string = response.results[0].title
```

`T` bir değer değil, tip parametresidir. `Paginated<Movie>` ile kabuğun `results` alanına `Movie` yerleştirirsin. Generic fonksiyon ise girdi tipini çıktıya taşıyabilir; `any` gibi bilgiyi silmez.

## Yeni ihtiyaç: kısıt

Her öğeden `id` almak istersen rastgele `T` yetmez. `T extends { id: number }` diyerek fonksiyonun gerçekten kullanacağı özelliği şart koş. `extends` burada sınıf kalıtımı değil, tip uyumluluğu sınırıdır.

:::mistake
`Paginated<any>` yazarsan `results[0].olmayanAlan` bile geçer. Bu modülde kurduğumuz güvenlik duvarı kaybolur.
:::

:::sector
API client'larında generic cevap kabukları yaygındır. `T` ağdan gelen veriyi doğrulamaz; yalnızca kodun içinde kabul ettiğin biçimi ifade eder.
:::
