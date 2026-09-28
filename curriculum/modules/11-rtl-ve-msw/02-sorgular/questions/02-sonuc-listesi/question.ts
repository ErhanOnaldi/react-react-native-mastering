import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Liste sorgularını test et',
  difficulty: 'orta',
  concepts: ['test.rtl-queries', 'react.conditional-rendering'],
  files: ['MovieResults.test.tsx'],
  hints: [
    'Başarı ve boş durumları ayrı örneklerle hazırla; her durumda beklenen DOM’u belirle.',
    '`getByRole` bulunan başlık, `queryByRole` yokluğu sorgulamak içindir.',
    'Film heading’ini adıyla bul; boş listede status mesajını doğrula ve heading’in bulunmadığını kontrol et.',
  ],
  testWriting: {
    mutants: [
      { id: 'no-heading', label: 'film başlığını düz metne çeviren sürüm' },
      { id: 'wrong-empty', label: 'boş durumda yanlış mesaj veren sürüm' },
    ],
  },
})
