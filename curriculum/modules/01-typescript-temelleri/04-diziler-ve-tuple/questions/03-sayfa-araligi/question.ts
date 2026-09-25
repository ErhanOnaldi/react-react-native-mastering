import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: "Sayfa aralığı tuple’ı",
  difficulty: 'kolay',
  concepts: ["ts.arrays-tuples"],
  files: ['pageRange.ts'],
  hints: ["İlk eleman için 1 alt sınırını düşün.", "`Math.max` ilk, `Math.min` son konumu sınırlar.", "`[Math.max(1, page - 1), Math.min(totalPages, page + 1)]` döndür."],
})
