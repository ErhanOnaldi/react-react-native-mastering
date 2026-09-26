import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama durumu haritası',
  difficulty: 'orta',
  concepts: ['arch.state-categories', 'router.search-params', 'react.state'],
  files: ['SearchWorkspace.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Paylaşılacak metin ve sayfa ile geçici panel durumunun ömrü farklı.',
    'Arama ve sayfayı URL parametrelerinden oku; paneli yerel state ile yönet.',
    'URL değişince sonucu yeniden iste; paneli kapat. Eski isteğin geç gelmesi yeni ekranı bozmamalı.',
  ],
})
