## Neden böyle?

Tipli hook’lar component içindeki seçimi ve dispatch’i güvenli kılar. Yalnız boolean seçmek alakasız slice değişimlerinde kararlı sonuç verir.

Alternatif: küçük ve tek bileşenli durumda yerel state yeterli olabilir. Redux’a yalnız paylaşılan client state’i taşı. Reducer’a ağ veya storage yan etkisi koyma; sonraki derslerde bunların yerini ayıracağız.
