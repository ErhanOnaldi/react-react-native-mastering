## Neden böyle?
`useMemo` burada ölçülmüş pahalı hesaplamayı sınırlar. `theme` bağımlılık değildir; `movies` ve `rank` bağımlılıktır. `rank` fonksiyonuna `[...movies]` kopyası verildiği için fonksiyon kendi girdisini sıralasa bile prop değişmez. React Compiler etkin bir projede yeni kodda önce otomatik optimizasyonu ölçmek daha iyi başlangıçtır.
