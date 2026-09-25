import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yazım hatası nerede yakalanır?',
  difficulty: 'kolay',
  concepts: ['tooling.type-check'],
  question:
    '`movie.relese_date` yazdığında TypeScript ile JavaScript arasındaki görünür fark nedir?',
  options: [
    {
      text: 'TS, tanımlı Movie tipinde bu alan yoksa typecheck sırasında hata verir.',
      correct: true,
      explanation: 'Evet. Alan adı sözleşmesi hatayı kod çalışmadan gösterir.',
    },
    {
      text: 'TS, API cevabındaki tüm tarihlerin dolu olduğunu garanti eder.',
      explanation: 'Tip metnin boş olmadığını kanıtlamaz; `string` değeri `""` de olabilir.',
    },
    {
      text: 'JS her zaman sayfayı çökertir.',
      explanation: 'Bilinmeyen alan okumak JS’te `undefined` verir; hata daha sonra çıkabilir.',
    },
  ],
})
