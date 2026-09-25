## Neden böyle?
Filtre değiştiğinde görünür indeksler yeni diziye aittir. Virtualizer count ve key aynı filtreli diziden gelmezse yanlış film görünebilir. `useMemo` filtre hesabını ilgisiz parent render'larında korur. Gerçek değişken yükseklikli kartta `measureElement` ekle; burada sabit satır pedagojik olarak yeterli.
