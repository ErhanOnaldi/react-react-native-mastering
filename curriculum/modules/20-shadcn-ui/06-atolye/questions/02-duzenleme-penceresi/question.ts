import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Düzenleme penceresi',
  difficulty: 'orta',
  concepts: ['form.rhf-reset', 'zod.resolver', 'a11y.focus'],
  files: ['EditDialog.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Açık pencere yeni props alabilir. Hangi kayıt değişimi formu sıfırlamalı, hangi render ise kullanıcının yazısını korumalı?',
    'RHF `reset`-i seçili kaydın `id` değerine bağla; Zod schema/resolver ile alan hatalarını üret.',
    "Schema'yı `zodResolver` ile bağla ve `useForm`-a `shouldFocusError` davranışını açık bırak; alanlara label ver.",
    "Parent her render'da aynı kaydı yeni obje olarak verirse formu sıfırlama; değişen kayıt kimliğini izle.",
  ],
})
