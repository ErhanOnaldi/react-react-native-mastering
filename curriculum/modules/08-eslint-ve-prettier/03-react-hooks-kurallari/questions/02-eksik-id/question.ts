import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Eksik id bağımlılığını düzelt',
  difficulty: 'orta',
  concepts: ['react.useEffect.deps', 'router.params', 'tooling.eslint'],
  files: ['detailsSource.ts'],
  hints: [
    'Effect içinde render’dan gelen hangi değer okunuyor?',
    'Dependency array, effect’in okuduğu `id` ile eşleşmeli.',
    'Boş `[]` yerine `[id]` yaz.',
  ],
})
