Trend listesindeki "Sonraki" eski sayfayı siliyor; film kartına tıklayınca detay için yeniden bekliyorsun.

## İstenen

- HomePage’in **trend** görünümünü `useInfiniteQuery` ile kur: `initialPageParam: 1`, `getNextPageParam` son sayfada `undefined`, uygun `maxPages`. `data.pages` içindeki filmleri sırayla birleştir ve "Daha fazla" eylemiyle yeni sayfayı getir.
- Tür filtresinin sayfalı `discover` davranışı ve URL state’i bozulmasın.
- Film kartı hover’ında `queryClient.prefetchQuery(movieQueries.detail(movie.id))` çalıştır. Detay sayfası aynı tarifi kullanmalı. Taze prefetch’ten sonra detay açılışı ikinci GET üretmemeli.
- İstek sayacında "Daha fazla" öncesi/sonrası `page=1`, `page=2` değerlerini; hover sonrası detay isteği sayısını kontrol et.

Yeni bir detay fetch fonksiyonu yazma; mevcut `movieQueries.detail` tarifini iki yerde paylaş.
