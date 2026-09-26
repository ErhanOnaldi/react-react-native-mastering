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
    'Önce kimlik: `FormItem` içinde `useId()` ile id üret ve `<FormItemContext value={{ id }}>` ile sar. `useFormField` iki Context’i okuyup `${id}-control` ve `${id}-message` kimliklerini döndürsün.',
    'Hata için `const { getFieldState } = useFormContext()` ve `const formState = useFormState({ name })`; sonra `getFieldState(name, formState).error`. Label `htmlFor={formItemId}`, mesaj `id={formMessageId}`.',
    '`FormControl`: `<Slot.Root id={formItemId} aria-invalid={Boolean(error)} aria-describedby={error ? formMessageId : undefined} {...props} />`. `FormMessage`: hata yoksa `null`.',
  ],
  preview: { entry: 'Preview.tsx' },
})
