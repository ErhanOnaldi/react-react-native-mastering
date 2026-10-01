import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Controlled SearchBox',
  difficulty: 'orta',
  concepts: ['arch.component-api', 'react.controlled-input', 'router.search-params'],
  question: `\
\`SearchBox\` ilk render'da URL'den gelen metni gösteriyor:

\`\`\`tsx
function SearchBox({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery)
  return <input value={query} onChange={(event) => setQuery(event.target.value)} />
}
\`\`\`

Kullanıcı geri tuşuna basınca URL'deki \`q\` değişiyor ama input eski metni tutuyor. URL'yi state'in sahibi yapan API hangisi?`,
  options: [
    {
      text: 'Sayfanın verdiği `value` ve değişikliği sayfaya bildiren `onChange`',
      correct: true,
      explanation: 'Doğru. Değeri sayfa/URL tutar, bileşen değişim isteğini bildirir.',
    },
    {
      text: 'Yeni URL değeriyle birlikte yalnız `defaultValue` göndermek',
      explanation:
        '`defaultValue` yalnız ilk değeri kurar; component kendi state’ini tutmaya devam eder.',
    },
    {
      text: 'İç state için `useState` bırakıp URL değişince effect ile eşitlemek',
      explanation:
        'Aynı değerin iki kopyasını eşitlemek gerekir; kontrollü prop bunu tek sahipte tutar.',
    },
    {
      text: "Input'u `readOnly` yapıp URL metnini yalnız metin olarak göstermek",
      explanation: 'Input böylece değişmez ama kullanıcı arama metnini düzenleyemez.',
    },
  ],
})
