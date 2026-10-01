import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Dosyanın sahibi',
  difficulty: 'kolay',
  concepts: ['arch.feature-folders', 'arch.colocation'],
  question: `Arama kutusu yalnız arama sayfasında kullanılıyor. Film detay ekranı da aynı genel input stilini kullanıyor ama kendi arama davranışına ihtiyaç duymuyor. Hangi dosya yerleşimi iki sorumluluğu da açık tutar?`,
  options: [
    {
      text: 'SearchBox features/search içinde; genel input görünümü shared/ui içinde',
      correct: true,
      explanation:
        'SearchBox arama davranışına ait; yalnız ortak ve aynı işi yapan görsel parça shared olabilir.',
    },
    {
      text: 'SearchBox ve input stilini features/search içine kopyala',
      explanation:
        'Ortak görünümün iki kopyası zamanla ayrışır; gerçek ortak parçayı paylaşabilirsin.',
    },
    {
      text: 'SearchBox ve genel input bileşenini birlikte shared/ui içine koy',
      explanation:
        'Bu erken genelleme SearchBox’ın yalnız aramaya ait davranışını shared içine taşır.',
    },
    {
      text: 'SearchBox’ı features/movies içinde tut',
      explanation: 'Filmler özelliği arama alanının sahibi değildir.',
    },
  ],
})
