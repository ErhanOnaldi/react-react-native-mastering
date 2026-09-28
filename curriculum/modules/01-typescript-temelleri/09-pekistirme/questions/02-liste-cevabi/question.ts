import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Liste cevabını modelle',
  difficulty: 'orta',
  concepts: ['ts.api-types', 'ts.arrays-tuples', 'ts.type-vs-interface'],
  files: ['tmdbList.ts'],
  hints: [
    'Cevap nesnesinin `results` alanındaki her filmden başlığı almayı düşün.',
    '`interface Movie` ve `interface MovieListResponse` arayüzlerini tanımladıktan sonra `response.results.map(m => m.title)` ifadesini kullan.',
    'İskelet: `export interface Movie { id: number; title: string; poster_path: string | null; release_date: string; }; export interface MovieListResponse { page: number; results: Movie[]; total_pages: number; total_results: number; }; export function pageTitles(response: MovieListResponse): string[] { return response.results.map(m => m.title); }`',
    '`results` dizisindeki `poster_path` alanını `string` olarak bırakma; `string | null` olmalıdır.',
  ],
})
