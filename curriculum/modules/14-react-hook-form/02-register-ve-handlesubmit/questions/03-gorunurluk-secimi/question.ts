import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Checkbox ile görünürlük',
  difficulty: 'orta',
  concepts: ['form.rhf-register', 'react.controlled-input', 'ts.omit'],
  files: ['VisibilityForm.tsx'],
  hints: [
    'Textarea görünmese de submit nesnesinde açıklama alanı bulunmalı; görünür checkbox ise boolean olmalı.',
    '`useForm` içindeki `defaultValues` ile başlangıçları tanımla, native checkbox alanını `register` ile kaydet.',
    '`isPublic: false` başlangıcını kur ve form gönderimini `handleSubmit(onSave)` ile bağla.',
  ],
})
