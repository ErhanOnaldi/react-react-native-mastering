# Sinema ESLint kapısı

Sinema’daki TypeScript ve React kaynakları için ortak lint kuralları ekle. Detay rotasındaki film kimliği değişince sayfa yeni filmi göstermeli; önceki isteğin cevabı daha sonra gelirse güncel ekranı ezmemeli.

## Gereksinimler

- TS ve TSX dosyalarında kullanılmayan adlar hata olarak bildirilmelidir.
- TSX’te eksik effect bağımlılığı ve koşullu Hook çağrısı yakalanmalıdır.
- React component dosyasında component dışı yardımcı export’u yakalanmalıdır.
- React Compiler için props/state değişmezliği kuralı etkin olmalıdır.
- Üretilmiş `dist` dosyaları lint kapsamı dışında kalmalıdır.
- `src/pages/MovieDetailsPage.tsx` içindeki route kimliği değişince doğru film gösterilmeli; eski istek yeni sonucu ezmemelidir.
- Gerçek lint sorunlarını kaynakta düzelt; kuralları kapatıp geçme.

## Örnek

Lint deneme dosyasında eksik effect bağımlılığı varsa mesaj üretilir; route kimliği `550`’dan `155`’e değişince detay sayfası `155` kimliğinin filmini gösterir.

## Sözleşme

- Proje: `sinema`; config dosyası proje kökünde `eslint.config.js` olmalıdır.
- Detay sayfası yolu: `src/pages/MovieDetailsPage.tsx`.
- Config TS/TSX dosyalarında kullanılabilir olmalı ve JavaScript/Node ile tarayıcı global’lerini doğru kapsamda tanımalıdır.

## Kısıtlar

- ESLint config’i flat config biçiminde olmalıdır.
- Prettier ile çakışan ESLint biçim kuralları son katmanda etkisiz olmalıdır.
