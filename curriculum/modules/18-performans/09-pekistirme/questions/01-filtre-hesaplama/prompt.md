## Durum
Arama filtresi pahalı; yanındaki sayaç değişince de tekrar çalışıyor. Son sorguda eski sonucu göstermeden hesap sayısını azalt.

## Yap
- Input güncel `query` state'ine bağlı kalsın.
- Yazı yazılırken input güncel kalsın; liste daha düşük öncelikle güncellenebilsin. Son sorgu tamamlandığında eski sonuç kalmasın.
- `filter` yalnız başlıklar, listenin kullandığı sorgu veya filtre fonksiyonu değişince yeniden çalışsın.
- Sayaç artışında `vi.fn` çağrı sayısı sabit kalsın.
