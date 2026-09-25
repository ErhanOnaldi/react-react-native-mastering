import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema biçimlendirme yardımcıları',
  difficulty: 'orta',
  concepts: [
    'ts.functions',
    'ts.narrowing',
    'ts.optional-nullable',
    'js.dates',
    'js.string-formatting',
  ],
  project: 'sinema',
  focusFiles: ['src/lib/format.ts'],
  hints: [
    'Üç fonksiyonda da parametre ve dönüş tipini açık yaz; boş tarihi en başta ayır.',
    '`formatVote` için 0 özel durum, diğerleri `.toFixed(1)`. `releaseYear` için ilk dört karakter yeterli.',
    "`formatDate` için `Intl.DateTimeFormat(\'tr-TR\', { day: \'numeric\', month: \'long\', year: \'numeric\', timeZone: \'UTC\' })` kullanabilirsin.",
  ],
})
