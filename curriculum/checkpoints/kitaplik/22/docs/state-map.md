# Kitaplık — State haritası

Her bilginin **tek bir sahibi** var. Bir değer başka bir değerden hesaplanabiliyorsa saklanmaz, türetilir.

| Bilgi                            | Kategori       | Sahibi (nerede yaşar)                     | Okuyan                                       | Yazan                            | Kalıcılık                              |
| -------------------------------- | -------------- | ----------------------------------------- | -------------------------------------------- | -------------------------------- | -------------------------------------- |
| Arama sorgusu `q`                | URL            | `/search?q=`                              | SearchPage, SearchForm                       | SearchForm (navigate)            | Adres çubuğu / geçmiş                  |
| Sayfa `page`                     | URL            | `/search?…&page=`                         | SearchPage                                   | Sayfalama linkleri               | Adres çubuğu / geçmiş                  |
| Liste filtresi `status`          | URL            | `/reading-list?status=`                   | ReadingListPage                              | Filtre linkleri                  | Adres çubuğu / geçmiş                  |
| Eser id'si                       | URL (path)     | `/works/:workId`                          | WorkPage                                     | Sonuç linkleri                   | Adres çubuğu                           |
| Arama sonuçları                  | Sunucu         | Query cache `['books','search',{q,page}]` | SearchPage                                   | Open Library                     | Bellek (staleTime 5 dk)                |
| Eser detayı                      | Sunucu         | Query cache `['books','work',id]`         | WorkPage                                     | Open Library                     | Bellek (30 dk)                         |
| Yazar adı                        | Sunucu         | Query cache `['authors',id]`              | WorkPage                                     | Open Library                     | Bellek (süresiz taze)                  |
| Okuma listesi                    | İstemci        | `ReadingListProvider` (useReducer)        | RootLayout, ReadingListPage, ReadingListForm | ReadingListForm, ReadingListPage | `localStorage` `kitaplik:reading-list` |
| Form alanları (durum, puan, not) | Form           | React Hook Form (`useForm`)               | ReadingListForm                              | Kullanıcı                        | Yok (gönderilince listeye yazılır)     |
| Arama kutusunun anlık değeri     | Form / DOM     | Kontrolsüz `<input>`                      | —                                            | Kullanıcı                        | Yok                                    |
| "Okuma listem (n)" sayısı        | **Türetilmiş** | `entries.length`                          | RootLayout                                   | —                                | Saklanmaz                              |
| Toplam sayfa                     | **Türetilmiş** | `ceil(total / 10)`                        | SearchPage                                   | —                                | Saklanmaz                              |
| Yükleniyor / hata                | **Türetilmiş** | Query durumu (`isPending`, `isError`)     | Sayfalar                                     | —                                | Saklanmaz                              |
| Kapak adresi                     | **Türetilmiş** | `coverUrl(coverId, size)`                 | BookCover                                    | —                                | Saklanmaz                              |

## Akış

```
Kullanıcı ──yazar/Enter──▶ SearchForm ──navigate──▶ URL (?q, ?page)
                                                     │
                                                     ▼
                            SearchPage ──useQuery(bookQueries.search)──▶ Query cache ◀──▶ Open Library
                                │
                         link /works/:id
                                ▼
WorkPage ──useQuery(work) + useQueries(authors)──▶ Query cache ◀──▶ Open Library
   │
   └─ ReadingListForm (RHF + Zod) ──upsert──▶ ReadingListProvider ──effect──▶ localStorage
                                                   │
                                  RootLayout (sayı) + ReadingListPage (liste, ?status)
```

## Kurallar

1. Sunucudan gelen veri asla `useState`'e kopyalanmaz.
2. URL'de olan bir şey başka bir yerde tekrar tutulmaz.
3. Okuma listesine yalnızca `useReadingList()` üzerinden erişilir.
