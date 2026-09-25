import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sıralama ve seçim',
  difficulty: 'kolay',
  concepts: ['react.lists-keys', 'react.immutability', 'react.state-snapshot'],
  files: ['MoviePicker.tsx'],
  hints: [
    'Seçim satır pozisyonuna mı, film kimliğine mi bağlı?',
    'Seçilen id’yi state’te tut; görünür diziyi kopyalayıp ters çevir.',
    'Her satırda `key={movie.id}` ve `aria-pressed={selected === movie.id}` kullan.',
  ],
})
