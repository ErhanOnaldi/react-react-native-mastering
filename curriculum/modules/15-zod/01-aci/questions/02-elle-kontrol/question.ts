import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kontrol nerede büyür?',
  difficulty: 'kolay',
  concepts: ['ts.type-guards', 'ts.unknown-any'],
  question:
    'Başlık için `typeof raw.title === "string"` yazdın. `credits.cast[].name` de güvenilir olsun istiyorsun. En doğru çıkarım hangisi?',
  options: [
    {
      text: 'İç içe her alanı ayrıca kontrol etmelisin.',
      correct: true,
      explanation:
        'Doğru. Type guard tek alanı korur; dizi ve alt nesneler kendi kontrollerini ister.',
    },
    {
      text: 'Dış nesnenin object olması tüm alanları kanıtlar.',
      correct: false,
      explanation: 'Bir nesne alanları eksik ya da yanlış tipte olabilir.',
    },
    {
      text: '`as MovieDetails` bütün alt nesneleri denetler.',
      correct: false,
      explanation: 'Type assertion derlemeden sonra silinir; veri aynı kalır.',
    },
  ],
})
