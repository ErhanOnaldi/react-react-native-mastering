Arama hook'u hızlı yazmayı, boş sorguyu, ağ cevabını ve hatayı tek sözleşmede birleştirecek. Hook son kararlı sorgu için film başlıklarını döndürsün.

## Gereksinimler

- Boş sorguda durum `idle` olur ve istek atılmaz.
- Hızlı değişen sorgularda yalnızca son metin için arama isteği atılır.
- Başarılı cevapta durum `success` olur ve `titles` dizisi dolu gelir.
- HTTP hatası durumunda `status: "error"` ve hata mesajı döner.
- Yeni geçerli sorgu geldiğinde önceki ağ işi ekrana yazmamalı.
- TMDB araması yetkilendirme başlığıyla yapılır.

## Örnek

`"" → "M" → "Ma" → "Matrix"` hızlı geçişinde yalnızca `query=Matrix` isteği gözlenir. Başarıda `titles` içinde en az bir başlık vardır.

## Sözleşme

- Dosya ve export: `useMovieSearch.ts` → `useMovieSearch(query: string, wait?: number): SearchState`
- `SearchState.status`: `"idle" | "loading" | "success" | "error"`
- Testler hook'u `renderHook` ile çalıştırır ve `/search/movie` isteklerini kontrol eder.
