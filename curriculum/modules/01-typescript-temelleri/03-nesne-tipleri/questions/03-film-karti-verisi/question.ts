import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Karta giden veri',
  difficulty: 'kolay',
  concepts: ['ts.object-types', 'js.destructuring'],
  files: ['cardData.ts'],
  hints: [
    'Fonksiyonun sadece ihtiyaç duyduğu üç alanı (`id`, `title`, `vote_average`) içeren bir nesne tipi tanımlamayı düşün.',
    'Puanı tek basamağa yuvarlamak için `.toFixed(1)` metodunu kullanabilirsin.',
    'İskelet: `export type CardMovie = { id: number; title: string; vote_average: number; }; export function cardData(movie: CardMovie) { return { id: movie.id, label: `${movie.title} (${movie.vote_average.toFixed(1)})` }; }`',
    'Tam sayılarda (ör. `8`) `.0` ekini kaybetmemek için `Math.round` yerine `.toFixed(1)` kullanmalısın.',
  ],
})
