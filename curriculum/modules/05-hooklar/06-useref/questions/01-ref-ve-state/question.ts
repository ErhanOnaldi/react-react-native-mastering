import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Hangisi ref olmalı?',
  difficulty: 'kolay',
  concepts: ['react.useRef', 'react.state'],
  question: 'Aşağıdakilerden hangisi `useRef` için daha uygun?',
  options: [
    {
      text: 'Debounce timer kimliği.',
      correct: true,
      explanation: 'Timer kimliği ekranda görünmez; güncellenmesi render gerektirmez.',
    },
    {
      text: 'Arama sonucunun ekrandaki başlığı.',
      explanation: 'Görünen başlık değişince render gerekir; state kullan.',
    },
    {
      text: 'Yükleniyor yazısının görünürlüğü.',
      explanation: 'UI durumudur, state veya türetilmiş değer olmalı.',
    },
  ],
})
