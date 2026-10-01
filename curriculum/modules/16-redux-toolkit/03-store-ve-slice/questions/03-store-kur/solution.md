## Neden böyle?

`configureStore` reducer haritasındaki `favorites` ve `ui` anahtarlarını kök state alanları yapar. `setupStore()` her çağrıda yeni store üreterek bağımsız state sağlar.

Alternatif: küçük ve tek bileşenli durumda yerel state yeterli olabilir. Redux’a yalnız paylaşılan client state’i taşı. Reducer’a ağ veya storage yan etkisi koyma; sonraki derslerde bunların yerini ayıracağız.
