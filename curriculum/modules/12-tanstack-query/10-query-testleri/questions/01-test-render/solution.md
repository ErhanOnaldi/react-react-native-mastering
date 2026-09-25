## Neden böyle?

Üretim uygulamasında tek QueryClient yaşar; testte her senaryo kendi cache’ini alır. `retry: false` hata testlerini hızlı ve sayılabilir yapar. RTL’nin döndürdüğü `rerender`/`unmount` gibi araçları korumak test akışlarını kolaylaştırır.
