import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Bekleyen puanı göster',
  difficulty: 'orta',
  concepts: ['query.optimistic', 'query.useMutation', 'react.conditional-rendering'],
  files: ['PendingRating.tsx'],
  hints: [
    'Bu geçici değer yalnız düğmeye basılan kartta mı görünmeli, yoksa paylaşılan listede de mi?',
    'Tek mutation için TanStack Query’nin `variables` ve `isPending` alanlarını kullan.',
    'Pending iken `mutation.variables?.value` üzerinden “8,5 gönderiliyor” metnini render et.',
    'Cache’e yazma; hata metnini `role="alert"` ile göster.',
  ],
})
