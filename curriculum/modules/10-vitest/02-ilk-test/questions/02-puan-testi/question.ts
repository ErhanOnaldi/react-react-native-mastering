import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Puan biçimleyicisini test et',
  difficulty: 'orta',
  concepts: ['test.vitest-basics', 'test.aaa', 'test.matchers', 'js.string-formatting'],
  files: ['formatVote.test.ts'],
  hints: [
    'Her testin hangi gözlenebilir çıktıyı güvenceye aldığını önce adlandır.',
    'Önce tam sayı ve henüz oy verilmemiş durumu ayrı senaryo say.',
    '`@impl/formatVote` import et ve `expect(...).toBe(...)` yaz.',
    '`formatVote(8)` için `"8.0"`, `formatVote(0)` için `"Henüz oy yok"` bekle.',
  ],
  testWriting: {
    mutants: [
      { id: 'drops-decimal', label: 'tam sayı puanda ondalığı düşüren sürüm' },
      { id: 'zero-as-score', label: 'oylanmamış filmi puanlanmış gibi gösteren sürüm' },
    ],
  },
})
