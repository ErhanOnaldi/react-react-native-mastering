## Neden böyle?

- **Alternatif:** Yalnız `Movie` alanlarını destekleyen seçici başka nesnede kullanılamazdı.
- **Tuzak:** `T[keyof T]` bütün değerlerin union’ıdır; seçilen `K` ile `T[K]` daha kesindir.
- **Sektörde:** Tipli seçiciler sıralama ve tablo sütunu ayarlarında kullanılır.
- **Sonraki adım:** Sonraki görevde izin verilen anahtarları sabit bir diziden türeteceksin.
