## Neden böyle?

- **Alternatif:** `as MovieBrief` ile zorlamak hiç runtime kontrolü yapmaz.
- **Tuzak:** Guard imzası tek başına kanıt değildir; gövde yanlışsa 401 verisi içeri sızar.
- **Sektörde:** Küçük guard’lar sınırda kritik birkaç alanı korumak için uygundur.
- **Sonraki adım:** Tam JSON doğrulamasını 15. modülde Zod şemasıyla yapacaksın.
