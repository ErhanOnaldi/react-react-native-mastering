import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Puan geri alınamıyor',
  difficulty: 'zor',
  concepts: ['query.optimistic', 'query.invalidation', 'query.useMutation'],
  files: ['MovieRating.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Ekrandaki geçici puan ile sunucunun onayladığı puanı ayır.',
    'Başarısız yazmada önceki değeri geri koy; ilişkili listeyi başarılı yazmadan sonra yeniden doğrula.',
    'Yazmadan önce liste snapshot’ı al; hata halinde onu geri yükle, işlem sonunda rated listeyi geçersiz kıl.',
  ],
})
