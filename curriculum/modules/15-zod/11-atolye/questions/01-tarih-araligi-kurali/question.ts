import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tarih aralığı kuralı',
  difficulty: 'orta',
  concepts: ['zod.refine', 'zod.resolver', 'a11y.basics'],
  files: ['PlanForm.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Başlangıç ve bitiş tarihi tek başına geçerli olsa da ikisi birlikte yanlış olabilir; bu ilişkiyi tek bir alanın kuralı yakalayamaz.',
    'Bütün nesneye bakıp hatayı ilgili alana yerleştiren bir Zod aracı var.',
    "`.refine((value) => value.endDate >= value.startDate, { path: ['endDate'], error: '…' })` ile şemayı `zodResolver`e ver; hatanın id’sini `aria-describedby` ile input’a bağla.",
  ],
})
