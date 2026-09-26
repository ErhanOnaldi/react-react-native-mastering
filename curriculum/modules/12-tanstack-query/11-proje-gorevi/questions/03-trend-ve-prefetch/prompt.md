Trend listesindeki "Sonraki" eski sayfayı siliyor; film kartına tıklayınca detay için yeniden bekliyorsun.

## İstenen

- HomePage’in **trend** görünümünde `useInfiniteQuery` kullan. İlk sayfa 1 olsun; `data.pages` içindeki filmleri sırayla göster ve "Daha fazla" eyleminde `fetchNextPage` çağır. Son sayfada yeni istek başlatma; biriken sayfa sayısını makul tut.
- Tür filtresinin sayfalı `discover` davranışı ve URL state’i bozulmasın.
- Film kartı hover’ında detay için `prefetchQuery` çalışsın. Detay sayfası aynı cache girdisini kullansın; taze prefetch’ten sonra açılış ikinci GET üretmemeli.
- İstek sayacında "Daha fazla" öncesi/sonrası `page=1`, `page=2` değerlerini; hover sonrası detay isteği sayısını kontrol et.

Mevcut `movieQueries.detail` tarifini hover ve detay açılışında paylaş.
