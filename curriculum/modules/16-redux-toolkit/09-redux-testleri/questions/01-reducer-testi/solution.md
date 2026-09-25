## Neden böyle?

Saf reducer testi UI kurmadan tekrar ve immutability kuralını doğrular. Sonraki görevde aynı state’i gerçek Provider üzerinden gözleyeceksin.

Alternatif: küçük ve tek bileşenli durumda yerel state yeterli olabilir. Redux’a yalnız paylaşılan client state’i taşı. Reducer’a ağ veya storage yan etkisi koyma; sonraki derslerde bunların yerini ayıracağız.
