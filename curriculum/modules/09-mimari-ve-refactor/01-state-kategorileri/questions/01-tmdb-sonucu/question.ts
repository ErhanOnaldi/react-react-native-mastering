import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'TMDB sonucu nereye ait?',
  difficulty: 'kolay',
  concepts: ['arch.state-categories', 'fetch.basics'],
  question: `Bir ekranda iki değer var: TMDB'den yeni gelen film listesi ve kullanıcının bu tarayıcıda yıldızladığı film id'leri. Hangisi server state'tir?`,
  options: [
    {
      text: 'TMDB film listesi',
      correct: true,
      explanation: 'TMDB listeyi belirler; yıldız seçimini ise bu cihazdaki kullanıcı yapar.',
    },
    {
      text: 'Yıldızlanan film id’leri',
      explanation: 'Bu kullanıcının yerel tercihidir; TMDB yanıtı değildir.',
    },
    {
      text: 'İki değer de server state',
      explanation:
        'Yıldız seçimini kullanıcı yaptı; tüm liste TMDB’den gelse de bu seçim sunucuya ait değil.',
    },
    {
      text: 'İki değer de client state',
      explanation: 'Yıldızlar yerel tercih olsa da TMDB listesinin kaynağı sunucudur.',
    },
  ],
})
