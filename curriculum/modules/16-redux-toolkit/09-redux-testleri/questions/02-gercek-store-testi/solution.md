## Neden böyle?

Mock hook testine göre gerçek Provider ile test slice, dispatch ve render bağlantısını birlikte sınar. Her test yeni `setupStore` çağırdığı için state sızmaz.

Alternatif: küçük ve tek bileşenli durumda yerel state yeterli olabilir. Redux’a yalnız paylaşılan client state’i taşı. Reducer’a ağ veya storage yan etkisi koyma; sonraki derslerde bunların yerini ayıracağız.
