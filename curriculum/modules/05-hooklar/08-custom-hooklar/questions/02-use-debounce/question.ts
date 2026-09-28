import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Yazmayı bekleyen hook',
  difficulty: 'orta',
  concepts: ['react.custom-hooks', 'react.useEffect.cleanup', 'react.useEffect.deps'],
  files: ['useDebounce.ts'],
  hints: [
    'Dönen değer ile en son gelen değer her zaman aynı anda değişmek zorunda değil.',
    'Gecikmiş değer için state kullan; süreyi yönetmek için effect içinde timer kur.',
    '`useEffect(() => { const id = setTimeout(...); return () => clearTimeout(id) }, [value, delay])` iskeleti yeterli.',
  ],
})
