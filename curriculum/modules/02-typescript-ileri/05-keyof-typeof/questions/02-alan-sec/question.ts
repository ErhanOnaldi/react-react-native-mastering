import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tipli alan seçici',
  difficulty: 'orta',
  concepts: ['ts.keyof-typeof', 'ts.indexed-access', 'ts.generics'],
  files: ['task.ts'],
  hints: [
    'İmzada nesnenin tipini, seçilen anahtarı ve o anahtarın değer tipini birbirine bağla.',
    'Generic `K` tipini `keyof T` ile sınırla; dönüş tipinde `T[K]` kullan.',
    'İmzayı yazdıktan sonra gövdede `value[key]` döndür.',
  ],
})
