import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Detay görünümünü sadeleştir',
  difficulty: 'zor',
  concepts: ['arch.refactoring', 'arch.component-api', 'react.composition', 'ts.optional-nullable'],
  files: ['MovieSummary.tsx', 'MoviePoster.tsx'],
  hints: [
    'Starter’ın başlık ve posteri doğru gösterdiğini önce doğrula.',
    'İki dalın ortak JSX’ini karşılaştır.',
    'Tek başlık ve açıklama oluştur; yalnız poster varsa img göster.',
  ],
  rubric: [
    'Poster yokluğu ortak kart gövdesini çoğaltmaz.',
    'Başlık/açıklama tek JSX noktasında; koşul yalnız farklı görseli yönetir.',
    'Alt metin, postersiz durum ve mevcut davranış korunur.',
  ],
})
