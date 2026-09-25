import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Popüler filmleri bir kez çek',
  difficulty: 'orta',
  concepts: ['react.useEffect', 'fetch.headers-auth', 'fetch.loading-states'],
  files: ['PopularTitles.tsx'],
  hints: [
    'Liste de bir dış sistemden geliyor.',
    'Mount sonrası effect kullan; `results` dizisini oku.',
    '`useEffect(..., [])` ve Bearer başlığı ile çek, ilk başlığı state’e yaz.',
  ],
})
