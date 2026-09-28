import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Favori butonuna kullanıcı testi',
  difficulty: 'orta',
  concepts: ['test.user-event', 'test.rtl-queries', 'react.events'],
  files: ['FavoriteButton.test.tsx'],
  hints: [
    'Callback’i tek başına çağırma; kullanıcıya sunulan kontrol ve durum adını birlikte düşün.',
    '`render`, `screen.getByRole`, `userEvent.setup()` ve `await user.click(...)` kullan.',
    '`vi.fn()` callback’i kaydetsin; başlangıç ve tıklama sonrası erişilebilir adları doğrula.',
  ],
  testWriting: {
    mutants: [
      { id: 'disabled', label: 'tıklamayı engelleyen sürüm' },
      { id: 'wrong-label', label: 'favori durumunda yanlış ad gösteren sürüm' },
    ],
  },
})
