import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yorum formunu shadcn parçalarıyla kur',
  difficulty: 'orta',
  concepts: ['form.a11y', 'form.rhf-errors', 'shadcn.components'],
  files: ['ReviewForm.tsx'],
  hints: [
    'Her alanı ayrı bir FormField içinde kur; aynı etiketi, kontrolü ve hata alanını o grubun içinde tut.',
    'Hazır parçaları bir araya getir: FormField, FormItem, FormLabel, FormControl ve FormMessage.',
    'Yorum için `textarea`, puan için `type="number"` kontrolü kullan. İkisine de `field` bağlantısını FormControl içinden geçir.',
  ],
  preview: { entry: 'Preview.tsx' },
})
