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
      text: '`field.index`',
      correct: false,
      explanation:
        'Dizi sırası değişince indeks de değişir; React satır kimliği için sabit değer gerekir.',
    },
    {
      text: 'API kaydının `id` alanı, her durumda `field.id` yerine',
      correct: false,
      explanation:
        'Domain id yararlı olabilir; bu field array satırının React kimliği olarak RHF `field.id` değerini verir.',
    },
  ],
})
