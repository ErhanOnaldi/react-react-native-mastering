import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yıl biçimleyicisini tabloyla test et',
  difficulty: 'orta',
  concepts: ['test.each', 'test.matchers', 'js.string-formatting'],
  files: ['releaseYear.test.ts'],
  hints: [
    'Üç girdi ve çıktıyı bir tuple tablosunda topla.',
    '`it.each([...])("%s tarihi için %s döner", ...)` kullan.',
    'Boş tarih, `1999-10-15` ve `2024-01-01` satırlarını ekle.',
  ],
  testWriting: {
    mutants: [
      { id: 'missing-date', label: 'eksik tarihe sabit bir yıl koyan sürüm' },
      { id: 'fixed-year', label: 'her dolu tarihte aynı yılı kullanan sürüm' },
    ],
  },
})
