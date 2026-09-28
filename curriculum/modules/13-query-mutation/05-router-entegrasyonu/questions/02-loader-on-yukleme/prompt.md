Detay sayfası açılana kadar veri isteği başlamıyor. Route verisini geçiş sırasında hazırlayan loader oluştur.

## Gereksinimler

- `params.id` pozitif tam sayıya çevrilsin; geçersiz değer hata fırlatsın ve `load` çağrılmasın.
- Geçerli id için veri `['movie', id]` key’iyle cache’e alınsın.
- Aynı id ikinci kez yüklendiğinde cache kullanılsın; `load` yalnız bir kez çağrılsın.
- Loader yüklenen film nesnesini döndürsün.

## Örnek

`id: '550'` girdisi `{ id: 550, title: 'Dövüş Kulübü' }` döndürür; `'abc'` hata verir ve GET başlatmaz.

## Sözleşme

- `detailLoader.ts` dosyasından `makeDetailLoader(client, load)` named export et.
- Dönen fonksiyon React Router loader argümanını alır: `params.id` alanı olabilir veya `undefined`.
- `load(id: number): Promise<{ id: number; title: string }>`; `client` QueryClient.
