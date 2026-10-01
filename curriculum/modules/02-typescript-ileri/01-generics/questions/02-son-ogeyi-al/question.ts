import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Son öğenin tipini koru',
  difficulty: 'kolay',
  concepts: ['ts.generics', 'ts.arrays-tuples'],
  files: ['task.ts'],
  hints: [
    'Fonksiyonun hem film hem tür dizisiyle çalışmasını ve öğenin alanlarını korumasını sağla.',
    'Dizi öğesinin tipini fonksiyonun girişinden çıkışına taşıyacak bir generic parametre kullan.',
    'İmza `lastItem<T>(items: T[]): T | undefined` biçiminde olabilir; gövde dizinin son indeksini döndürür.',
  ],
})
