# Sinema format ve lint temizliği

Config hazır; şimdi herkes aynı Sinema dosyasını aynı biçimde kaydetsin.

- Proje kökünde **`.prettierrc.json`** oluştur: `singleQuote: true`, `semi: false`, `plugins: ["prettier-plugin-tailwindcss"]`, `tailwindStylesheet: "./src/index.css"`.
- `prettier` ve `prettier-plugin-tailwindcss` Sinema’da yoksa kök `package.json` ve workspace catalog’daki sürümleri izleyerek `devDependencies` içine ekle.
- Proje kökünde **`.prettierignore`** oluştur. En az `dist` ve `coverage` gibi üretilen çıktıları dışla.
- `package.json` `scripts` içine `lint` → `eslint .`, `format` → `prettier --write .`, `format:check` → `prettier --check .` ekle. Mevcut script’leri silme.
- `pnpm lint` çalıştır; `src` altındaki bütün lint hatalarını düzelt. Film detayında eksik `id` bağımlılığı kalmamalı.
- `pnpm format` ardından `pnpm format:check` çalıştır.

Testler config ve script’leri okur; Prettier Node API’siyle biçimi, ESLint Node API’siyle proje kaynaklarını denetler.
