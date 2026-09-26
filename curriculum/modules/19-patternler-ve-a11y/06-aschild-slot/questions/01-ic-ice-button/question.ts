import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'asChild neden gerekli?',
  difficulty: 'orta',
  concepts: ['pattern.slot', 'a11y.basics'],
  question:
    'Modal.Trigger mevcut bir button ile sarıldığında iç içe iki button oluşuyor. asChild ne yapmalı?',
  options: [
    {
      text: 'Tek child öğeyi klonlayıp handler, props ve ref’i birleştirmeli.',
      correct: true,
      explanation: 'Doğru. Tek DOM kontrolü korunur; hem çocuğun hem Trigger’ın davranışı çalışır.',
    },
    {
      text: 'İçteki buttonu CSS ile gizlemeli.',
      explanation: 'Gizlemek semantik ve focus sorununu çözmez.',
    },
    {
      text: 'Dıştaki buttonun onClick değerini silmeli.',
      explanation: 'Böylece modal artık açılmaz; handlerlar birleştirilmelidir.',
    },
    {
      text: 'Child ref’ini her zaman yok saymalı.',
      explanation: 'Çocuğun ref’i focus veya ölçüm için gerekebilir; ref’ler birleştirilir.',
    },
  ],
})
