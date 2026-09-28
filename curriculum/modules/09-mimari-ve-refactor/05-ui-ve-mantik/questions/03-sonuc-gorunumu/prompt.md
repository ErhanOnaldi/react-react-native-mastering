Arama sonucunun yüklenme, hata, boş ve dolu hallerini kullanıcıya açık biçimde göster.

## Gereksinimler

- `loading` iken `Filmler yükleniyor` metnini göster.
- `error` iken `Hata: <message>` göster.
- Başarılı ama boş sonuçta `Film bulunamadı` göster.
- Başarılı sonuçta her film başlığını ayrı `<li>` içinde göster.
- Yalnız dolu başarı durumunda listeyi göster; her öğenin kimliği React anahtarı olsun.

## Örnek

| Durum | Görünür çıktı |
| --- | --- |
| `loading` | `Filmler yükleniyor` |
| `error`, mesaj `TMDB kapalı` | `Hata: TMDB kapalı` |
| `success`, boş liste | `Film bulunamadı` |
| `success`, Matrix | `<li>Matrix</li>` |

## Sözleşme

- Dosya ve export: `MovieResult.tsx` → named export `MovieResult({ state })`.
- `state` tipi başlangıç dosyasında hazırdır: loading, error/message ve success/movies union'ı.
