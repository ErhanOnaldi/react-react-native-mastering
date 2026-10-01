import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'JSON metnini Promise içinde çöz',
  difficulty: 'orta',
  concepts: ['ts.generics', 'ts.async-types', 'ts.api-types'],
  files: ['task.ts'],
  hints: [
    'Metni JSON olarak oku; geçersiz JSON parse edilemediğinde Promise reddedilir.',
    'Fonksiyonun dönüşünü `Promise<T>` olarak tanımla.',
    '`JSON.parse(text) as T` sonucu `T` gibi sunar ama alanları runtime’da doğrulamaz.',
  ],
})
