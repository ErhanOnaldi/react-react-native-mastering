import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Esnek kart',
  difficulty: 'kolay',
  concepts: ['react.composition'],
  question: `Bir \`MoviePanel\` başlığı ve içeriği gösteriyor. Bir kullanım favori düğmesi, diğeri puan bağlantısı vermek istiyor. Çerçevenin bu iki eylemin HTML kodunu bilmemesi için hangisi iyi bir API?`,
  options: [
    {
      text: 'Çağıranın JSX olarak verdiği eylemi `actions` alanında kabul etmek.',
      correct: true,
      explanation: 'Panel yerleşimi yönetir, kullanan ekran kendi uygun eylemini seçer.',
    },
    {
      text: '`showFavorite` ve `showRating` boolean alanlarını eklemek.',
      explanation:
        'Panel her yeni eylem türünü tanımak zorunda kalır ve seçenek kombinasyonları artar.',
    },
    {
      text: 'Favori düğmesi ile puan bağlantısını her panelde birlikte göstermek.',
      explanation:
        'Çağıran yalnızca birini istese de ikisi görünür; panel kullanıma karar veremez.',
    },
    {
      text: 'Panel içinde film id’sini kullanıp eylemi orada üretmek.',
      explanation:
        'Bu paneli belirli bir veri ve davranışa bağlar; farklı ekranların kendi eylemini vermesi zorlaşır.',
    },
  ],
})
