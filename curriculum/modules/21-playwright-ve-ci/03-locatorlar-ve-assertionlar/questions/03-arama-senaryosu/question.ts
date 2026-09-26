import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Beklemesiz arama senaryosu',
  difficulty: 'zor',
  concepts: [
    'test.playwright-assertions',
    'test.playwright-locators',
    'router.search-params',
    'test.e2e',
  ],
  files: ['searchScenario.ts'],
  timeoutMs: 120_000,
  hints: [
    'Her kontrol `await expect(…)` ile olsun; `isVisible()`/`textContent()` sonucunu Vitest tarzı karşılaştırmak beklemez ve yavaş cevapta kalır. İkinci aramaya geçmeden önce ilk aramanın sonuçlarının geldiğini doğrula; yoksa ikinci yazış ilkini iptal eder ve “eski sonuç kaldı” hatasını hiç göremezsin.',
    "Sonuç maddeleri için bölgeden başla: `page.getByRole('region', { name: 'Arama sonuçları' }).getByRole('listitem')` ve `toHaveCount(n)`. URL için fonksiyon biçimi: `toHaveURL((url) => url.searchParams.get('q') === 'başlangıç')`.",
    "Sıra: `goto('/search')` → `fill('matrix')` → `toHaveCount(2)` → `fill('başlangıç')` → `toHaveURL(…)` → `getByRole('link', { name: 'Başlangıç', exact: true })` görünür → `toHaveCount(1)` → `getByText('Aranıyor…')` için `toBeHidden()`.",
  ],
})
