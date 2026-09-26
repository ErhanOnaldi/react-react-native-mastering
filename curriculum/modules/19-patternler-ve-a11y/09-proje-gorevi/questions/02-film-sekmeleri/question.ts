import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Film detayına erişilebilir Tabs ekle',
  difficulty: 'zor',
  concepts: [
    'pattern.compound',
    'react.context',
    'react.useId',
    'a11y.keyboard',
    'a11y.focus',
    'a11y.basics',
    'query.suspense',
  ],
  project: 'sinema',
  focusFiles: ['src/shared/ui/tabs/Tabs.tsx', 'src/pages/MovieDetailsPage.tsx'],
  reviewFiles: [
    'src/shared/ui/tabs/Tabs.tsx',
    'src/pages/MovieDetailsPage.tsx',
    'src/features/favorites/components/*.tsx',
  ],
  hints: [
    '4. dersteki `KeyboardTabs` alıştırması neredeyse hazır bir başlangıç. Kökte `useState(defaultValue)` ve `useId()`; parçalar Context’ten `useTabs()` ile okusun.',
    'Trigger id’si `${baseId}-tab-${value}`, panel id’si `${baseId}-panel-${value}` olabilir. List’in `onKeyDown`’unda `[role="tab"]` düğmelerini DOM sırasıyla bul, hedefe `focus()` ver ve seçimi değiştir.',
    'Detay sayfasında `const videos = movie.videos?.results ?? []`; `videos.length > 0` değilse hem Videolar Trigger’ını hem Panel’ini render etme.',
  ],
  rubric: [
    'Tabs compound API’si tek bir seçim kaynağı kullanıyor; id’ler useId ile üretiliyor; parçalar Tabs dışında anlaşılır hata veriyor.',
    'Yön tuşları sabit indeks tablosu yerine görünen sekmelerin DOM sırasını izliyor; Tab tuşu yalnızca seçili sekmede duruyor.',
    'MovieDetailsPage sekmeleri gerçek TMDB verisinden kuruyor; video yoksa Videolar sekmesi yok; Suspense/Query akışı ve diğer bölümler korunmuş.',
    'Favori düğmeleri (detay sayfası ve film kartı) değişen ad ile aria-pressed’i birlikte kullanmıyor.',
  ],
})
