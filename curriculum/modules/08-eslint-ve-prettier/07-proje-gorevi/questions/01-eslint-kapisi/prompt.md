# Sinema ESLint kapısı

Sinema v1’de detay route’u değişince film eski kalabiliyor. Proje kökünde **`eslint.config.js`** oluştur ve sayfa kodunu düzelt.

- ESLint 10 flat config kullan; `defineConfig` yardımcısını `eslint/config`’ten al.
- `@eslint/js` ve `typescript-eslint` önerilen kurallarını, `eslint-plugin-react-hooks` 7 flat `recommended` preset’ini ve `eslint-plugin-react-refresh` Vite config’ini ekle.
- Tarayıcı ve Node global’lerini ilgili dosyalar için `globals` paketiyle tanımla; örneğin `document` bir tarayıcı global’idir. `dist` gibi üretilen klasörleri flat config içinde ignore et.
- En sona `eslint-config-prettier/flat` koy. TS/TSX dosyalarını kapsa.
- `src/pages/MovieDetailsPage.tsx` içindeki film id’si değişince yeni film gösterilsin. `useEffect` kullanıyorsan bağımlılığı ve eski istek temizliğini doğru kur; mevcut `useFetch` üzerinden id’ye bağlı URL kurmak da geçerli.
- Kullanılmayan import’ları ve config’in gösterdiği gerçek hataları düzelt. Kuralları kapatarak geçme.

Test `eslint.config.js` dosyasını ESLint Node API’siyle yükler ve TS/TSX örneklerinde kuralların gerçekten çalıştığını kontrol eder. Proje kodunun lint temizliği ikinci görevde denetlenir.

Bu araçlar Sinema’nın `package.json` dosyasında yoksa `devDependencies` olarak ekle: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-config-prettier`, `globals`. Sürüm seçiminde repo kökündeki `package.json` ve workspace catalog’u kullan.
