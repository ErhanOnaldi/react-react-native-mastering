import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Bozuk cevabı açıklayarak durdur',
  difficulty: 'orta',
  concepts: ['ts.type-guards', 'ts.unknown-any', 'ts.functions'],
  files: ['task.ts'],
  hints: [
    'Geçersiz cevapla devam etmek yerine hangi hata mesajıyla duracağını belirle.',
    '`asserts value is MoviePage` fonksiyonunda önce üst nesne, page ve results şeklini doğrula.',
    '`Array.isArray` sonrası `every` ile her öğenin id/title alanlarını denetle.',
  ],
})
