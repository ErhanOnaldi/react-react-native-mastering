import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Önceki sorguyu hatırla',
  difficulty: 'orta',
  concepts: ['react.useRef', 'react.useEffect', 'react.useEffect.deps'],
  files: ['PreviousQuery.tsx'],
  hints: [
    '“Önceki” değer, bu render’dan önce saklanmış değer olmalı.',
    'Ref güncellemesi render tetiklemez; effect ise render sonrasında çalışır.',
    'Render önce `previous.current` değerini okur; `useEffect(() => { previous.current = query }, [query])` sonrasında günceller.',
  ],
})
