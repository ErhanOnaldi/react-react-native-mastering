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
      text: 'Hook’lar otomatik olarak ağ isteği atar.',
      correct: false,
      explanation: 'Bunlar Redux’a erişir; veri çekme davranışı eklemez.',
    },
    {
      text: 'Provider artık gerekmez.',
      correct: false,
      explanation: 'Bileşenler yine Provider altındaki store’a bağlanır.',
    },
  ],
})
