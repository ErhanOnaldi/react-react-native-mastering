## Durum
Arama filtresi pahalı; yanındaki sayaç değişince de tekrar çalışıyor. Son sorguda eski sonucu göstermeden hesap sayısını azalt.

## Yap
- Input güncel `query` state'ine bağlı kalsın.
- Liste araması deferred sorguyla yapılsın.
- `filter` yalnız `titles`, deferred sorgu veya filtre fonksiyonu değişince çalışsın.
- Sayaç artışında `vi.fn` çağrı sayısı sabit kalsın.
