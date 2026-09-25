import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Ekrana giden yol',
  difficulty: 'kolay',
  concepts: ['tooling.vite'],
  question:
    '`pnpm dev` sonrası tarayıcıda sayfayı açtığında dosyalar hangi **sırayla** devreye girer?',
  options: [
    {
      text: '`index.html` → `src/main.tsx` → `src/App.tsx`',
      correct: true,
      explanation:
        'Doğru. Tarayıcı önce HTML’i alır; oradaki `<script type="module">` main.tsx’i ister; main.tsx de App’i import edip render eder.',
    },
    {
      text: '`src/App.tsx` → `src/main.tsx` → `index.html`',
      explanation:
        'Ters. Tarayıcının bildiği tek giriş HTML’dir; JavaScript’i HTML’deki script etiketi başlatır.',
    },
    {
      text: '`vite.config.ts` → `src/App.tsx` → `index.html`',
      explanation:
        'vite.config.ts tarayıcıya hiç gitmez; Node tarafında, Vite’ın nasıl davranacağını belirler.',
    },
    {
      text: '`package.json` → `src/main.tsx` → `src/App.tsx`',
      explanation:
        'package.json yalnızca komutları ve bağımlılıkları tanımlar; tarayıcı onu okumaz.',
    },
  ],
})
