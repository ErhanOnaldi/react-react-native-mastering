## Neden böyle?

- **Alternatif:** Serbest `Record<number,string>` bütün tür ID’lerinin mevcut olmasını garanti etmez; literal ID union daha sıkıdır.
- **Tuzak:** `Readonly` derleme zamanında yeniden atamayı önler, nesneyi runtime’da dondurmaz.
- **Sektörde:** Sabit eşleme tabloları UI etiketlerinde sık kullanılır.
- **Sonraki adım:** `satisfies` dersinde aynı tabloyu literal değerleri koruyarak yeniden kuracaksın.
