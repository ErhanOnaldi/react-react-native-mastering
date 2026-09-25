import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'TMDB sonucu nereye ait?',
  difficulty: 'kolay',
  concepts: ['arch.state-categories', 'fetch.basics'],
  question: 'TMDB’den gelen trend filmler sunucuda değişebilir. Bu veri hangi state kategorisidir?',
  options: [
    {
      text: 'Server state',
      correct: true,
      explanation:
        'Doğru. Kaynağı TMDB; yeniden çekme, hata ve daha sonra cache davranışı gerekir.',
    },
    {
      text: 'Client state',
      explanation: 'Client state kullanıcının yerel tercihidir; trend listesinin sahibi TMDB’dir.',
    },
    {
      text: 'URL state',
      explanation:
        'URL sayfa ve filtre seçimini taşıyabilir; sunucudan gelen listenin kendisini taşımaz.',
    },
    {
      text: 'Form state',
      explanation: 'Form state henüz gönderilmemiş alan değeridir, API sonucu değil.',
    },
  ],
})
