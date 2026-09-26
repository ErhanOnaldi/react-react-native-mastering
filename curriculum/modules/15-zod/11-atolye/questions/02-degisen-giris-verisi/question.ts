import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Değişen giriş verisi',
  difficulty: 'orta',
  concepts: ['form.rhf-reset', 'zod.transform', 'zod.refine'],
  files: ['DraftEditor.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'İki ayrı sorun var: formun ne zaman yeniden ayarlanması gerektiği ve boş tarihin ne anlama geldiği.',
    'Bir prop değişince formu haberdar etmen gerekir; boş bir metin ile "tarih yok" durumu aynı şey değildir.',
    'Taslak değişince `reset(...)` ile alanları yenile. Şemada boş string’i `.transform` ile `undefined`’a çevir, dolu ama geçersiz biçimi `.refine` ile reddet.',
  ],
})
