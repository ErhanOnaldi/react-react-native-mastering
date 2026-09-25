---
title: Ortam değişkenleri (.env)
minutes: 8
---

# Ortam değişkenleri (.env)

:::pain[Problem]
TMDB token'ını doğrudan koda yazdın:

```ts
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOi...'
```

Kodu GitHub'a gönderdin. Birkaç saat sonra otomatik tarayıcılar token'ını buldu; artık **herkes senin anahtarınla** istek atabiliyor. Üstelik geliştirme, test ve production için farklı adresler/anahtarlar kullanman gerekiyor — hepsini kodun içinde mi değiştireceksin?
:::

## .env dosyası

Ortama göre değişen ve **gizli** değerler kodun dışında, `.env` dosyasında durur:

```bash title=".env"
VITE_TMDB_TOKEN=eyJhbGciOiJIUzI1NiJ9...
VITE_APP_TITLE=Sinema
```

Kodda `import.meta.env` üzerinden okunur:

```ts
const token = import.meta.env.VITE_TMDB_TOKEN
```

Bu repoda `.env` kök dizinde duruyor; Sinema'nın `vite.config.ts`'indeki `envDir: '../..'` ayarı Vite'a onu orada aramasını söylüyor.

## Kurallar

1. **`VITE_` öneki zorunlu.** Vite yalnızca `VITE_` ile başlayan değişkenleri tarayıcı koduna verir. Böylece yanlışlıkla `DATABASE_PASSWORD` gibi bir şeyi istemci koduna sızdırmazsın.
2. **`.env` commit'lenmez**, `.env.example` commit'lenir. Example dosyası hangi değişkenlerin gerektiğini (değerleri olmadan) belgeler:

```bash title=".env.example"
VITE_TMDB_TOKEN=
VITE_APP_TITLE=Sinema
```

3. **`.env`'i değiştirince dev sunucusunu yeniden başlat.** Değerler sunucu açılırken okunur.
4. **Değerler her zaman string'dir.** `VITE_PAGE_SIZE=20` → `"20"`. Sayıya çevirmek senin işin.

## Tiplemek

TypeScript, `import.meta.env.VITE_APP_TITLE`'ın var olduğunu bilmez. `src/vite-env.d.ts` dosyasında anlatırız:

```ts title="src/vite-env.d.ts"
interface ImportMetaEnv {
  readonly VITE_TMDB_TOKEN: string
  readonly VITE_APP_TITLE?: string // opsiyonel: yoksa varsayılan kullanırız
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

Artık editör otomatik tamamlar ve yazım hatasını (`VITE_TMBD_TOKEN`) yakalar.

## Tek bir config dosyası

Env değerlerini kodun her yerinde ayrı ayrı okumak yerine **tek bir yerde** okuyup varsayılanları orada vermek iyi bir alışkanlıktır:

```ts check title="src/config.ts"
export const appTitle = import.meta.env.VITE_APP_TITLE ?? 'Sinema'
```

Bileşenler `import { appTitle } from './config'` der; env'in adını ya da varsayılanı bilmek zorunda kalmazlar.

:::warning[En önemli uyarı]
`VITE_` ile başlayan **her değer build sırasında JavaScript dosyasının içine gömülür.** Siteni açan herkes tarayıcının geliştirici araçlarında görebilir. `.env` token'ı **GitHub'dan** korur, **kullanıcılardan** korumaz.
:::

:::sector
Gerçek ürünlerde gizli anahtarlar tarayıcıya hiç gitmez: tarayıcı kendi backend'ine (ya da bir proxy/BFF'e) istek atar, anahtarı sunucu ekler. TMDB'nin salt-okuma token'ını yerel öğrenme projesinde istemcide kullanmak kabul edilebilir; bir ödeme API'sinin gizli anahtarı için asla. Değişkenleri ayrıca Zod ile doğrulamayı 15. modülde öğreneceğiz.
:::
