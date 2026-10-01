Sinema'nın detay sayfasındaki fragman penceresi ve film eylemleri klavye ile kullanılabilen, Türkçe adlandırılmış UI parçalarıyla çalışsın. Üretilen bileşen kaynakları proje içinde düzenlenebilir kalsın.

## Gereksinimler
- Sinema'nın `components.json` yapılandırması Radix primitive ailesini, `src/index.css` tema yolunu ve `@/shared/lib/cn` yardımcı yolunu kullansın.
- `@/*` import alias'ı TypeScript ve Vite tarafından çözülsün.
- `src/components/ui` altında Button, Dialog, DropdownMenu, Input, Card ve Badge parçaları bulunsun; eski paylaşılan UI parçalarını kullanan yerler yeni parçalara taşınsın. Eski Modal artık kullanılmıyorsa kaldır; Tabs kalsın.
- Fragman tetikleyicisi `Fragmanı aç` adlı bir button olsun.
- Dialog kapatma kontrolünün erişilebilir adı `Kapat` olsun.
- `src/pages/MovieDetailsPage.tsx` var olan export'u, veri akışı ve sekmeleri korusun.
- Fragman kontrolü yalnız video varsa görünsün. Açılan dialog `Dövüş Kulübü fragmanı` gibi film başlığından türetilen ad, video adı açıklaması ve `YouTube'da izle` bağlantısı sunsun.
- `Film işlemleri` menüsü klavyeyle açılıp gezilsin. `Favori` seçeneği durumunu bildirsin ve favoriyi değiştirsin; `TMDB'de aç` doğru film adresini yeni sekmede açsın.
- Koyu tema menü ve dialog portalında da uygulansın.

## Örnek
550 numaralı filmde fragmanı aç → dialog başlığı `Dövüş Kulübü fragmanı`, açıklaması `Fight Club Trailer HD` görünür. Film işlemleri → Favori seçilince menüyü yeniden açtığında durum işaretlidir.

## Sözleşme
- `components.json`.
- `src/components/ui/button.tsx` → `Button`, `buttonVariants`.
- `src/components/ui/dialog.tsx` → Dialog parçaları: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`.
- `src/components/ui/dropdown-menu.tsx` → DropdownMenu parçaları ve `DropdownMenuCheckboxItem`.
- `src/components/ui/input.tsx` → `Input`; `card.tsx` → `Card`; `badge.tsx` → `Badge`.
- `src/pages/MovieDetailsPage.tsx` mevcut public export'u.

## Kısıtlar
- Portal görünümünü `<html>` üzerindeki `.dark` sınıfı belirlesin.
- Yeni paketler uygulamanın manifestinde normal bağımlılık olarak yer alsın.
