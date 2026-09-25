import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Silince hangi key?',
  difficulty: 'kolay',
  concepts: ['form.rhf-field-array', 'react.lists-keys'],
  question: 'Etiketler arasından ortadakini sildin. `fields.map` için hangi key uygundur?',
  options: [
    {
      text: '`field.id`',
      correct: true,
      explanation: 'RHF 7 bu sabit kimliği özellikle liste key’i için verir.',
    },
    {
      text: 'Dizi indeksi',
      correct: false,
      explanation:
        'Silme sonrası indeksler değişir; React eski satır durumunu başka satıra taşıyabilir.',
    },
    {
      text: 'Etiket metni',
      correct: false,
      explanation: 'Metin boş veya tekrarlı olabilir; key benzersiz ve kararlı olmalı.',
    },
    {
      text: 'Her render’da `Math.random()`',
      correct: false,
      explanation: 'Her render’da yeni key bütün satırları yeniden mount eder.',
    },
  ],
})
