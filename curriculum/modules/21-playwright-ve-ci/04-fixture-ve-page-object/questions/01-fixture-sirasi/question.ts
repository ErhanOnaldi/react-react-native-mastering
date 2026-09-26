import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Fixture hangi sırayla çalışır?',
  difficulty: 'orta',
  concepts: ['test.playwright-fixtures', 'js.async-await'],
  question: `\`\`\`ts
const test = base.extend<{ loginPage: LoginPage; searchPage: SearchPage }>({
  loginPage: async ({ page }, use) => {
    console.log('A: loginPage kuruldu')
    await use(new LoginPage(page))
    console.log('B: loginPage temizlendi')
  },
  searchPage: async ({ page }, use) => {
    console.log('C: searchPage kuruldu')
    await use(new SearchPage(page))
    console.log('D: searchPage temizlendi')
  },
})

test('arama', async ({ searchPage }) => {
  console.log('T: test gövdesi')
  throw new Error('bir assertion kaldı')
})
\`\`\`

Bu test çalışınca konsolda **hangi satırlar, hangi sırayla** görünür?`,
  options: [
    {
      text: '`C` → `T` → `D`',
      correct: true,
      explanation:
        'Doğru. Fixture tembeldir: test yalnızca `searchPage` istediği için `loginPage` hiç kurulmaz (A ve B yok). `use(…)`’dan önceki kod kurulum (C), sonra test gövdesi (T), sonra `use`’dan sonraki temizlik (D). Test hata fırlatsa bile Playwright temizliği çalıştırır.',
    },
    {
      text: '`A` → `C` → `T` → `D` → `B`',
      explanation:
        'Tanımlanan her fixture her testte kurulmaz. `loginPage`’i isteyen yok; Playwright onu hiç çalıştırmaz. Bu, pahalı fixture’ları (örneğin giriş yapmış oturum) yalnız gereken testlere ödetmeni sağlar.',
    },
    {
      text: '`C` → `T`',
      explanation:
        'Test kaldı diye temizlik atlanmaz. Playwright `use`’dan sonraki kodu her durumda çalıştırır; `try/finally` yazmana gerek kalmamasının sebebi bu. (Temizlik atlansaydı kalan her test arkasında çöp bırakırdı.)',
    },
    {
      text: '`T` → `C` → `D`',
      explanation:
        'Fixture testten **önce** hazırlanır; test gövdesi `searchPage`’i parametre olarak alırken nesnenin zaten var olması gerekir. Sıra her zaman kurulum → test → temizlik.',
    },
  ],
})
