Dokunmatik ekranda hover prefetch yok; detaya tıklanınca GET geç başlıyor. `makeDetailLoader(client, load)` fonksiyonunu yaz.

- Dönen React Router loader, `params.id` değerini pozitif tam sayıya çevirsin; aksi halde hata fırlatsın.
- `client.ensureQueryData({ queryKey: ['movie', id], queryFn: () => load(id) })` döndürsün.
- Aynı id ikinci kez açıldığında cache’den gelsin; ikinci GET atılmasın.

Detay bileşeni aynı key ile `useSuspenseQuery` çağıracak.
