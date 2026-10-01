import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Compiler açıkken liste nasıl davranır?',
  difficulty: 'kolay',
  concepts: ['perf.compiler', 'perf.rerender'],
  question: `Aşağıdaki bileşen React Compiler ile derleniyor. Sayaç artınca ekrandaki film başlıkları ne olur?

\`\`\`tsx
import { useState } from 'react'

function MovieList({ movies }: { movies: string[] }) {
  const [count, setCount] = useState(0)
  const visible = movies.filter((title) => title.length > 0)
  return (
    <>
      <button onClick={() => setCount(count + 1)}>Sayaç {count}</button>
      <ul>{visible.map((title) => <li key={title}>{title}</li>)}</ul>
    </>
  )
}
\`\`\``,
  options: [
    {
      text: 'Başlıklar aynı kalır; compiler uygun olduğunda filtre sonucunu ve alt ağacı sayaç render’ında yeniden kullanabilir.',
      correct: true,
      explanation:
        'Sayaç filtre girdisi değildir. Derleyici, saf bileşende sayaç güncellemesinin etkilemediği hesap ve düğümleri koruyabilir; görünür içerik aynı kalır.',
    },
    {
      text: 'Başlıklar kaybolur; çünkü state güncellemesi listeyi unmount eder.',
      correct: false,
      explanation:
        'State güncellemesi tek başına listeyi kaldırmaz; JSX içinde liste her durumda yer alıyor.',
    },
    {
      text: 'Başlıklar her sayaç tıklamasında yeniden filtrelenir ve yeniden oluşturulur.',
      correct: false,
      explanation:
        'Compiler uygun işi atlayabilir; ancak bu davranış yalnız saf kodda mümkündür ve ölçümle doğrulanmalıdır.',
    },
  ],
})
