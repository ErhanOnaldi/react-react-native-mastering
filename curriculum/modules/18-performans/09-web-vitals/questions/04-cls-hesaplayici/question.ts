import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kümülatif yerleşim kaymasını hesapla',
  difficulty: 'orta',
  concepts: ['perf.web-vitals'],
  files: ['calculateCls.ts'],
  hints: [
    'Her performans girdisi `value` ve `hadRecentInput` alanlarına sahiptir. Kullanıcı girdisiyle ilişkili olanları ayıklamak için `hadRecentInput` değerini kontrol et.',
    'Yalnızca `hadRecentInput === false` olan girdilerin `value` değerlerini topla. `Array.prototype.filter` ve `reduce` bu işlem için uygundur.',
    '`Math.round(total * 10000) / 10000` veya benzeri bir yöntemle kayan nokta (floating point) hatalarını giderip 4 ondalık basamağa yuvarla.',
  ],
})
