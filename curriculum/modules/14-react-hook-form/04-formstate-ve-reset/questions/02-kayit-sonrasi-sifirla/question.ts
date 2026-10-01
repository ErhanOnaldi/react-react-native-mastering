import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Başarılı kayıttan sonra sıfırla',
  difficulty: 'orta',
  concepts: ['form.rhf-form-state', 'form.rhf-reset', 'js.async-await'],
  files: ['ResettableForm.tsx'],
  hints: [
    '`defaultValues` kirli durumun karşılaştırma noktasıdır.',
    '`isDirty` ve `isSubmitting` ile butonu yönet.',
    '`await save(values)` başarılı bitince `reset()` çağır; hata olursa girdi kalsın.',
  ],
})
