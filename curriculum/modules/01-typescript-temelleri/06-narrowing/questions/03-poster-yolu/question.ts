import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Poster yolunu daralt',
  difficulty: 'kolay',
  concepts: ['ts.narrowing', 'ts.optional-nullable'],
  files: ['posterPath.ts'],
  hints: [
    'Metin fonksiyonlarını çağırmadan önce `null` ve boş metin durumlarını erken dönüşle elemeyi düşün.',
    '`if (path === null || path === "") return null` ile daraltma yapıp ardından `.startsWith("/")` kontrolü uygulayabilirsin.',
    'İskelet: `export function posterPath(path: string | null): string | null { if (!path) return null; return path.startsWith("/") ? path : `/${path}`; }`',
    '`path` parametresi `string | null` olduğu için kontrol yapmadan `.startsWith("/")` çağırmak çalışma zamanında sayfanın çökmesine yol açar.',
  ],
})
