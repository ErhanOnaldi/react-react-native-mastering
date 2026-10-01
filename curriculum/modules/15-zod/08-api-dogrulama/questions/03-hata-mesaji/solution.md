## Neden böyle?

`safeParse` başarısız olduğunda Zod issue listesindeki ilk hata, alan yolunu taşır. Bu örnekte yolu kısa bir metne ekliyoruz; kullanıcı ekranında ham API yapısı yerine anlaşılır bir hata cümlesi göstermek daha doğrudur.

## Alternatif, tuzak ve devamı

Bir yanıt birden fazla alan hatası içeriyorsa yalnızca ilk issue yolunu göstermek yeterli olmayabilir. Bu görevde önemli olan, hatanın hangi nested alandan geldiğini kaybetmemektir.
