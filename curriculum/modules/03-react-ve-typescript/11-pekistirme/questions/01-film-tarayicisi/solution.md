## Neden böyle?

Arama sorgusu yalnız hangi kartların göründüğünü değiştirir; favori id listesi bundan bağımsızdır. Bu nedenle filtrelenip geri gelen kart eski işaretini korur. İki ayrı state’i tek listeye kopyalamak gerekmez. Uygulama ileride API ile film getirse de favori kimliği id ile saklanabilir.
