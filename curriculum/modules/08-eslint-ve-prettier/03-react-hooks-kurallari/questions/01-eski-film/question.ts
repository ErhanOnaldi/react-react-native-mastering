import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Eski film neden kaldı?',
  difficulty: 'kolay',
  concepts: ['react.useEffect.deps', 'router.params', 'tooling.eslint'],
  question: `ESLint bu effect için \`react-hooks/exhaustive-deps\` mesajı verdi. Mesajın nedeni nedir?

\`\`\`tsx
useEffect(() => {
  document.title = 'Film ' + id
}, [])
\`\`\``,
  options: [
    {
      text: 'Effect `id` değerini okuyor, ama boş dependency array React’e bu girdiyi bildirmiyor.',
      correct: true,
      explanation:
        'Lint bu kaynak ilişkisindeki eksik bildirimi saptar; mesaj kendiliğinden kodu düzeltmez.',
    },
    {
      text: '`id` string olduğu için effect içinde okunması yasaktır.',
      explanation:
        'String prop effect içinde kullanılabilir; okunan değer bağımlılık olarak bildirilmelidir.',
    },
    {
      text: 'Dependency array’i kaldırmak, böylece React her render’da effect’i çalıştırır.',
      explanation:
        'Lint’in istediği, okunan girdiyi doğru bildirmektir; her render’da çalıştırmak gereksiz olabilir.',
    },
    {
      text: 'Effect’in içindeki `id`-den bağımsız sabit metni değiştirmek.',
      explanation:
        'Başlık metnini değiştirmek, effect’in `id` okuması ile dependency array’i arasındaki farkı çözmez.',
    },
  ],
  explanation: '',
})
