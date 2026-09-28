import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sinema format seçenekleri',
  difficulty: 'kolay',
  concepts: ['tooling.prettier'],
  files: ['formatOptions.ts'],
  hints: [
    'Dört kararı ayır: parser, string tırnağı, satır sonu ve hedef genişlik.',
    '`prettier.format` seçeneklerinde `singleQuote`, `semi` ve `printWidth` alanlarını kullan.',
    "`formatOptions: Options` nesnesine `{ parser: 'typescript', singleQuote: true, semi: false, printWidth: 80 }` değerlerini koy.",
  ],
})
