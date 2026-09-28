import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Etiket ekle ve sil',
  difficulty: 'orta',
  concepts: ['form.rhf-field-array', 'react.lists-keys', 'form.rhf-register'],
  files: ['TagForm.tsx'],
  hints: [
    'Satır sırası değişince React aynı DOM alanını başka etikete vermemeli; kimlik ile konumu ayrı düşün.',
    "RHF'nin `useFieldArray` API'si bu listeyi yönetir; render key'i olarak `field.id` kullan.",
    '`fields.map` içinde `register(\`tags.${index}.value\`)` bağla; `append({ value: \'\' })`, `remove(index)` ve `type="button"` kullan.',
  ],
})
