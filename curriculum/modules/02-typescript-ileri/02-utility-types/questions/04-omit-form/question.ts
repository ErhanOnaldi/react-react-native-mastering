import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yeni film taslağı',
  difficulty: 'orta',
  concepts: ['ts.omit', 'ts.partial', 'js.spread'],
  files: ['task.ts'],
  hints: [
    'Sunucunun verdiği alanları taslak sözleşmesinin dışında bırak.',
    '`Omit` ile alanları çıkar, ardından `Partial` ile patch alanlarını opsiyonel yap.',
    '`{ ...draft, ...patch }` yeni nesne üretip güncellemeyi uygular.',
    'Patch içinde açıkça gönderilen `null`, atlanmış alanla aynı değildir.',
  ],
})
