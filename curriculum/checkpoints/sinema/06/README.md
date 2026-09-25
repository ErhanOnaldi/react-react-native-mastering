# Sinema

React + TypeScript + Vite ile yazılmış bir film keşif uygulaması. Bu checkpoint, React Router ile statik örnek filmleri gösterir. TMDB API bağlantısı sonraki modülde eklenir.

## Kurulum

```bash
pnpm install
```

İstersen repo kökündeki `.env` dosyasına uygulama başlığını ekleyebilirsin:

```bash
VITE_APP_TITLE=Sinema
```

## Komutlar

| Komut            | Ne yapar                                                               |
| ---------------- | ---------------------------------------------------------------------- |
| `pnpm dev`       | Geliştirme sunucusunu başlatır (http://localhost:5174)                 |
| `pnpm build`     | Tip kontrolü yapar, ardından production paketini `dist/` altına üretir |
| `pnpm preview`   | Üretilen paketi yerelde sunar                                          |
| `pnpm typecheck` | Yalnızca TypeScript tip kontrolü yapar                                 |

## Ortam değişkenleri

| Değişken          | Zorunlu | Açıklama                                                 |
| ----------------- | ------- | -------------------------------------------------------- |
| `VITE_APP_TITLE`  | Hayır   | Uygulama başlığı (varsayılan: `Sinema`)                  |

> `VITE_` ile başlayan değerler tarayıcı paketine gömülür; gerçek bir üründe gizli anahtarlar sunucuda tutulmalıdır.
