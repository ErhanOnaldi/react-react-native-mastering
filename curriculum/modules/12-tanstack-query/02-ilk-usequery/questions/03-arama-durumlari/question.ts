import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama durumları',
  difficulty: 'orta',
  concepts: ['query.useQuery', 'ts.discriminated-union', 'fetch.error-handling'],
  files: ['SearchStatus.tsx'],
  hints: [
    'Arama cevabında HTTP başarısı ile `results: []` ayrı kullanıcı durumlarıdır.',
    'TMDB isteğinde Bearer başlığı gönder; `response.ok` false iken hata fırlat.',
    '`isPending` / `isError` dallarından sonra boş `results` kontrolü yapıp başlıkları listele.',
    'Arama başarısızlığında alert metni `Arama yüklenemedi` ifadesini içersin.',
  ],
})
