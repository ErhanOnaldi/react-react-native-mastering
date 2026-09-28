import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Film notunu kimlikle sıfırla',
  difficulty: 'orta',
  concepts: ['react.lists-keys', 'react.state', 'react.derived-state'],
  files: ['MovieNotes.tsx'],
  hints: [
    'Not state’i alt `Notes` bileşeninin kimliğine bağlı.',
    'React bileşen state’ini ağaçtaki konuma ve `key` değerine göre korur.',
    '`Notes` çağrısına film kimliğinden gelen bir key ver.',
    '`<Notes key={id} id={id} />` aynı filmde state’i korur, yeni filmde yeni state oluşturur.',
  ],
})
