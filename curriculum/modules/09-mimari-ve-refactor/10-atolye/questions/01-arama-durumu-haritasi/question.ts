import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama durumu haritası',
  difficulty: 'orta',
  concepts: ['arch.state-categories', 'router.search-params', 'react.state'],
  files: ['SearchWorkspace.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Hangi seçimler bağlantıyla paylaşılır, hangisi yalnız geçici görünüm tercihidir?',
    '`useSearchParams` ile URL state, React local state ile panel görünürlüğü yönetilebilir.',
    'q/page değişimini URL ile sür, arama boşken isteği engelle ve route parametre değişiminde paneli kapat.',
    'Yeni arama başlarken eski cevabın ekrana yazılmasını önle.',
  ],
})
