import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kullanıcı sözleşmesi',
  difficulty: 'kolay',
  concepts: ['test.what-to-test', 'arch.separation-of-concerns'],
  question:
    'Sayfalama helper’ı yeniden yazılacak. Hangi assertion refactor’a dayanırken hatayı yakalar?',
  options: [
    {
      text: '`page=2` için oluşan URL’nin `page` parametresi `2` olmalı',
      correct: true,
      explanation: 'Görünen ağ sözleşmesi sabittir; içteki URL kurma yöntemi değişebilir.',
    },
    {
      text: 'Helper içinde `URLSearchParams` tam bir kez oluşturulmalı',
      correct: false,
      explanation: 'Aynı URL başka yöntemlerle kurulabilir; bu sayı kullanıcı sonucunu ölçmez.',
    },
    {
      text: 'Yerel değişkenin adı `pageNumber` olmalı',
      correct: false,
      explanation: 'Değişken adı yanlış sayfa hatasını yakalayamaz.',
    },
  ],
})
