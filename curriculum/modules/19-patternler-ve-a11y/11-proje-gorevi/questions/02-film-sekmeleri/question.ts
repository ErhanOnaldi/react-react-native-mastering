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
    '4. dersteki `KeyboardTabs` alıştırmasını ve iki ayrı sekme grubunun kimliklerini düşün.',
    'Kökte `useState(defaultValue)` ve `useId()` kullanıp parçaları Context ile bağla. List’in `onKeyDown` olayında görünen tabları DOM sırasıyla bul.',
    'Detay sayfasında `const videos = movie.videos?.results ?? []`; `videos.length > 0` değilse hem Videolar Trigger’ını hem Panel’ini render etme.',
  ],
  rubric: [
    'Tabs compound API’si tek bir seçim kaynağı kullanıyor; id’ler useId ile üretiliyor; parçalar Tabs dışında anlaşılır hata veriyor.',
    'Yön tuşları sabit indeks tablosu yerine görünen sekmelerin DOM sırasını izliyor; Tab tuşu yalnızca seçili sekmede duruyor.',
    'MovieDetailsPage sekmeleri gerçek TMDB verisinden kuruyor; video yoksa Videolar sekmesi yok; Suspense/Query akışı ve diğer bölümler korunmuş.',
    'Favori düğmeleri (detay sayfası ve film kartı) değişen ad ile aria-pressed’i birlikte kullanmıyor.',
  ],
})
