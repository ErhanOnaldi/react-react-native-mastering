import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Dönüşen form değerini tiple',
  difficulty: 'orta',
  concepts: ['zod.resolver', 'zod.transform', 'form.rhf-register'],
  files: ['RatingForm.tsx'],
  hints: [
    'HTML number input değerinin ham halde string olduğunu düşün.',
    'Şemayı `z.coerce.number().int().min(1).max(5)` kur; callback tipinin şema çıktısı olduğunu belirt.',
    '`z.input<typeof schema>` ve `z.output<typeof schema>` değerlerini ilk ve üçüncü RHF generic parametresinde kullan.',
    '`handleSubmit` sonucundaki rating’i `onSave`e number olarak ver; `errors.rating` için alert göster.',
  ],
})
