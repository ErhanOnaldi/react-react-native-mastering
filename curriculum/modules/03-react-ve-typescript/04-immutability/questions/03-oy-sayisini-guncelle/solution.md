## Neden böyle?

Dizinin yalnız dışını kopyalayıp `movie.vote_count++` yapmak iç nesneyi hâlâ mutasyona uğratır. `map` yeni dizi, object spread ise değişen film için yeni nesne oluşturur. Değişmeyen film aynı referansta kalabilir. Bu yaklaşım Sinema’daki daha karmaşık yerel state değişikliklerinin temelidir.
