import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Filmi ID ile değiştir',
  difficulty: 'orta',
  concepts: ['ts.generics', 'ts.generic-constraints', 'js.array-methods', 'react.immutability'],
  files: ['task.ts'],
  hints: [
    'Yeni film geldiğinde listedeki her öğe için hangi iki bilgiyi karşılaştırman gerekiyor?',
    'Dizi üzerinde `map` ile dolaş; generic kısıt sayesinde her öğenin sayısal `id` alanını karşılaştırabilirsin.',
    '`replaceById<T extends { id: number }>(items: T[], next: T): T[]` imzasını kullan. `map` içindeki her öğede eşleşen ID varsa `next`, yoksa eski öğeyi döndür.',
  ],
})
