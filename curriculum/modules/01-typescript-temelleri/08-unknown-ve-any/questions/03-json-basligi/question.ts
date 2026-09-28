import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Ham JSON’dan başlık okuma',
  difficulty: 'orta',
  concepts: ['ts.unknown-any', 'ts.narrowing'],
  files: ['readMovieTitle.ts'],
  hints: [
    'Girdinin nesne olup olmadığını, null olmadığını ve `title` özelliğinin string olduğunu adım adım denetlemeyi düşün.',
    '`typeof raw === "object" && raw !== null && "title" in raw` ile nesneyi, ardından `typeof raw.title === "string"` ile alanı kontrol et.',
    'İskelet: `export function readMovieTitle(raw: unknown): string | null { if (typeof raw === "object" && raw !== null && "title" in raw && typeof raw.title === "string") return raw.title; return null; }`',
    '`raw as Movie` yazmak derleyiciyi sustursa da çalışma zamanında hata cevabını film sanıp uygulamanın bozulmasına yol açar.',
  ],
})
