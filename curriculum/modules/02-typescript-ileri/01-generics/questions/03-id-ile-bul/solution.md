## Neden böyle?

- **Alternatif:** Fonksiyonu yalnız `Movie[]` için yazmak tür ve kadro listesinde tekrar kod üretirdi.
- **Tuzak:** Kısıtsız `T` ile `item.id` güvenli değildir; `extends` gereken asgari alanı söyler.
- **Sektörde:** Küçük generic yardımcılar farklı veri modellerinde ortak kalabilir.
- **Sonraki adım:** Bir sonraki görevde bu aramayı `Paginated<T>` içinde kullanacaksın.
