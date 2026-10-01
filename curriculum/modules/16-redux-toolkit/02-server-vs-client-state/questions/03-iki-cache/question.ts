import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'İki cache sorunu',
  difficulty: 'kolay',
  concepts: ['query.invalidation', 'redux.server-vs-client'],
  question:
    'TMDB filmi hem Redux’a kopyalayıp hem TanStack Query’de tutarsan ilk somut risk nedir?',
  options: [
    {
      text: 'Query invalidation sonrası Redux kopyası eski kalabilir.',
      correct: true,
      explanation: 'İki ayrı sahip senkronizasyon gerektirir.',
    },
    {
      text: 'Query ve Redux aynı değişikliği otomatik olarak birbirine iletir.',
      correct: false,
      explanation:
        'İki sistemin cache’i kendiliğinden senkronize olmaz; aradaki güncellemeyi açıkça kurman gerekir.',
    },
    {
      text: 'Her yenilemede iki kopyayı da güncelleyen ek kod gerekebilir.',
      correct: false,
      explanation:
        'Bu da gerçek bir bakım maliyetidir; Query ve Redux değişikliklerini eşlemek gerekir.',
    },
  ],
})
