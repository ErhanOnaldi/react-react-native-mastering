import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Detay sayfasına gezinme testi yaz',
  difficulty: 'orta',
  concepts: ['test.custom-render', 'test.user-event', 'router.params', 'router.navigation'],
  files: ['MovieRoute.test.tsx'],
  hints: [
    'Bir memory router içinde hem film route’unu hem de arama sayfasını kur.',
    'Başlangıç URL’indeki id’nin başlıkta göründüğünü; link tıklanınca URL ve ekrandaki başlığın değiştiğini doğrula.',
    'Ayrı bir başlangıç URL’iyle id olmayan durumu da sınayabilirsin.',
  ],
  testWriting: {
    mutants: [
      { id: 'fixed-id', label: 'başlıkta URL id’si yerine sabit id gösteren sürüm' },
      { id: 'wrong-target', label: 'aramaya dönüş linkini yanlış adrese götüren sürüm' },
    ],
  },
})
