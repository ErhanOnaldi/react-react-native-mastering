19. modülde fragman modalının focus ve Escape davranışını elle kurdun. Şimdi Sinema'da aynı davranışları Radix tabanlı, **kaynağı projede duran** parçalarla kullan ve detay sayfasına bir eylem menüsü ekle.

## Kurulum
1. Proje kökünde `pnpm dlx shadcn@latest init -b radix` çalıştır (Base UI değil, Radix).
2. `components.json` → `aliases.utils` değerini Sinema'nın mevcut `cn`'ine çevir: `@/shared/lib/cn`. `@/*` alias'ı kök `tsconfig.json`'da da olsun.
3. `pnpm dlx shadcn@latest add button dialog dropdown-menu input card badge`

## Dosya ve export sözleşmesi
- `src/components/ui/button.tsx` → `Button` (`asChild`, `variant`: `default` | `secondary` | `outline` | `ghost` …), `buttonVariants`
- `src/components/ui/dialog.tsx` → `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`
- `src/components/ui/dropdown-menu.tsx` → `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`
- `src/components/ui/input.tsx` → `Input`, `card.tsx` → `Card`, `badge.tsx` → `Badge`

## Kodu sahiplen
- `DialogContent`'in içindeki kapatma düğmesinin erişilebilir adı **Kapat** olsun (CLI "Close" yazar).
- Eski `src/shared/ui` kitini kullanan her yeri yeni parçalara taşı (`primary` → `default` variant) ve eski dosyaları sil. 19. modülün `Modal`'ı artık kullanılmıyorsa onu da sil; `Tabs` kalabilir.
- `.dark` sınıfını `RootLayout`'taki `div` yerine `<html>` öğesine uygula ki portal içerikleri de koyu temayı alsın.

## Detay sayfası (`src/pages/MovieDetailsPage.tsx`)
Mevcut export'u, Suspense/Query akışını ve sekmeleri koru.
- **Fragmanı aç** artık `Dialog` açsın. Dialog adı **`{film başlığı} fragmanı`**; açıklaması videonun adı; içinde `https://www.youtube.com/watch?v={key}` adresine giden **YouTube'da izle** linki. Video yoksa düğme yok.
- Favori düğmesinin yerine **Film işlemleri** adlı bir `DropdownMenu`:
  - `DropdownMenuCheckboxItem` **Favori**: işaretli durumu filmin favori olup olmadığını göstersin, seçilince favoriyi değiştirsin.
  - `DropdownMenuItem asChild` ile **TMDB'de aç** linki: `https://www.themoviedb.org/movie/{id}` (yeni sekmede).

CLI ikonlar için `lucide-react`, animasyon sınıfları için `tw-animate-css` ekler; bunlar normal bağımlılıklardır.
