import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film seçimi değişiyor, özet kalıyor',
  difficulty: 'orta',
  concepts: ['react.derived-state', 'react.state'],
  files: ['MovieSummary.tsx'],
  hints: [
    'Ekranda hangi bilgi gerçekten değişiyor, hangisi ondan hesaplanabilir?',
    'Özeti ayrı state’te tutarsan seçim ile nasıl uyumlu kalacağını da yönetmen gerekir.',
    'Seçilen id’den filmi her render’da bulup özeti doğrudan göster; yalnızca id state’te kalsın.',
  ],
  preview: { entry: 'Preview.tsx' },
})
