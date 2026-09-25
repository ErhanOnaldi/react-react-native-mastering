## Neden böyle?

`setQueryData` elindeki kesin veriyi ek GET olmadan gösterir. Dizi ve öğeyi kopyalamak observer’ların değişimi görmesini sağlar. Listede hiç olmayan filme yalnız `{id,rating}` eklemek sunucunun başlık, sıralama ve sayfalama bilgisini uydurmak olur. Böyle durumda invalidation daha güvenlidir.
