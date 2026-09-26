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
    '`init -b radix` sorularında CSS dosyası olarak `src/index.css`’i seç. Ardından `components.json`’da `aliases.utils`’i `@/shared/lib/cn` yap; CLI’ın ürettiği `src/lib/utils.ts` gereksiz kalırsa sil.',
    'Fragman için `<Dialog><DialogTrigger asChild><Button>…</Button></DialogTrigger><DialogContent>…</DialogContent></Dialog>`. Başlık `DialogTitle`, açıklama `DialogDescription`; Radix adı ve açıklamayı dialoga kendisi bağlar. `dialog.tsx`’te “Close” yazan `sr-only` span’i bul.',
    'Menü: `<DropdownMenuCheckboxItem checked={isFavorite} onCheckedChange={() => dispatch(toggleFavorite(movie.id))}>Favori</DropdownMenuCheckboxItem>` ve `<DropdownMenuItem asChild><a href=… target="_blank" rel="noreferrer">TMDB\'de aç</a></DropdownMenuItem>`. `.dark` için `RootLayout`’ta `useEffect(() => document.documentElement.classList.toggle("dark", theme === "dark"), [theme])`.',
  ],
  rubric: [
    'components.json Radix seçimini, `src/index.css` yolunu ve Sinema’nın gerçek alias’larını (utils → `@/shared/lib/cn`) yansıtıyor; kök tsconfig ve Vite alias’ları çözülüyor.',
    'Eski `src/shared/ui` kitinin (button, input, card, badge, skeleton) ve 19. modül Modal’ının yerini `src/components/ui` parçaları almış; kullanılmayan dosyalar silinmiş, Tabs korunmuş.',
    'MovieDetailsPage fragman için Dialog, film eylemleri için DropdownMenu kullanıyor; favori menüde `menuitemcheckbox` olarak durumunu bildiriyor; TMDB veri akışı ve sekmeler korunmuş.',
    'Tema `.dark` sınıfı `<html>`’de; koyu temada dialog ve menü de koyu açılıyor, focus halkaları görünür.',
  ],
})
