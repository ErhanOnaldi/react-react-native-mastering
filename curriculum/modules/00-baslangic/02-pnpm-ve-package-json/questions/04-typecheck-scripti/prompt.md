Sinema projesinde derleme paketlemesine girmeden yalnızca TypeScript tip doğrulaması yapabilmek için bağımsız bir komut kısayoluna ihtiyaç duyulmaktadır.

## Gereksinimler

- `scripts` alanı altında tip denetimini başlatan `typecheck` komutu tanımlanmalıdır.
- Komut, TypeScript derleyicisini proje referansları modunda (`-b`) çalıştırmalıdır.
- Mevcut `build` script'inin yapısı bozulmadan korunmalıdır.

## Sözleşme

- Proje ve dosya: `projects/sinema/package.json`
- Hedef alan: `scripts.typecheck` → `"tsc -b"`
