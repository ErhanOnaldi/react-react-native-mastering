## Neden böyle?

Bu alıştırmada gerçek dış servisi çağırmadan thunk yaşam döngüsünü izliyorsun. Üretimde dışa aktarma uç noktası eklenirse bu payload creator içinde çağrılabilir; TMDB sorgusu Query’de kalır.

Alternatif: küçük ve tek bileşenli durumda yerel state yeterli olabilir. Redux’a yalnız paylaşılan client state’i taşı. Reducer’a ağ veya storage yan etkisi koyma; sonraki derslerde bunların yerini ayıracağız.
