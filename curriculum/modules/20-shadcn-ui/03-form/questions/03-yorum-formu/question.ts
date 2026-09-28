import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'shadcn form katmanını kendin yaz',
  difficulty: 'zor',
  concepts: [
    'form.a11y',
    'form.rhf-controller',
    'form.rhf-errors',
    'pattern.slot',
    'pattern.compound',
    'react.useId',
    'shadcn.components',
  ],
  files: ['form.tsx'],
  hints: [
    'Önce üç bağlantıyı ayrı düşün: RHF alan adı, her alanın DOM kimliği ve o alana ait hata.',
    'React `useId`, RHF `useFormContext`/`useFormState` ve Radix `Slot.Root` bu bağlantıları kurmak için gerekli araçlardır.',
    "FormItem'da id üretip Context'e koy; `useFormField` iki Context'i ve alan hatasını birleştirsin. Label `htmlFor`, mesaj `id` ile bağlansın.",
    'Kontrol tek çocuk olmalı; `aria-describedby` yalnız hata varsa verilsin ve `FormMessage` hata yokken `null` dönsün.',
  ],
  preview: { entry: 'Preview.tsx' },
})
