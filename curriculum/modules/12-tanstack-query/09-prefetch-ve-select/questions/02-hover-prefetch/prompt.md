Karttan detaya tıklanınca boş yükleme ekranı var. Hover ile kullanıcı niyeti belli olduğunda detayı önceden getir.

## İstenen

`MovieHover({ id, title })` bir button render etsin. Fare butonun üstüne girince `useQueryClient().prefetchQuery(movieQueries.detail(id))` çalışsın. Salt okunur `movieQueries.ts` aynı key ve 60 saniye tazelik sağlar. Hover sonrası detayın aynı tarifi okuması ikinci GET üretmemeli.
