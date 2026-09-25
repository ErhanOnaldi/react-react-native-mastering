import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama akışına kullanıcı testi yaz',
  difficulty: 'orta',
  concepts: ['test.user-event', 'test.async', 'test.msw-overrides', 'test.factories'],
  files: ['SearchPanel.test.tsx'],
  hints: [
    'userEvent.setup ile yazıp butona bas.',
    'Başlangıç loading’i getByRole, sonucu findByRole ile sorgula.',
    'Her farklı API senaryosunda server.use(http.get(...)) kur.',
  ],
  testWriting: {
    mutants: [
      { id: 'no-empty', label: 'boş listede mesaj göstermeyen sürüm' },
      { id: 'no-error', label: 'sunucu hatasını gizleyen sürüm' },
    ],
  },
})
