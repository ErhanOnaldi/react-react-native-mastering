import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hook neyi taşımalı?',
  difficulty: 'orta',
  concepts: ['arch.separation-of-concerns', 'react.custom-hooks', 'react.derived-state'],
  question: `\
\`SearchPage\` ve \`FavoritePage\` aynı film isteği için aynı durumları ayrı ayrı tutuyor:

\`\`\`tsx
const [movies, setMovies] = useState<Movie[]>([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
useEffect(() => { /* sorguya göre isteği başlat */ }, [query])
\`\`\`

Yeni bir sayfada da aynı istek davranışı gerekecek. Hangi sınır tekrarı azaltırken görünümü sayfada bırakır?`,
  options: [
    {
      text: 'Sorgu, istek ve loading/error geçişlerini yöneten custom hook',
      correct: true,
      explanation:
        'İki sayfada tekrar eden davranış bir hook sınırına uygundur; her sayfanın JSX’i kendi görünümünde kalır.',
    },
    {
      text: 'İki sayfanın JSX ağacını ve CSS class adlarını',
      explanation:
        'Hook görünüm markup’ı ve class adları taşımaz; yalnız tekrar eden state geçişini paylaşır.',
    },
    {
      text: 'Sonuç listesinin her öğesini ayrı component state’inde',
      explanation:
        'Liste zaten state olarak gelir; her öğeyi ayrı kopyalamak ek senkronizasyon yükü doğurur.',
    },
    {
      text: 'Yalnız `movies.length` değerini',
      explanation: 'Uzunluk mevcut listeden hesaplanabilir; yeni bir state gerekmez.',
    },
  ],
})
