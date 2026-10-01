import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Selector sonucu',
  difficulty: 'kolay',
  concepts: ['redux.selectors'],
  question:
    '`useSelector(state => ({ ids: state.favorites.ids }))` neden alakasız action’da render riskini artırır?',
  options: [
    {
      text: 'Her çağrı yeni nesne referansı döndürür.',
      correct: true,
      explanation: 'Varsayılan karşılaştırma referans eşitliğidir.',
    },
    {
      text: 'React Redux nesnenin alanlarını karşılaştırır; burada eşitlik `ids` dizisine bağlıdır.',
      correct: false,
      explanation:
        'Varsayılan karşılaştırma nesnenin referansını kullanır; iç alanların eşitliği yeterli değildir.',
    },
    {
      text: 'Selector, her store güncellemesinde önceki action’ı yeniden dispatch eder.',
      correct: false,
      explanation: 'Selector state okur; action göndermek için dispatch kullanılır.',
    },
  ],
})
