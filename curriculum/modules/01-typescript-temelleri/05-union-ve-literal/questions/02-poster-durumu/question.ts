import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Poster durumu union’ı',
  difficulty: 'kolay',
  concepts: ['ts.union', 'ts.literal'],
  files: ['posterState.ts'],
  hints: [
    'Hem `null` hem de boş metin durumunu önceden ele almayı düşün.',
    '`type PosterState = "missing" | "ready"` tipini tanımlayıp `if (!path)` veya açık eşitlik kontrolü yapabilirsin.',
    'İskelet: `export type PosterState = "missing" | "ready"; export function posterState(path: string | null): PosterState { if (path === null || path === "") return "missing"; return "ready"; }`',
    'Girdi tipi `string | null` olduğu için kontrol yapmadan önce `.startsWith()` çağırmak çalışma zamanında hataya yol açar.',
  ],
})
