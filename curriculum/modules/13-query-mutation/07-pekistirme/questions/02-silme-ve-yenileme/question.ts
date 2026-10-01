import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Silinen satırı hata halinde geri al',
  difficulty: 'zor',
  concepts: ['query.optimistic', 'query.invalidation', 'query.useMutation'],
  files: ['useDeleteRating.ts'],
  hints: [
    'Satırı hemen kaldırmanın yanında, başarısızlıkta geri koyabilmek için neyi saklayacağını düşün.',
    '`onMutate` önce query’yi iptal edip eski listeyi okuyabilir; callback’ten context döndür.',
    '`onError` context’teki listeyi geri yüklesin; silinen id’yi `filter` ile çıkar.',
    'Yalnız başarıda doğru session key’ini invalidate et; diğer session’ı değiştirme.',
  ],
})
