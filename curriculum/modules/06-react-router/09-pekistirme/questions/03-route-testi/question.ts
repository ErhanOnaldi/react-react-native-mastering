import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'URL sayfalama testlerini yaz',
  difficulty: 'orta',
  concepts: ['test.vitest-basics', 'test.aaa', 'test.matchers', 'router.search-params'],
  files: ['PageReader.test.tsx'],
  hints: [
    'Bir URL ile sayfayı aç, görünen başlığı doğrula; sonra kullanıcı eylemiyle adresin ve içeriğin birlikte değiştiğini kontrol et.',
    '`createMemoryRouter` ve `RouterProvider` ile gerçek bir route ağacını bellekte aç; etkileşim için `userEvent` kullan.',
    'Her testte `const router = createMemoryRouter(routes, { initialEntries: [...] })` oluştur. İleri düğmesine bastıktan sonra `router.state.location.search` içinden `page` değerini ve ekrandaki başlığı ayrı ayrı doğrula.',
    'Bozuk `?page=abc` değerini de aç. Uygulama çökmemeli ve ilk sayfanın içeriğini göstermeli.',
  ],
  testWriting: {
    mutants: [
      { id: 'page-not-in-url', label: 'ileri geçişi adresi güncellemeyen sürüm' },
      { id: 'string-page-math', label: 'sayfa numarasını metin olarak birleştiren sürüm' },
      { id: 'invalid-page-crash', label: 'bozuk sayfa değerinde çöken sürüm' },
    ],
  },
})
