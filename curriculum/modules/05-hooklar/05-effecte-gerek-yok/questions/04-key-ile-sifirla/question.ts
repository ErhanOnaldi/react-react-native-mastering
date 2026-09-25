import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Film notunu kimlikle sıfırla',
  difficulty: 'orta',
  concepts: ['react.lists-keys', 'react.state', 'react.derived-state'],
  files: ['MovieNotes.tsx'],
  hints: [
    'React bileşen state’ini konuma ve key’e göre korur.',
    'Key’i `Notes` bileşeni çağrısına ekle.',
    '`<Notes key={id} id={id} />` yeni filmde yeni state oluşturur.',
  ],
})
