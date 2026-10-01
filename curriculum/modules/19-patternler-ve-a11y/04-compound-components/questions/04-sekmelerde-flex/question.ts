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
      text: 'Tek DOM listesini `flex-row-reverse` ile göstermek.',
      correct: false,
      explanation:
        'Görsel sıra DOM sırasının tersi olur; ok tuşuyla dolaşma ve ekrandaki sıra birbiriyle uyuşmaz.',
    },
    {
      text: 'Her sekme grubunu ayrı `flex` satırı yapıp aria tablist ilişkisini CSS ile sürdürmek.',
      correct: false,
      explanation:
        'CSS ayrı listeler arasındaki DOM ve klavye ilişkisini kuramaz; tek tablist içinde sarma kullan.',
    },
  ],
})
