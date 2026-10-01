import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Eksik id bağımlılığını düzelt',
  difficulty: 'orta',
  concepts: ['react.useEffect.deps', 'router.params', 'tooling.eslint'],
  files: ['detailsSource.ts'],
  hints: [
    'Bileşen her başlık güncellemesinde neyi okumalı? Önce bu girdiyi adlandır.',
    '`useEffect` callback’i ve dependency array’i bileşenin içinde birlikte yazılır.',
    "`useEffect(() => { document.title = 'Film ' + id }, [id])` biçiminde effect'i kur.",
  ],
})
