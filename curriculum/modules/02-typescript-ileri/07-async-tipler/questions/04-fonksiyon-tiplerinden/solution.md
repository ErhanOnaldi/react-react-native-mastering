## Neden böyle?

- **Alternatif:** Parametre ve dönüş tiplerini elle kopyalamak fonksiyon değişince eskir.
- **Tuzak:** `Awaited` yalnız tip düzeyinde Promise’i açar; runtime `await` değildir.
- **Sektörde:** Kütüphane fonksiyonlarından tip türetmek ortak kod tabanlarında yaygındır.
- **Sonraki adım:** Tipli API client kurarken aynı imza türetimini yeniden kullanacaksın.
