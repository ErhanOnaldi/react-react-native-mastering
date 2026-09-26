import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Düzenle formu başka kayda geçmiyor',
  difficulty: 'orta',
  concepts: ['form.rhf-reset', 'form.rhf-form-state', 'react.props'],
  files: ['WatchlistEditor.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Form ilk açıldığında `list` prop’undan değer alıyor; prop değiştiğinde de aynı şey olmalı.',
    'Bir prop değişimine tepki vermek için formun varsayılanlarını yeniden uygulaman gerekir.',
    '`list.id` değiştiğinde `reset({ name: list.name, description: list.description })` çağır; `Kaydet`’i yalnızca `formState.isDirty` iken etkinleştir.',
  ],
})
