---
title: "Generics: aynı kabuk, farklı veri"
minutes: 8
kind: concept
---

# Generics: aynı kabuk, farklı veri

:::pain[Problem]
Trend ve popüler cevapları için ayrı ayrı `page`, `results`, `total_pages`, `total_results` yazdın. Bir alana yapılan düzeltme öteki cevapta unutuldu.
:::

## Generic düşüncesi

Generic, tek bir tip tanımını farklı veri tipleriyle yeniden kullanmanın yoludur. Bir fonksiyonun veya nesnenin hangi veriyle çalışacağı tanım sırasında bilinmeyebilir; tip parametresi bu bilgiyi kullanım anına erteler. Böylece ortak yapı bir kez yazılır, içindeki veri tipi ise her kullanımda korunur.

Önceki modülde `Movie` gibi somut nesne tipleri kurdun. Şimdi o tipleri sayfalama gibi tekrar eden bir yapının içine yerleştireceksin. Sinema'daki iki cevap yalnızca bu genel fikrin örneği: aynı yaklaşım ürün, kullanıcı veya yorum listelerinde de geçerlidir.

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
