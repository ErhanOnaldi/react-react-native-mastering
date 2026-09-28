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
    '`Intl.DateTimeFormat` ile Türkçe ve UTC ayarlarıyla uzun tarih biçimlendirmeyi düşün.',
    '`formatVote` için `.toFixed(1)`, `formatDate` için `new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })` kullan.',
    'İskelet: `export function formatVote(n: number): string { if (n === 0) return "Henüz oy yok"; return n.toFixed(1); } export function releaseYear(date: string): string { if (!date) return ""; return date.slice(0, 4); }`',
    '`releaseYear` boş tarihte boş string (`""`) dönerken `formatDate` boş tarihte `"Tarih yok"` döner; iki fonksiyonun boş değer sözleşmesi farklıdır.',
  ],
})
