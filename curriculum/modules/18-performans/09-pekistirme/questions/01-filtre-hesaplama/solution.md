## Neden böyle?
Bu görev iki ayrı maliyeti birleştirir: `useDeferredValue` etkileşim önceliğini, `useMemo` tekrar hesaplamayı yönetir. `filter` dependency'sini unutursan değişen arama kuralıyla eski sonuç kalabilir. Compiler etkin yeni kodda önce otomatik memoization ve Profiler kullan; burada el yazısı davranışını görünür sayıyoruz.
