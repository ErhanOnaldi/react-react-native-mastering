DELETE başarılı ama Puanladıklarım hâlâ Dövüş Kulübü’nü gösteriyor. `useDeleteRating(sessionId, remove)` hook’unu yaz.

- `remove(movieId)` sunucu DELETE fonksiyonudur.
- Başarılı silmeden sonra yalnız bu oturumun `['ratings', sessionId]` listesi stale olsun; diğer oturumların listesi etkilenmesin.
- Başarısız DELETE listeyi stale yapmasın ve mevcut veriyi korusun.

Bu görev POST akışındaki invalidation’ı farklı yazma işlemiyle tekrar eder.
