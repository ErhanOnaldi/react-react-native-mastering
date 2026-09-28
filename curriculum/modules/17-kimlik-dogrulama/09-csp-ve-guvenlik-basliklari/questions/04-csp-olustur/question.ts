import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'CSP politikası oluştur',
  difficulty: 'kolay',
  concepts: ['security.csp'],
  files: ['buildCsp.ts'],
  hints: [
    'Her yönergeyi ve kaynaklarını `yönerge-adı kaynak1 kaynak2` biçiminde birleştir.',
    'Boş veya tanımsız kaynak listelerini sonuca ekleme.',
    'Farklı yönergeleri birbirine `; ` (noktalı virgül ve bir boşluk) ile bağla.',
  ],
})
