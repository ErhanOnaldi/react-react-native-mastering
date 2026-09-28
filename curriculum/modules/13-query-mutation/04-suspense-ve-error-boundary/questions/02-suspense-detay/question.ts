import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Detayı Suspense ile oku',
  difficulty: 'orta',
  concepts: ['query.suspense', 'react.suspense', 'react.error-boundary'],
  files: ['MovieDetail.tsx'],
  hints: [
    'Bekleme ve hata UI’ının bileşenin içinde mi, yoksa onu saran ağaçta mı olması gerektiğini düşün.',
    '`useSuspenseQuery` başarıda tanımlı `data` verir; query key kaydın id’sini içermeli.',
    '`queryKey: ["movie", id]`, `queryFn: () => load(id)` ve `<h1>{data.title}</h1>` kullan.',
    'Bileşende `isPending` dalı ekleme; dışarıdaki sınırlar fallback ve hatayı yönetir.',
  ],
})
