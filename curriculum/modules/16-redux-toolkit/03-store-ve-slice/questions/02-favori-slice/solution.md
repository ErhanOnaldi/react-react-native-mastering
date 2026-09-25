## Neden böyle?

`createSlice` action ve reducer’ı eşler. Immer draft üzerinde `push/splice` okunur kalır; eski snapshot korunur. `selectors` slice’a yakın basit okuma kuralını paylaşır.

Alternatif: küçük ve tek bileşenli durumda yerel state yeterli olabilir. Redux’a yalnız paylaşılan client state’i taşı. Reducer’a ağ veya storage yan etkisi koyma; sonraki derslerde bunların yerini ayıracağız.
