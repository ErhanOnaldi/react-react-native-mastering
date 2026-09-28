Favori id listesi provider altındaki tüketicilere ortak olarak ulaşmalı. Provider dışında kullanım ise sessizce boş veri döndürmek yerine açıklayıcı hata vermeli.

## Gereksinimler

- `FavoritesProvider` altındaki tüketici örnek favori id listesini okuyabilir.
- Bu görevde provider değeri `[550]` listesini sağlar.
- `useFavorites()` provider dışında çağrılırsa hata fırlatır.
- Hata mesajı `FavoritesProvider` adını içerir.

## Örnek

Provider altında çalışan okuyucu ekranda `550` gösterir. Aynı okuyucu provider olmadan render edilirse test hata bekler.

## Sözleşme

- Dosya ve export: `FavoritesContext.tsx` → `FavoritesProvider`, `useFavorites`
- `FavoritesProvider` prop'u: `{ children: ReactNode }`
- `useFavorites()` dönüşü bu görevde `number[]`
