import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tipli poster çerçevesi',
  difficulty: 'kolay',
  concepts: ['react.props', 'react.children', 'ts.optional-nullable'],
  files: ['PosterFrame.tsx'],
  hints: [
    'Çağıran hem metin hem JSX verebilmeli; açıklama ise gelmeyebilir.',
    '`ReactNode` children içeriğini, `caption?: string` isteğe bağlı açıklamayı tipler.',
    '`figure` içinde children ve varsayılanı “Afiş yok” olan `figcaption` döndür.',
  ],
})
