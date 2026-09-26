import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Sekme sırası ve dar ekran',
  difficulty: 'orta',
  concepts: ['tailwind.layout', 'pattern.compound'],
  question:
    'Compound `Tabs.List` içinde üç sekme var. Klavye ile ok tuşu sırası DOM sırasını izlesin, dar ekranda sekmeler alt satıra geçsin. Hangi Tailwind düzeni uygun?',
  options: [
    {
      text: 'Tek DOM listesi üzerinde `flex flex-wrap gap-2` kullanmak.',
      correct: true,
      explanation: 'Doğru. DOM sırası değişmez; flex-wrap yalnız görsel satır kırılımını yönetir.',
    },
    {
      text: 'Aynı sekmeleri her satır için ayrı DOM listesinde çoğaltmak.',
      correct: false,
      explanation: 'Çift DOM öğeleri odak ve erişilebilir ad sırasını karmaşıklaştırır.',
    },
    {
      text: '`absolute` konum verip sekmeleri üst üste taşımak.',
      correct: false,
      explanation: 'Mutlak konumlandırma dar ekranda doğal satır kırılımı sağlamaz.',
    },
  ],
})
