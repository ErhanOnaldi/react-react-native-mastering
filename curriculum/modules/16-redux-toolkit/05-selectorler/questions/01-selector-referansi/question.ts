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
      text: 'useSelector action’ı iki kez dispatch eder.',
      correct: false,
      explanation: 'Selector okur; dispatch etmez.',
    },
    {
      text: 'Immer diziyi her render’da siler.',
      correct: false,
      explanation: 'Immer yalnız reducer güncellemesinde çalışır.',
    },
  ],
})
