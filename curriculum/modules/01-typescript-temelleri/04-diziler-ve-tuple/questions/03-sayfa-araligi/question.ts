import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sayfalama aralığı tuple’ı',
  difficulty: 'kolay',
  concepts: ['ts.arrays-tuples'],
  files: ['pageRange.ts'],
  hints: [
    'Başlangıç ve bitiş değerlerini alt ve üst sınırlar dahilinde tutmayı düşün.',
    'Sınırları belirlemek için `Math.max(1, page - 1)` ve `Math.min(totalPages, page + 1)` yardımcılarını kullanabilirsin.',
    'İskelet: `export type PageRange = [first: number, last: number]; export function pageRange(page: number, totalPages: number): PageRange { return [Math.max(1, page - 1), Math.min(totalPages, page + 1)]; }`',
    'Fonksiyon dönüş tipinin genel `number[]` değil, tam olarak iki elemanlı `PageRange` tuple’ı olduğundan emin ol.',
  ],
})
