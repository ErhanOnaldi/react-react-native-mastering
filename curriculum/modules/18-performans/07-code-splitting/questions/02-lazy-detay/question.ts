import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Lazy oyuncu paneli',
  difficulty: 'orta',
  concepts: ['perf.code-splitting', 'react.suspense'],
  files: ['MovieDetails.tsx'],
  hints: [
    'Bileşenin ilk indirme paketine girmesini engellemek ve ihtiyaç anında dinamik çekmek için React’in lazy yükleme modelini düşün.',
    '`React.lazy` fonksiyonu dinamik bir `import()` çağrısı alır ve geriye asenkron bir bileşen döner.',
    "`const CastPanel = lazy(() => import('./CastPanel'))` tanımını bileşenin DIŞINDA yap.",
    '`<Suspense fallback={<p>Oyuncular yükleniyor</p>}><CastPanel /></Suspense>` ile sar; `lazy` bileşenini asla `MovieDetails` fonksiyonunun içine yazma, aksi halde her render’da yeni bir bileşen tipi üretilir.',
  ],
})
