import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film özeti ve opsiyonel alan',
  difficulty: 'kolay',
  concepts: ['ts.object-types', 'ts.optional-nullable', 'ts.type-vs-interface'],
  files: ['movieSummary.ts'],
  hints: [
    'Sloganın var olup olmadığını kontrol ederken opsiyonel alanların `undefined` olabileceğini göz önünde bulundur.',
    '`interface` içinde opsiyonel alan için `?`, null olabilen alan için `| null` sözdizimini kullan.',
    'İskelet: `export interface MovieSummary { readonly id: number; title: string; poster_path: string | null; tagline?: string; }`',
    '`tagline` alanını `string | null` olarak değil, opsiyonel (`tagline?: string`) olarak tanımlamalısın; aksi halde test tip kontrolünde kalır.',
  ],
})
