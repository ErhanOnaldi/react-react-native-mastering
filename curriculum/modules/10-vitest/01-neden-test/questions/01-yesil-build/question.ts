import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yeşil build neden yetmedi?',
  difficulty: 'kolay',
  concepts: ['test.what-to-test', 'tooling.type-check', 'arch.refactoring'],
  question: `Aşağıdaki kod için hangi beklenti ikinci sayfanın gerçekten istendiğini doğrular?

\`\`\`ts
const url = new URL('https://sinema.test/search?page=2')
\`\`\``,
  options: [
    {
      text: '`expect(url.searchParams.get("page")).toBe("2")`',
      correct: true,
      explanation:
        'Sayfa numarası URL’de yanlışsa bu kontrol kırılır; kullanıcıya giden isteği ölçer.',
    },
    {
      text: '`expect(url.searchParams.has("page")).toBe(true)`',
      correct: false,
      explanation:
        'Bu yalnızca bir page parametresinin varlığını kanıtlar; yanlışlıkla `page=1` de geçer.',
    },
    {
      text: '`expect(url.pathname).toBe("/search")`',
      correct: false,
      explanation:
        'Yol doğru olsa bile query içindeki sayfa yanlış olabilir; bu beklenti onu ölçmez.',
    },
    {
      text: '`expect(url.search).not.toBe("")`',
      correct: false,
      explanation:
        'Query dolu olabilir ama `page` değeri yanlış olabilir; gerekli değeri karşılaştır.',
    },
  ],
})
