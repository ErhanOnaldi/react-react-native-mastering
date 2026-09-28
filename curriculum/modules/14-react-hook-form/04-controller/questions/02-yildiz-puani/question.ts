import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yıldız seçimini Controller ile bağla',
  difficulty: 'orta',
  concepts: ['form.rhf-controller', 'form.rhf-errors', 'react.controlled-input'],
  files: ['StarReviewForm.tsx'],
  hints: [
    'Yıldız kontrolü bir DOM input değil; arayüz seçimini ve submit değerini tek kaynakta tut.',
    'RHF `Controller` ile controlled bileşeni bağlar; native yorum alanı `register` ile kalabilir.',
    "`defaultValues.rating` için 0 ver, `field.value`/`field.onChange` bağla ve `rules` içinde `min: { value: 1, message: 'Puan seç' }` tanımla.",
  ],
})
