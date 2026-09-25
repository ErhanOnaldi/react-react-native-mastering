## Neden böyle?

Suspense ilk yüklemeyi sınırdaki fallback’e taşır; `data` başarıda tanımlıdır. Hata için ayrı ErrorBoundary gerekir. Cache’de eski veri varken refetch hatası her zaman boundary’ye gitmeyebilir. Loader ile aynı query key’ini bir sonraki derste paylaşacaksın.
