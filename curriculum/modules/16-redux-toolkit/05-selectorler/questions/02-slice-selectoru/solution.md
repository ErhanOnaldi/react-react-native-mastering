## Neden böyle?

Slice `selectors` alanı kök state’e uyarlanmış selector’ı üretir; bileşenin tekrar tekrar `state.ui.theme` bilmesi gerekmez.

Alternatif: küçük ve tek bileşenli durumda yerel state yeterli olabilir. Redux’a yalnız paylaşılan client state’i taşı. Reducer’a ağ veya storage yan etkisi koyma; sonraki derslerde bunların yerini ayıracağız.
