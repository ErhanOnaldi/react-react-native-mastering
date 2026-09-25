import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'İki cache sorunu',
  difficulty: 'kolay',
  concepts: ['query.invalidation'],
  question:
    'TMDB filmi hem Redux’a kopyalayıp hem TanStack Query’de tutarsan ilk somut risk nedir?',
  options: [
    {
      text: 'Query invalidation sonrası Redux kopyası eski kalabilir.',
      correct: true,
      explanation: 'İki ayrı sahip senkronizasyon gerektirir.',
    },
    {
      text: 'Redux createSlice derlenmez.',
      correct: false,
      explanation: 'Kod derlenebilir; sorun yaşam döngüsü ve doğruluktur.',
    },
    {
      text: 'URL parametresi otomatik silinir.',
      correct: false,
      explanation: 'Bu iki cache’in URL ile doğrudan ilişkisi yoktur.',
    },
  ],
})
