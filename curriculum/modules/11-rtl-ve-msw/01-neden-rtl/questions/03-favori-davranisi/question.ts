import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Favori butonuna kullanıcı testi',
  difficulty: 'orta',
  concepts: ['test.user-event', 'test.rtl-queries', 'react.events'],
  files: ['FavoriteButton.test.tsx'],
  hints: [
    'Önce getByRole ile erişilebilir adı bul.',
    'userEvent.setup() ve await user.click(...) kullan.',
    'vi.fn() ile callback’i izle; ikinci render’da favori adını doğrula.',
  ],
  testWriting: {
    mutants: [
      { id: 'disabled', label: 'tıklamayı engelleyen sürüm' },
      { id: 'wrong-label', label: 'favori durumunda yanlış ad gösteren sürüm' },
    ],
  },
})
