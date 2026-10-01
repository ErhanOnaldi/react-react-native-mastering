import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Tip kontrolü neden yetmedi?',
  difficulty: 'kolay',
  concepts: ['tooling.eslint', 'tooling.type-check', 'react.useEffect.deps'],
  question: `Bu bileşende TypeScript derlemesi başarılı. ESLint'in kullanılmayan ad kuralı ne bildirir?

\`\`\`tsx
const poster = '/fight-club.jpg'
const title = 'Dövüş Kulübü'

export function MovieTitle() {
  return <h1>{title}</h1>
}
\`\`\``,
  options: [
    {
      text: '`poster` kullanılmıyor; ESLint bunu seçili kurala göre bildirebilir.',
      correct: true,
      explanation:
        'Doğru. Kaynakta `poster` tanımlı ama bileşen onu okumuyor; bu, tip denetiminden farklı bir kuraldır.',
    },
    {
      text: 'TypeScript derlemesi `poster` kullanılmıyorsa mutlaka hata verir.',
      explanation: 'Derleme tipi denetler; kullanılmayan ad için ayrı bir lint kuralı gerekir.',
    },
    {
      text: 'Prettier `poster` satırını kaldırır.',
      explanation: 'Prettier görünüşü düzenler; kullanılmayan değişkeni silme kararı vermez.',
    },
    {
      text: 'JSX içinde kullanılmayan değişken otomatik olarak kullanılmış sayılır.',
      explanation:
        'JSX yalnızca içinde başvurulan adları kullanır; `poster` hiçbir yerde geçmiyor.',
    },
  ],
  explanation: '',
})
