## Neden böyle?

`MovieGrid` aynı kalır; yalnızca veri kaynağı değişir. Bu, UI bileşeninin API ayrıntısını bilmemesini sağlar. `useEffect` veya `useFetch` istek yaşam döngüsünü render dışında tutar. Loading ve hata dalları kullanıcıyı boş ekranda bırakmaz.

Bir sayfaya geri dönünce bileşen yeniden mount olur ve trend yeniden çekilir. Şimdilik bunu gözlemle; sonraki veri modülünde cache'in çözdüğü sorun tam da bu olacak.
