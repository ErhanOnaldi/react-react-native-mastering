import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Generic neden gerekli?',
  difficulty: 'kolay',
  concepts: ['ts.generics', 'ts.api-types'],
  question: '`Paginated<Movie>` ile `Paginated<Genre>` arasında değişen nedir?',
  options: [
    {
      text: '`results` öğesinin tipi; sayfalama alanları ortak kalır.',
      correct: true,
      explanation: 'Doğru; `T` yalnızca değişken parça için kullanılır.',
    },
    {
      text: 'Sayfa numarasının çalışma zamanı değeri.',
      explanation: 'Generic tip parametresi çalışma zamanı sayısını değiştirmez.',
    },
    {
      text: 'HTTP isteğinin adresi.',
      explanation: 'Tip parametresi istek göndermez veya adres seçmez.',
    },
  ],
})
