import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Boş rozetin sebebi',
  difficulty: 'orta',
  concepts: ['ts.record', 'ts.readonly', 'ts.literal'],
  files: ['task.ts'],
  hints: [
    'Tablonun tipi hangi anahtarları kabul ediyor? Tabloda yanlış yazılmış bir anahtar olsa TypeScript bunu fark edebilir miydi?',
    "Tablonun anahtarlarını `RatingLevel`'a bağlamak için `Record<RatingLevel, Badge>` kullan; değiştirilemez olması için `Readonly` ile sar.",
    "`export const RATING_BADGES: Readonly<Record<RatingLevel, Badge>> = { … }` yaz. TypeScript'in işaretlediği anahtarı düzelt.",
  ],
})
