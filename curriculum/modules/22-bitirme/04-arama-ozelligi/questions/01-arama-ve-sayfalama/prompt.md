Kitaplık’ın ilk gerçek özelliği: Open Library’de arama.

## Davranış

| # | Gereksinim |
| --- | --- |
| 1 | Arama formu en az `/` ve `/search` sayfalarında görünür: erişilebilir adı **Kitap ara** olan bir input ve **Ara** butonu. |
| 2 | Arama **form gönderilince** yapılır (Enter / Ara). Yazarken istek atılmaz. |
| 3 | Gönderince adres `/search?q=<sorgu>` olur. Sorgunun baş/son boşlukları atılır; boş ya da sadece boşluksa hiçbir şey olmaz. Yeni arama 1. sayfadan başlar. |
| 4 | `/search` sayfası `q` ve `page`’i URL’den okur. Sorgu arama kutusunda görünür. Bozuk `page` (`abc`, `0`, `-3`) 1 sayılır. |
| 5 | `q` yoksa istek atılmaz ve **Aramak için bir kitap adı ya da yazar yaz.** metni görünür. |
| 6 | İstek: `GET https://openlibrary.org/search.json?q=<q>&page=<page>&limit=10` (sayfa başına 10 sonuç). |
| 7 | Sonuçlar bir liste (`<ul>`/`<ol>` + `<li>`) olarak görünür. Her öğede: başlık (→ `/works/<id>` linki, id = `key`’in son parçası, örn. `OL893414W`), yazarlar virgülle (`Kevin J. Anderson, Brian Herbert`), ilk yayın yılı, kapak. |
| 8 | Kapak: `<img src="https://covers.openlibrary.org/b/id/<cover_i>-M.jpg">`. `cover_i` yoksa kırık `<img>` yerine yer tutucu. Yazar yoksa **Yazar bilinmiyor**. |
| 9 | Toplam sonuç Türkçe biçimde görünür: `48.232 sonuç`. Sonuç yoksa metinde **sonuç bulunamadı** geçer. |
| 10 | Sayfalama: **Önceki** / **Sonraki** (link ya da buton) ve `Sayfa 1 / 2` metni. İlk sayfada Önceki, son sayfada Sonraki pasif (yok, `disabled` ya da `aria-disabled="true"`). Sayfa değişince URL’ye `page=2` yazılır, `q` korunur. |
| 11 | Yeni sayfa yüklenirken önceki sonuçlar ekranda kalır. |
| 12 | İstek başarısız olursa `role="alert"` bir uyarı ve **Tekrar dene** butonu görünür; butona basınca istek tekrarlanır. |

## Kod sözleşmesi (3. dersten)

Testler uygulamayı şöyle render eder; bu iki export’u koru:

```tsx
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
const router = createMemoryRouter(createRoutes(queryClient), { initialEntries: ['/search?q=dune'] })
render(
  <AppProviders queryClient={queryClient}>
    <RouterProvider router={router} />
  </AppProviders>,
)
```

Testlerdeki `QueryClient`’ta tekrar deneme kapalı. Hata durumunda uyarı ve **Tekrar dene** akışı gecikmeden çalışmalı.

## Testlerin kullandığı sahte veri

Testler gerçek Open Library’ye gitmez; sahte bir Open Library gerçek cevaplardan örneklenmiş iki arama içerir:

- `q=dune` → 10 sonuç (Dune serisi; iki ayrı “Dune” eseri var), `q=herbert` → 11 sonuç (2 sayfa).
- `q=suç ve ceza` → 12 sonuç; bazılarında kapak yok, yazar Kiril alfabesiyle.

Kendi tarayıcında ise gerçek Open Library’yi kullan: `pnpm dev` ile dene, Network sekmesinde istekleri izle.

Bitince commit’le: `git commit -m "feat(search): Open Library araması ve sayfalama"`.
