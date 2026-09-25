# Sinema

TMDB API’sini kullanan, React + TypeScript + Vite ile yazılmış bir film keşif uygulaması. React Mastering müfredatı boyunca modül modül büyür.

## Kurulum

```bash
pnpm install
```

Repo kökündeki `.env` dosyasına TMDB token’ını ekle (Sinema, `envDir` ayarıyla kökteki dosyayı okur):

```bash
VITE_TMDB_TOKEN=<TMDB v4 API Read Access Token>
VITE_APP_TITLE=Sinema
```

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `pnpm dev` | Geliştirme sunucusunu başlatır (http://localhost:5174) |
| `pnpm build` | Tip kontrolü yapar, ardından production paketini `dist/` altına üretir |
| `pnpm preview` | Üretilen paketi yerelde sunar |
| `pnpm typecheck` | Yalnızca TypeScript tip kontrolü yapar |

## Ortam değişkenleri

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `VITE_TMDB_TOKEN` | Evet | themoviedb.org → Ayarlar → API → "API Read Access Token" |
| `VITE_APP_TITLE` | Hayır | Uygulama başlığı (varsayılan: `Sinema`) |

> `VITE_` ile başlayan değerler tarayıcı paketine gömülür; gerçek bir üründe gizli anahtarlar sunucuda tutulmalıdır.
