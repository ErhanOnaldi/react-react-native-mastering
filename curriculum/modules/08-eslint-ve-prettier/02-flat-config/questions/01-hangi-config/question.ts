import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'ESLint 10 hangi config’i okur?',
  difficulty: 'kolay',
  concepts: ['tooling.eslint-config', 'tooling.eslint'],
  question:
    'Sinema’ya ESLint 10 kuruyorsun. Kök config dosyası ve yardımcı için doğru çift hangisi?',
  options: [
    {
      text: '`eslint.config.js` ve `defineConfig` (`eslint/config`).',
      correct: true,
      explanation: 'ESLint 10 flat config kullanır; yardımcı ESLint çekirdeğinden gelir.',
    },
    {
      text: '`.eslintrc.json` ve `env` alanı.',
      explanation: 'ESLint 10 eslintrc biçimini kaldırdı; flat config gerekir.',
    },
    {
      text: '`.eslintignore` ve `tseslint.config`.',
      explanation:
        'Ignore flat config içindedir; typescript-eslint config yardımcısı artık önerilmez.',
    },
    {
      text: '`vite.config.ts` ve `defineConfig` (`vite`).',
      explanation:
        'Vite config derleme içindir; ESLint kendi config’ini ve kendi `defineConfig` yardımcısını okur.',
    },
  ],
  explanation: '',
})
