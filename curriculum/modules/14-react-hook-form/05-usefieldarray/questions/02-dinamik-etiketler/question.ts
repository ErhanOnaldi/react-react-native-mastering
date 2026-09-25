import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Etiket ekle ve sil',
  difficulty: 'orta',
  concepts: ['form.rhf-field-array', 'react.lists-keys', 'form.rhf-register'],
  files: ['TagForm.tsx'],
  hints: [
    "Alan sayısı değişiyor; `useFieldArray({ control, name: 'tags' })` kullan.",
    '`fields` listesini `field.id` ile map et; her input `tags.${index}.value` yoluna register olsun.',
    'Ekleme ve silme düğmeleri `type="button"` olmalı; `append({value: \'\'})` ve `remove(index)` kullan.',
  ],
})
