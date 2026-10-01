import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama kutusuna etkileşim testi yaz',
  difficulty: 'orta',
  concepts: ['test.user-event', 'test.rtl-queries', 'react.controlled-input'],
  files: ['SearchBox.test.tsx'],
  hints: [
    'Kullanıcının yazdığı metnin inputta kaldığını ve dışarı bildirildiğini ayrı ayrı doğrula.',
    '`userEvent.setup()`, `screen.getByRole()` ve `await user.type()` kullan.',
    'Enter ve düğme aynı form gönderimini yapmalı; boşlukları kırpan değer `onSubmit` çağrısına gitmeli.',
  ],
  testWriting: {
    mutants: [
      { id: 'no-trim', label: 'başındaki ve sonundaki boşlukları koruyan sürüm' },
      { id: 'click-only', label: 'Enter ile gönderimi çalışmayan sürüm' },
    ],
  },
})
