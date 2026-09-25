import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Önceki sorguyu hatırla',
  difficulty: 'orta',
  concepts: ['react.useRef', 'react.useEffect', 'react.useEffect.deps'],
  files: ['PreviousQuery.tsx'],
  hints: [
    'Ref güncellemesi render tetiklemez.',
    'Render önce eski ref’i okur; effect render sonrasında yeni query’yi yazar.',
    '`useEffect(() => { previous.current = query }, [query])` kur.',
  ],
})
