---
title: "Kopyaladığın kodun sahibi sensin"
minutes: 8
kind: concept
---

# Kopyaladığın kodun sahibi sensin

:::pain[Problem]
Sinema'da yeni bir “Listeye ekle” menüsü istiyorsun. 19. modüldeki dialog deneyimini hatırla: Escape, dışarı tıklama, focus dönüşü ve ekran okuyucu adı bir arada doğru olmalı. Bir menü daha yazınca aynı ayrıntıları yeniden çözmek zaman alıyor.
:::

## Önce bildiğin yol

Kendi `DropdownMenu` bileşenini yazabilirsin. Görünürken birkaç düğme göstermek kolaydır; ok tuşlarıyla gezinme, focus yönetimi ve kapanınca tetikleyiciye dönme kısmı zordur. `role="menu"` eklemek bu davranışları kendiliğinden sağlamaz.

## shadcn/ui ne verir?

shadcn CLI seçtiğin bileşenin kaynak dosyasını **senin projene** yazar. `src/components/ui/button.tsx` gibi dosyayı okuyabilir, değiştirebilir ve test edebilirsin. Bu yüzden shadcn/ui, sürüm yükselttiğinde uzaktan davranışı değişen tek bir kapalı bileşen paketi gibi düşünülmez. Üretilen dosyanın kullandığı `radix-ui`, `class-variance-authority` gibi paketler ise normal bağımlılıklardır.

Radix erişilebilir davranışın temel parçalarını sağlar; kopyaladığın dosya onların görünümünü ve API'sini projenin diline uyarlar. Base UI da desteklenir. **CLI bugün yeni projelerde Base UI seçer**; Sinema Radix kullandığı için seçimi açıkça yap:

```bash
pnpm dlx shadcn@latest init -b radix
pnpm dlx shadcn@latest add button dialog dropdown-menu
```

`@/components/ui/button` gibi import'ların çalışması için `@/*` alias'ı **üç yerde** tanımlı olmalı:

| Nerede | Kim okur? |
| --- | --- |
| `tsconfig.json` → `compilerOptions.paths` | shadcn CLI (alias'ları buradan çözer) |
| `tsconfig.app.json` → `compilerOptions.paths` | `tsc -b`, editör |
| `vite.config.ts` → `resolve.alias` (ya da Vite 8'in `resolve.tsconfigPaths: true`) | Vite, Vitest |

Sinema'da 9. modülden beri son ikisi var; CLI için kök `tsconfig.json`'a da eklersin.

CLI'ın bıraktığı `components.json` dosyası stil, alias, CSS yolu ve bileşenlerin nereye yazılacağını belirler. Tailwind v4'te JS `tailwind.config` dosyası yoktur; bu alan boş kalır. `aliases.utils` alanı `cn()` fonksiyonunun yeridir: CLI varsayılan olarak `src/lib/utils.ts` üretir, Sinema'da zaten `src/shared/lib/cn.ts` var; alias'ı oraya çevirirsen üretilen dosyalar kendi `cn`'ini kullanır.

CLI ayrıca birkaç **normal bağımlılık** ekler: `radix-ui`, `class-variance-authority`, ikonlar için `lucide-react`, animasyon sınıfları için `tw-animate-css`. Bunlar senin `package.json`'ında görünür; sürümlerini sen yönetirsin.

## Küçük bir sahiplik örneği

`Slot` bir çocuğun üzerine props ve sınıfları geçirir. `asChild` ile linki ikinci bir button içine koymadan buton görünümü verebilirsin. `cva` variant sınıflarını, `cn` ise koşullu sınıfları birleştirir. Bunlar 4. modülde yazdığın UI kitinin devamıdır; farklı olan şey erişilebilir davranışı Radix'in taşımasıdır.

```tsx title="src/components/ui/movie-action.tsx"
import { Slot } from 'radix-ui'
// asChild=true iken Slot.Root tek çocuk elementini kullanır.
// <MovieAction asChild><a href="/movie/550">Detay</a></MovieAction>
```

:::mistake[Sık hata]
`pnpm add shadcn` ile tüm arayüzü bir runtime paketinden import etmeyi bekleme. CLI'ı çalıştırıp dosyaları projene alırsın. `init` komutunu `-b radix` olmadan çalıştırırsan yeni varsayılan Base UI ile başlayabilirsin.
:::

:::sector[Sektörde]
Kopyalanan kodun bakımı takımın sorumluluğundadır. Üretilen bileşeni değiştirdiğinde testleri çalıştır; sonraki CLI güncellemesi yerel özelleştirmeyi kendiliğinden birleştirmez.
:::
