Sinema'nın başlığını koddan çıkarıp ortam değişkenine taşıyoruz.

1. **`src/vite-env.d.ts`** oluştur ve iki değişkeni tiple: `VITE_TMDB_TOKEN` (zorunlu) ve `VITE_APP_TITLE` (opsiyonel).
2. **`src/config.ts`** oluştur ve `appTitle` adında bir sabit export et: `VITE_APP_TITLE` yoksa `"Sinema"`.
3. **`App.tsx`**'teki `<h1>`, sabit yazı yerine `appTitle`'ı göstersin.
4. Kök dizindeki `.env` dosyana `VITE_APP_TITLE=🎬 Sinema` satırını ekle, dev sunucusunu **yeniden başlat** ve başlığın değiştiğini gör.
5. `pnpm typecheck` hatasız bitmeli.

Testler başlığı farklı env değerleriyle deneyecek. Tip kontrolü de testin parçası: `vite-env.d.ts` olmadan `import.meta.env.VITE_APP_TITLE` tip hatası verir mi, kendin gör.
