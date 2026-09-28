import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Fonksiyon imzasını yeniden yazma',
  difficulty: 'orta',
  concepts: ['ts.return-parameters', 'ts.async-types', 'ts.generics'],
  files: ['task.ts'],
  hints: [
    'Örnek fonksiyonun argüman ve dönüş bilgilerini tekrar yazmadan nasıl çıkaracağını düşün.',
    '`Parameters`, `ReturnType` ve `Awaited` yardımcı tipleri fonksiyon imzasını türetir.',
    '`args[0]` tuple içindeki ID değeridir; bunu istenen metne ekle.',
  ],
})
