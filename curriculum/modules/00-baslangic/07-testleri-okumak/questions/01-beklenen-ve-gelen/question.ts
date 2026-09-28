import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Beklenen ve gelen çıktıyı oku',
  difficulty: 'kolay',
  concepts: ['tooling.platform', 'test.vitest-basics', 'test.reading-results'],
  question: `Bir test çalıştırıldığında sonuç panelinde şu çıktı görünüyor:

\`\`\`text
FAIL src/formatScore.test.ts > formatScore > 8.5 puanı "8.5 / 10" olarak döner
AssertionError: expected '8.5' to be '8.5 / 10' // Object.is equality

- Expected:
"8.5 / 10"

+ Received:
"8.5"
\`\`\`

Bu test raporu geliştiriciye kodu hakkında ne söylüyor?`,
  options: [
    {
      text: 'Kod sadece `"8.5"` döndürmüş; test ise sonuna `" / 10"` eklenmiş halini bekliyor.',
      correct: true,
      explanation:
        'Doğru. `+ Received` satırı fonksiyonun ürettiği gerçek değeri (`"8.5"`), `- Expected` satırı ise testin beklediği doğru değeri (`"8.5 / 10"`) gösterir.',
    },
    {
      text: 'Fonksiyona yanlış parametre gönderilmiş; parametrenin `"8.5 / 10"` olması gerekirdi.',
      explanation:
        'Hayır. `Received` ve `Expected` değerleri fonksiyona giren parametreleri değil, fonksiyonun döndürdüğü sonucu ifade eder.',
    },
    {
      text: 'Test dosyasında yazım hatası var; Vitest puanları string olarak karşılaştıramaz.',
      explanation:
        'Hayır. Vitest string karşılaştırmasını `toBe` ile sorunsuz yapar; sorun testte değil, fonksiyonun çıktısındadır.',
    },
    {
      text: 'TypeScript tip hatası fırlatmış; `"8.5"` bir sayıya dönüştürülmelidir.',
      explanation:
        'Hayır. Bu bir TypeScript tip hatası değil, Vitest çalışma zamanı doğrulama (`AssertionError`) hatasıdır.',
    },
  ],
})
