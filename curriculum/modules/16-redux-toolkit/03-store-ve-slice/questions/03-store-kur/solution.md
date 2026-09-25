## Neden böyle?

`combineSlices` her slice’ın `reducerPath` değerini kök anahtar yapar. Ayrı `setupStore()` çağrıları test izolasyonu sağlar.

Alternatif: küçük ve tek bileşenli durumda yerel state yeterli olabilir. Redux’a yalnız paylaşılan client state’i taşı. Reducer’a ağ veya storage yan etkisi koyma; sonraki derslerde bunların yerini ayıracağız.
