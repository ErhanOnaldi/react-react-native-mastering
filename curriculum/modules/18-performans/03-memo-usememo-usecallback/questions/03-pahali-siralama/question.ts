import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Pahalı sıralamayı sakla',
  difficulty: 'orta',
  concepts: ['perf.memo', 'react.useMemo', 'perf.rerender'],
  files: ['RankedMovies.tsx'],
  hints: [
    'Tema değişimi sıralama verisini değiştirmiyor; ayrıca `rank` girdiyi değiştirebilecek bir fonksiyon.',
    'Hesaplanan sonucu `useMemo` ile sakla ve `rank` öncesi dizi kopyası ver.',
    '`const result = useMemo(() => rank([...movies]), [movies, rank])` biçimini kullan.',
    'Sıralamanın yenilenmesi gereken iki girdi de dependency listesinde olmalı.',
  ],
})
