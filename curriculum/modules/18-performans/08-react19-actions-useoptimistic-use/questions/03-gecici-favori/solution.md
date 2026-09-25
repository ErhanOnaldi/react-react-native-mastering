## Neden böyle?
Optimistic görünüm gerçek state'in üstünde geçici katmandır. Async Action sırasında `setOptimistic` çağrısı yapılır; başarıda temel state güncellenir, hatada eski temel state görünür. TMDB favorisi yalnız yerel Redux state'iyse bu örneğe ihtiyaç yoktur; ağ onaylı işlerde uygundur. TanStack Query cache'ini de değiştiriyorsan iki kaynağı tutarlı yönet.
