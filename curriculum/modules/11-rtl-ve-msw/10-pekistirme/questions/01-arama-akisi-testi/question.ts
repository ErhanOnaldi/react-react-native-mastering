import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama akışına kullanıcı testi yaz',
  difficulty: 'orta',
  concepts: ['test.user-event', 'test.async', 'test.msw-overrides', 'test.factories'],
  files: ['SearchPanel.test.tsx'],
  hints: [
    'Başarı, boş yanıt ve sunucu hatası için kullanıcının göreceği farklı kanıtları listele.',
    '`userEvent.setup`, `server.use`, MSW `http.get` ve gecikme için `delay` kullan.',
    'Loading’i `getByRole`, sonradan gelen heading/alert’i `findByRole` ile doğrula; request günlüğünde query’yi denetle.',
  ],
  testWriting: {
    mutants: [
      { id: 'no-empty', label: 'boş listede mesaj göstermeyen sürüm' },
      { id: 'no-error', label: 'sunucu hatasını gizleyen sürüm' },
    ],
  },
})
