import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yıldız seçimini Controller ile bağla',
  difficulty: 'orta',
  concepts: ['form.rhf-controller', 'form.rhf-errors', 'react.controlled-input'],
  files: ['StarReviewForm.tsx'],
  hints: [
    '`RatingStars` native input değil; `Controller` kullan.',
    '`field.value` ve `field.onChange` değerlerini yıldız bileşenine aktar.',
    'En az 1 puan kuralı ekle ve hatayı alert olarak göster.',
  ],
})
