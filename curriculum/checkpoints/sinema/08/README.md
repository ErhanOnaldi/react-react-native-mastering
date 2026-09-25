# Sinema

ESLint ve Prettier kurulu; TMDB sayfaları ve detay route’u lint temizdir.

## Kurulum

```bash
pnpm install
```

Repo kökündeki `.env` dosyasına TMDB API Read Access Token değerini ekle:

```bash
VITE_TMDB_TOKEN=buraya-read-access-token
VITE_APP_TITLE=Sinema
```

`VITE_APP_TITLE` isteğe bağlıdır. `.env` dosyasını Git'e ekleme.

## Komutlar

| Komut            | Ne yapar                                                 |
| ---------------- | -------------------------------------------------------- |
| `pnpm dev`       | Geliştirme sunucusunu başlatır (`http://localhost:5174`) |
| `pnpm build`     | Tip kontrolü ve production paketi oluşturur              |
| `pnpm preview`   | Production paketini yerelde gösterir                     |
| `pnpm typecheck` | TypeScript tip kontrolü yapar                            |

`VITE_` değerleri tarayıcı paketine gömülür. Bu yerel öğrenme projesinde API doğrudan çağrılır; üretimde gizli kimlik bilgileri sunucu tarafında korunmalıdır.
