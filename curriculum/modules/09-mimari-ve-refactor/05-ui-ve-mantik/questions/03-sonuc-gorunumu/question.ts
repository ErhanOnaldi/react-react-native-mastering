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
    'Önce `status` alanıyla dallan.',
    'loading ve error için kullanıcıya okunabilir metin ver.',
    'success durumunda `movies.length` sıfırsa ayrı boş mesajı göster; doluysa liste oluştur.',
  ],
})
