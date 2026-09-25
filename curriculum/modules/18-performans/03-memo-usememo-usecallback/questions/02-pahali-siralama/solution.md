## Neden böyle?
`useMemo` burada ölçülmüş pahalı hesaplamayı sınırlar. `theme` bağımlılık değildir; `movies` ve `rank` bağımlılıktır. Eksik bağımlılık eski film sırasını gösterir. React Compiler etkin bir projede bu optimizasyonu önce compiler'a bırakıp Profiler ile ölçmek daha iyi başlangıçtır; burada mekanizmayı elle öğreniyoruz.
