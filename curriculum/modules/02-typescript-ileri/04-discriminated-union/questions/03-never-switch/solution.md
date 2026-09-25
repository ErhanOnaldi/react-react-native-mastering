## Neden böyle?

- **Alternatif:** Zincirleme `if` de çalışır; `switch` her literal durumu görünür kılar.
- **Tuzak:** `default` dalında sessiz bir string döndürmek gelecekte eklenen durumu gizler.
- **Sektörde:** Exhaustive kontrol büyük state makinelerinde refactor güvenliği sağlar.
- **Sonraki adım:** Pekiştirmede aynı yaklaşımı reducer action’larına uygulayacaksın.
