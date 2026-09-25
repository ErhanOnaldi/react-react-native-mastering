# TypeScript dosyalarına kural koy

Bir önceki test kuralı kendi içinde verdi. Şimdi Sinema’nın `.ts` ve `.tsx` dosyalarını kapsayan flat config’i sen yaz.

`lintConfig.ts` içindeki **named export `config`** bir config dizisi olsun:

- `defineConfig` yardımcısını `eslint/config`’ten kullan.
- `typescript-eslint` önerilen preset’ini ekle.
- `@typescript-eslint/no-unused-vars` kuralını `error` yap.
- Hem `src/movie.ts` hem `src/Header.tsx` kapsamda olsun.

Testler gerçek ESLint ile kullanılmayan import/değişkeni lint ediyor; kullanılan bir değişken hata vermemeli.
