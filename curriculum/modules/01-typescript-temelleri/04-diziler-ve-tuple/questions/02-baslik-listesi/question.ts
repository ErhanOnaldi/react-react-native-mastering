import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Posterli film başlıkları',
  difficulty: 'kolay',
  concepts: ['ts.arrays-tuples', 'js.array-methods'],
  files: ['movieTitles.ts'],
  hints: [
    'Önce posteri null olmayan filmleri ayırıp ardından her filmden başlığı almayı düşün.',
    'Diziyi `.filter(m => m.poster_path !== null)` ile filtreleyip ardından `.map(m => m.title)` ile dönüştürebilirsin.',
    'İskelet: `export type ListMovie = { title: string; poster_path: string | null }; export function movieTitles(movies: ListMovie[]): string[] { return movies.filter(m => m.poster_path !== null).map(m => m.title); }`',
    'Girdi dizisini mutasyona uğratmadan yeni bir dizi döndürdüğünden emin ol.',
  ],
})
