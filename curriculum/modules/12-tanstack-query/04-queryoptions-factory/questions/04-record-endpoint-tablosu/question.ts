import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Endpoint tablosu eksik kalmasın',
  difficulty: 'orta',
  concepts: ['ts.record', 'query.query-options'],
  question:
    'Modül 2’de `Record` ile tür renklerini eşleştirmiştin. Şimdi `type MovieView = "detail" | "similar" | "credits"` için her görünümün query key parçasını tutacaksın. `credits` eklenince eksik eşlemeyi derleme sırasında yakalayan tip hangisi?',
  options: [
    {
      text: '`Record<MovieView, string>`',
      correct: true,
      explanation:
        'Doğru. Anahtar kümesi union’dan gelir; yeni görünüm eklenince tabloya karşılığı eklenmelidir.',
    },
    {
      text: '`Partial<Record<MovieView, string>>`',
      correct: false,
      explanation:
        '`Partial` her anahtarı opsiyonel yapar; eksik `credits` değeri hataya dönüşmez.',
    },
    {
      text: '`Record<string, string>`',
      correct: false,
      explanation:
        'Herhangi bir string anahtar kabul edilir; `MovieView` seçeneklerinin tümünü zorunlu tutmaz.',
    },
  ],
})
