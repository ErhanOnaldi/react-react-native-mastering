import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yıldızlar neden register ile bağlanmıyor?',
  difficulty: 'kolay',
  concepts: ['form.rhf-controller', 'react.controlled-input'],
  question:
    '`RatingStars` yalnızca `value` ve `onChange` prop’ları alıyor. RHF ile en uygun bağlantı hangisi?',
  options: [
    {
      text: '`Controller` içindeki `field.value` ve `field.onChange` prop’larını aktar.',
      correct: true,
      explanation: 'Controller controlled bileşene RHF durumunu bağlar.',
    },
    {
      text: '`register("rating")` sonucunu herhangi bir prop’a yay; ref gerekmiyor.',
      correct: false,
      explanation: '`register` native input ref ve event düzenine dayanır.',
    },
    {
      text: 'Yıldız değerini local state’te tutup submit öncesi RHF değerine yaz.',
      correct: false,
      explanation:
        'Bu yaklaşım iki değer kaynağı ve ek senkronizasyon işi yaratır; form alanı tek kaynakta kalmalı.',
    },
    {
      text: '`register` sonucunu `value` ve `onChange` prop’larına ver.',
      correct: false,
      explanation:
        '`register` native input ref/event sözleşmesi içindir; özel bileşenin API’sine uyan köprü gerekir.',
    },
  ],
})
