import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Reducer içinde fetch?',
  difficulty: 'kolay',
  concepts: ['react.useReducer', 'react.useEffect'],
  question: 'Reducer bir `SEARCH_STARTED` action’ı aldı. Ağ isteği nerede yapılmalı?',
  options: [
    {
      text: 'Effect veya event akışında; reducer yalnızca yeni state hesaplamalı.',
      correct: true,
      explanation: 'Saf reducer test edilebilir ve aynı girdiye aynı sonucu verir.',
    },
    {
      text: 'Reducer içinde `fetch` ile.',
      explanation: 'Reducer render akışında saf kalmalı; dış etki sonuç hesaplaması değildir.',
    },
    { text: 'Render içinde doğrudan.', explanation: 'Render’daki fetch döngüyü yeniden başlatır.' },
  ],
})
