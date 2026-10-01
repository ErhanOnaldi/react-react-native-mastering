import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'TMDB detayı nerede yaşar?',
  difficulty: 'kolay',
  concepts: ['redux.server-vs-client'],
  question: '`/movie/550` cevabı arka planda yenileniyor. Hangi state sahibi doğru?',
  options: [
    {
      text: 'TanStack Query cache’i; favori slice’ında sadece 550 ID’si.',
      correct: true,
      explanation:
        'Sorgu cache’i yenileme ve geçerlilik süresini yönetir; favori kişisel client state’tir.',
    },
    {
      text: 'Tam MovieDetails nesnesi favoritesSlice içinde.',
      correct: false,
      explanation: 'Aynı sunucu verisini kopyalamak iki kaynak ve bayat veri üretir.',
    },
    {
      text: 'Sayfa component’inin yerel state’inde; her ziyaret kendi kopyasını yükler.',
      correct: false,
      explanation:
        'Yerel state bir sayfanın geçici görünümünü tutabilir; sunucu verisinin cache ve yenileme yaşam döngüsünü sağlamaz.',
    },
  ],
})
