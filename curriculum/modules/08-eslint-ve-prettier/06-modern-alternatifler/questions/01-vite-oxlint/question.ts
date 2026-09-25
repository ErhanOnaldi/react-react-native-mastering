import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Vite ve oxlint',
  difficulty: 'kolay',
  concepts: ['tooling.eslint', 'tooling.prettier'],
  question:
    'Yeni create-vite React TS template’inde oxlint var. Sinema’daki `react-hooks/exhaustive-deps` ihtiyacın için nasıl karar verirsin?',
  options: [
    {
      text: 'Mevcut kural kapsamını ve çıktısını karşılaştırır, gerekirse ESLint’i korurum.',
      correct: true,
      explanation: 'Araç seçimi somut kurallara ve projedeki hatalara dayanır.',
    },
    {
      text: 'Template oxlint getirdiyse ESLint artık hiçbir projede çalışmaz.',
      explanation: 'ESLint 10 hâlâ geçerli ve geniş bir eklenti ekosistemine sahip.',
    },
    {
      text: 'Oxlint’i ekleyince Prettier otomatik olarak Hook bağımlılıklarını düzeltir.',
      explanation: 'Formatter Hook mantığını düzeltmez.',
    },
    {
      text: 'Bütün lint kurallarını kapatıp yalnızca hız ölçerim.',
      explanation: 'Hız, kaçırılan eski film hatasını telafi etmez.',
    },
  ],
  explanation: '',
})
