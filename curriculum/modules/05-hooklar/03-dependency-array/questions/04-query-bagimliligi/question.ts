import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Arama parametresini izle',
  difficulty: 'orta',
  concepts: ['react.useEffect.deps', 'react.controlled-input', 'fetch.query-params'],
  files: ['SearchCount.tsx'],
  hints: [
    'Boş arama ile dolu arama farklı dış sistem ilişkileri: boşta ilişki yok.',
    'URL veya `URLSearchParams` kullanarak `query` parametresini güvenle oluştur.',
    'Effect içinde boş query için erken dön; dolu query’de fetch yapıp `total_results` değerini state’e yaz.',
    'Dependency listesine her render’da yeni kurulan URL nesnesini değil, `query` string’ini koy.',
  ],
})
