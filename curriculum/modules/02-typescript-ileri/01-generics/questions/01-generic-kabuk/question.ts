import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Çağrıda tipi çıkar',
  difficulty: 'kolay',
  concepts: ['ts.generics', 'ts.inference'],
  question: `Aşağıdaki kodda \`result\` değişkeninin tipi nedir?

\`\`\`ts
function first<T>(items: T[]): T | undefined {
  return items[0]
}

const result = first([{ id: 18, name: 'Dram' }])
\`\`\``,
  options: [
    {
      text: '`{id: number; name: string} | undefined`',
      correct: true,
      explanation:
        'TypeScript, verilen nesneden T tipini çıkarır; boş dizi olasılığı nedeniyle sonuçta undefined da vardır.',
    },
    {
      text: '`any`',
      explanation:
        'Generic fonksiyon any kullanmıyor. T, argümanın tipini koruduğu için alanlar denetlenmeye devam eder.',
    },
    {
      text: '`{id: number; name: string}`',
      explanation:
        'Bu, bir öğe bulunduğundaki tiptir. Dizi boş olabileceği için fonksiyon undefined da döndürebilir.',
    },
    {
      text: '`unknown`',
      explanation:
        'T çağrıdan çıkarılır; sonuç bilinmeyen kalmaz. Burada nesnenin id ve name alanları korunur.',
    },
  ],
})
