Verilen client ve id ile film başlığını al; aynı taze detayı ikinci kez okurken yeni GET üretme.

## Gereksinimler

- `movieQueries.detail(id)` ile detayı al ve yalnız başlık metnini döndür.
- Aynı client ve id ile tekrarlanan çağrı taze cache sonucunu kullansın.
- Farklı film id’si farklı sonuç kimliğini izlesin.

## Örnek

`loadMovieTitle(client, 550)` → `'Dövüş Kulübü'`; aynı çağrıyı tekrar et → aynı başlık, toplam bir GET.

## Sözleşme

- `loadMovieTitle.ts` dosyasından `loadMovieTitle(client: QueryClient, id: number): Promise<string>` named export edilir.
- `movieQueries.ts` salt okunur dosyadır ve `movieQueries.detail(id)` sağlar.
