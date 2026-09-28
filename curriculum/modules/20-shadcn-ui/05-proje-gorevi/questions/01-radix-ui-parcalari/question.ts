import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema için Radix tabanlı UI parçaları',
  difficulty: 'zor',
  concepts: [
    'shadcn.setup',
    'shadcn.components',
    'shadcn.theming',
    'pattern.slot',
    'tailwind.cva',
    'a11y.keyboard',
    'a11y.focus',
    'tooling.path-alias',
  ],
  project: 'sinema',
  focusFiles: [
    'components.json',
    'src/components/ui/dialog.tsx',
    'src/components/ui/dropdown-menu.tsx',
    'src/pages/MovieDetailsPage.tsx',
  ],
  reviewFiles: [
    'components.json',
    'src/components/ui/*.tsx',
    'src/features/movies/components/*.tsx',
    'src/pages/MovieDetailsPage.tsx',
    'src/layouts/RootLayout.tsx',
    'src/index.css',
  ],
  hints: [
    "Önce mevcut Sinema alias, tema class'ını ve fragman/favori akışını oku. Hangi public davranış korunmalı, hangisi değişmeli?",
    'Kurulumda `pnpm dlx shadcn@latest init -b radix` seç; alias haritasını düzenle. Erişilebilir bileşen aileleri `Dialog`, `DropdownMenu` ve `Button` parçalarını sağlar.',
    "Fragman yapısında `DialogTitle` ve `DialogDescription` kullan; menüde checked item'ı favori state'ine bağla. `RootLayout` tema class'ını `document.documentElement` üzerinde eşitle.",
    'İlk olarak `DialogContent` içindeki `Close` metnini `Kapat` yap. Klavye sırasını, focus dönüşünü ve portalın koyu temasını ayrıca gözden geçir.',
  ],
  rubric: [
    'components.json Radix seçimini, `src/index.css` yolunu ve Sinema’nın gerçek alias’larını (utils → `@/shared/lib/cn`) yansıtıyor; kök tsconfig ve Vite alias’ları çözülüyor.',
    'Eski `src/shared/ui` kitinin (button, input, card, badge, skeleton) ve 19. modül Modal’ının yerini `src/components/ui` parçaları almış; kullanılmayan dosyalar silinmiş, Tabs korunmuş.',
    'MovieDetailsPage fragman için Dialog, film eylemleri için DropdownMenu kullanıyor; favori menüde `menuitemcheckbox` olarak durumunu bildiriyor; TMDB veri akışı ve sekmeler korunmuş.',
    'Tema `.dark` sınıfı `<html>`’de; koyu temada dialog ve menü de koyu açılıyor, focus halkaları görünür.',
  ],
})
