DELETE başarılı ama Puanladıklarım hâlâ Dövüş Kulübü’nü gösteriyor. `useDeleteRating(sessionId, remove)` hook’unu yaz.

- `remove(movieId)` sunucu DELETE fonksiyonudur.
- Başarıda `['ratings', sessionId]` key’ini invalidate et.
- Başarısız DELETE listeyi stale yapmasın.

Bu görev POST akışındaki invalidation’ı farklı yazma işlemiyle tekrar eder.
