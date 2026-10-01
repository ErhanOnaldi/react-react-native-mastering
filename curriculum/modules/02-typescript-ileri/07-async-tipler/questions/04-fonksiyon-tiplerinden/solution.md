## Neden böyle?

- **Alternatif:** Promise'in çözülen değerini ayrıca elle yazabilirdin; `Awaited` bu iki tipi bağlı tutar.
- **Tuzak:** `Awaited` yalnızca tipi açar; runtime'da bekleme işlemini `await` yapar.
- **Neden `movieLabel` bu tipi alıyor?** Bekleme sonrası elde ettiğin değerin `Movie` alanlarına sahip olduğunu TypeScript de bilir.
- **Sektörde:** Bir async fonksiyonun dönüş tipi, çağıranın `await` sonrasında kullanacağı değeri belirtir.
- **Sonraki adım:** İstek cevabını dış veri olarak ele alırken Promise tipiyle runtime doğrulamasını ayrı tut.
