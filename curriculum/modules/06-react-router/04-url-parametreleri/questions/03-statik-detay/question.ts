import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'URL’den statik film detayı',
  difficulty: 'orta',
  concepts: ['router.params', 'ts.narrowing', 'js.array-methods'],
  files: ['MovieDetails.tsx'],
  hints: [
    'URL parametresi metin ve eksik olabilir.',
    'Biçimi denetle, Number ile çevir, `movies.find` sonucunu ayrı kontrol et.',
  ],
})
