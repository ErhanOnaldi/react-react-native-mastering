import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'withTypes neden?',
  difficulty: 'kolay',
  concepts: ['redux.typed-hooks'],
  question: '`useAppDispatch` ve `useAppSelector` neden store tiplerinden türetilir?',
  options: [
    {
      text: 'Dispatch ve state tipleri store değişince tek yerden güncellenir.',
      correct: true,
      explanation: 'Tipler store gerçeğini izler; elle tekrar edilmez.',
    },
    {
      text: 'Hook’lar çalışma anında Provider’ın doğru state şekli verdiğini doğrular.',
      correct: false,
      explanation: '`.withTypes` TypeScript’e bilgi verir; runtime state doğrulaması yapmaz.',
    },
    {
      text: 'Provider artık gerekmez.',
      correct: false,
      explanation: 'Bileşenler yine Provider altındaki store’a bağlanır.',
    },
  ],
})
