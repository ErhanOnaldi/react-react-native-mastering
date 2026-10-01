## Neden böyle?

`createSelector` aynı input referanslarında hesaplanmış sonucu korur. Böylece selector yeni dizi üretip bileşeni gereksiz render’a sürüklemez.

Alternatif: küçük ve tek bileşenli durumda yerel state yeterli olabilir. Redux’a yalnız paylaşılan client state’i taşı. Reducer’a ağ veya storage yan etkisi koyma; sonraki derslerde bunların yerini ayıracağız.
