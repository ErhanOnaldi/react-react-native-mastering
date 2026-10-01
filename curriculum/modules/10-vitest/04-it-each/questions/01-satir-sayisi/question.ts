import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Tablodaki testleri say',
  difficulty: 'kolay',
  concepts: ['test.each', 'test.matchers'],
  question: `Bu testte kaç ayrı sonuç raporlanır?

\`\`\`ts
it.each([
  ['', ''],
  ['1999-10-15', '1999'],
])('%s tarihini biçimler', (date, year) => {
  expect(releaseYear(date)).toBe(year)
})
\`\`\``,
  options: [
    {
      text: 'İki; tablodaki her satır callback’i ayrı çalıştırır.',
      correct: true,
      explanation: 'İki veri satırı olduğu için Vitest iki ayrı test sonucu raporlar.',
    },
    {
      text: 'Bir; `it.each` tüm satırları tek assertion altında birleştirir.',
      explanation: 'Callback aynı olsa da her tablo satırı bağımsız test sonucu olarak çalışır.',
    },
    {
      text: 'Üç; `it.each` tablonun kendisi için de bir test çalıştırır.',
      explanation: 'Tablo ayrı test sayılmaz; yalnızca iki veri satırı test girdisidir.',
    },
    {
      text: 'Sıfır; `it.each` için `describe.each` de kullanmak gerekir.',
      explanation:
        '`it.each` tek başına satırları çalıştırır; bir `describe` bloğuna bağlı değildir.',
    },
  ],
})
