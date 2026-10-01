import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Vite ve oxlint',
  difficulty: 'kolay',
  concepts: ['tooling.eslint', 'tooling.prettier'],
  question: `Sinema'nın ESLint config'i eksik effect bağımlılığını yakalıyor. Yeni bir lint aracı denemek istiyorsun. Geçişten önce en yararlı küçük deneme hangisi?`,
  options: [
    {
      text: 'Aday aracı aynı eksik bağımlılık örneğinde çalıştırıp mesajları karşılaştırırım.',
      correct: true,
      explanation: 'Aynı örnek, mevcut kontrolün kaybolup kaybolmadığını gösterir.',
    },
    {
      text: 'Aracın daha hızlı olduğunu varsayıp ESLint config’ini hemen silerim.',
      explanation: 'Hız tek başına gerekli React Hook kuralının korunduğunu göstermez.',
    },
    {
      text: 'Aday aracın adını okuyup bütün React kurallarını desteklediğini kabul ederim.',
      explanation: 'Araç adı kural kapsamını kanıtlamaz; örnek dosyada sınamak gerekir.',
    },
    {
      text: 'Yalnız geçerli bir dosyada çalıştırırım; hata örneğine gerek yoktur.',
      explanation: 'Temiz dosya, aday aracın eksik bağımlılığı fark edip etmediğini göstermez.',
    },
  ],
  explanation: '',
})
