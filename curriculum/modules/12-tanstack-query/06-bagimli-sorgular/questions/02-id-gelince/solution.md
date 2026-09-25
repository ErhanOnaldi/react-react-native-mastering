## Neden böyle?

Hook’u koşullu çağırmak React kurallarını bozar; `skipToken` sorgu fonksiyonunu koşullu seçer. TypeScript id’nin sayı olduğu dalı daraltır. `skipToken` sorgusunda elle `refetch()` çalışmaz; elle başlatma gerekiyorsa `enabled: false` ve gerçek queryFn seç.
