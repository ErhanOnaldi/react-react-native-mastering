import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Neden istekler bitmiyor?',
  difficulty: 'kolay',
  concepts: ['react.render-cycle', 'react.useEffect', 'react.state'],
  question: 'Render içinde `fetch(...).then(setMovie)` var. Cevap geldiğinde ne olur?',
  options: [
    {
      text: 'State güncellenir, yeniden render olur ve yeni fetch başlar.',
      correct: true,
      explanation: 'Dış etki render içinde olduğu için her cevap yeni istek zinciri başlatır.',
    },
    {
      text: 'React aynı filme yapılan ikinci isteği otomatik engeller.',
      explanation: 'React fetch için otomatik cache veya tekilleştirme yapmaz.',
    },
    {
      text: '`setMovie` yalnızca ilk render’da çalışır.',
      explanation: 'Her tamamlanan Promise callback’i setState çağırabilir.',
    },
  ],
})
