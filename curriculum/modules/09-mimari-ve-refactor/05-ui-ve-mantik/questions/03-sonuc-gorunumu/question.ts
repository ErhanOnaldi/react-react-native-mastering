import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Duruma göre görünüm',
  difficulty: 'orta',
  concepts: [
    'arch.separation-of-concerns',
    'ts.discriminated-union',
    'react.conditional-rendering',
  ],
  files: ['MovieResult.tsx'],
  hints: [
    'Dört görünür durumdan hangilerinde liste gerçekten anlamlı?',
    "Discriminated union'ı `status` alanıyla daralt; JSX conditional rendering kullan.",
    'Loading/error dallarını ayır; success içinde boş diziyi kontrol edip dolu halde id ile `<li>` üret.',
  ],
})
