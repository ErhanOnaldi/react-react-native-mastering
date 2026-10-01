import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Değişen girdi, doğru sonuç',
  difficulty: 'orta',
  concepts: ['perf.compiler'],
  question: `Compiler'ın otomatik memoization yaptığı bir arama bileşeninde \`query\` değişiyor. Eski arama sonucunu göstermemek için hangi davranış beklenir?`,
  options: [
    {
      text: 'Yeni sorgu filtre hesabını etkiler; sonuç güncellenir. Yalnız sayaç gibi ilgisiz değişikliklerde aynı hesap atlanabilir.',
      correct: true,
      explanation:
        'Derleyici girdiler ile çıktılar arasındaki ilişkiyi korumalıdır. Memoization değişen gerçek girdiyi yok saymaz.',
    },
    {
      text: 'Arama sorgusunu filtre bağımlılığından çıkarmak; memo değeri sabit kalmalı.',
      correct: false,
      explanation: 'Sorgu filtre girdisidir; onu dışarıda bırakmak yanlış eski sonuçları korur.',
    },
    {
      text: 'Her sorgu değişiminde tüm sayfayı elle unmount edip yeniden kurmak.',
      correct: false,
      explanation:
        'Bileşen ağacını sıfırlamak state kaybına yol açar; değişen sorgu doğru filtre hesabını tetiklemelidir.',
    },
  ],
})
