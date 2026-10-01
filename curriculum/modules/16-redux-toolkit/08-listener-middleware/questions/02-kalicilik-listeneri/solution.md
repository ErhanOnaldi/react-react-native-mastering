## Neden böyle?

Yan etki listener’da, reducer saf kalır. Gerçek projede başlangıç state’ini storage’dan yükleme, bozuk kayıt ve sürüm geçişi de gerekir.

Alternatif: küçük ve tek bileşenli durumda yerel state yeterli olabilir. Redux’a yalnız paylaşılan client state’i taşı. Reducer’a ağ veya storage yan etkisi koyma; sonraki derslerde bunların yerini ayıracağız.
