import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Opsiyonel tarihi dönüştür',
  difficulty: 'orta',
  concepts: ['zod.transform', 'zod.refine', 'zod.resolver'],
  files: ['DraftEditor.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Boş bir metin ile "tarih yok" durumu aynı şey değildir; submit değerinde bu ayrımı göster.',
    'Önce boş değeri dönüştür, sonra yalnızca dolu değer için tarih biçimini denetle.',
    '`.transform` ile boş string’i `undefined`’a çevir, dolu ama geçersiz biçimi `.refine` ile reddet; şemayı resolver’a bağla.',
  ],
})
