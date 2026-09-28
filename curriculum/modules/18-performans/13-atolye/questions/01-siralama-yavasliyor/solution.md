## Neden böyle?

`favoritesByPosition` ve `key={position}` aynı yanlış varsayımı paylaşıyordu: "listedeki N'inci öğe" filmin kimliğiymiş gibi davranmak. Arama filtrelediğinde ya da sıralama yön değiştirdiğinde, aynı film artık farklı bir konumda beliriyor; konuma bağlı state ve React'in kendi `key` eşlemesi eski konuma yapışıp kalıyor. Sonuç: favori işareti "beşinci sıradaki her neyse" onu takip ediyor, filmin kendisini değil.

Düzeltme: favorileri filmin `id`'siyle (`Set<number>`) tut, listeyi de `key={movie.id}` ile işaretle. Artık React hangi DOM düğümünün hangi filme ait olduğunu asla karıştırmaz; filtre/sıralama listeyi yeniden düzenlese de her satır kendi kimliğini taşır.

Ayrıca filtreleme ve sıralamayı `useMemo` içine aldık. Zorunlu değil (~100 öğede fark testte ölçülmüyor), ama her tuş vuruşunda aynı diziyi yeniden `sort` etmek yerine yalnızca `query` veya `ascending` değiştiğinde yeniden hesaplamak, gerçek bir uygulamada listeyi büyütmenin maliyetini önceden azaltır.

**Alternatif yaklaşım:** `Set<number>` yerine `Record<number, true>` (yalnızca favori olanları anahtar yap) da aynı sözleşmeyi sağlar; önemli olan anahtarın filmin kimliği olması, veri yapısının şekli değil.

**Tuzaklar:** `catalog`'daki bazı filmlerin `release_date` veya `poster_path`'i boştur (gerçek veri kirliliği); bu görevde kullanılmasa da ileride aynı listeyi genişletirken unutma.

**Köprü:** Bir sonraki görevde (`GenreBoard`) benzer bir "yanlış anahtar" riski artık TanStack Query'nin `queryKey`'inde karşına çıkacak: tür değişince önceki sonucun ekranda kalması, burada gördüğün "konuma güvenme" hatasının cache sürümü.
