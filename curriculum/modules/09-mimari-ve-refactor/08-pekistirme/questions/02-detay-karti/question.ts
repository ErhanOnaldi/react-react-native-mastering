import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Detay görünümünü sadeleştir',
  difficulty: 'zor',
  concepts: [
    'arch.refactoring',
    'arch.component-api',
    'react.composition',
    'ts.optional-nullable',
    'react.components',
  ],
  files: ['MovieSummary.tsx', 'MoviePoster.tsx'],
  hints: [
    'Hangi metinler afişin varlığından bağımsız olarak aynı kalmalı?',
    'Composition/component sınırını kullan; poster parçasının props sözleşmesi açık olsun.',
    'Özet JSX’inde tek başlık ve paragraf tut; dış bileşen afiş yokluğunu yönetir.',
    'Null path için img render etme; alt metni film başlığıyla eşleştir.',
  ],
  rubric: [
    'Poster yokluğu ortak kart gövdesini çoğaltmaz.',
    'Başlık/açıklama tek JSX noktasında; koşul yalnız farklı görseli yönetir.',
    'Alt metin, postersiz durum ve mevcut davranış korunur.',
  ],
})
