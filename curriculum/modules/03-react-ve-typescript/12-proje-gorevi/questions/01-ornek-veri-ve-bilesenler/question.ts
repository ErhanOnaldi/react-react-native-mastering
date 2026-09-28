import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Statik film verisi ve bileşenler',
  difficulty: 'orta',
  concepts: ['react.props', 'react.children', 'react.lists-keys', 'ts.pick', 'ts.omit'],
  project: 'sinema',
  focusFiles: [
    'src/data/sample-movies.ts',
    'src/components/MovieCard.tsx',
    'src/components/MovieGrid.tsx',
    'src/components/SearchBox.tsx',
  ],
  hints: [
    'Önce Movie tipinin alanlarını ve TMDB fixture kayıtlarının liste/detay biçimlerini karşılaştır.',
    'Film verisini ve gösterim API’lerini görevdeki dosya/export sözleşmelerine göre ayır; tekrar eden kart bilgisi aynı kayıttan gelsin.',
    'Her kartın favori düğmesi `movie.id` ile callback çağırsın; grid boş durum metnini, arama alanı ise etiketiyle kontrollü değerini göstersin.',
  ],
})
