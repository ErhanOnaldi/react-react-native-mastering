# TypeScript kaynaklarını lint et

Sinema’daki TypeScript yardımcıları ve React bileşenleri için aynı lint config’ini tanımla. Dosyalar hem `.ts` hem `.tsx` uzantılı olabilir.

## Gereksinimler

- Kullanılmayan TypeScript import’u ve kullanılmayan TSX değişkeni hata olarak bildirilmelidir.
- Kullanılan bir TypeScript değişkeni hata üretmemelidir.
- TypeScript ve JSX söz dizimi incelenebilmelidir.

## Örnek

`const unused: string = 'Sinema'` → lint unused bildirir. `const title: string = 'Sinema'; export const heading = title` → lint hatası yok.

## Sözleşme

- Dosya: `lintConfig.ts`.
- `config` adlı named export, ESLint tarafından kullanılabilen config dizisi olmalıdır.
- Kapsam `src/movie.ts` ve `src/Header.tsx` yollarını içermelidir.

## Kısıtlar

- TypeScript dosyalarında kullanılmayan ad için `@typescript-eslint/no-unused-vars` kuralı `error` seviyesinde olmalıdır.
