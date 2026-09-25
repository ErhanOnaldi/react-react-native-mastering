import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'İki 401’i tek refresh ile onar',
  difficulty: 'zor',
  concepts: ['auth.refresh', 'arch.api-client', 'js.async-await', 'test.msw'],
  files: ['authClient.ts'],
  hints: [
    'İlk isteği güncel access token ile yap; 401 dışındaki hatada refresh deneme.',
    'Factory scope’unda `let inFlight: Promise<Tokens> | null` tut ve 401’ler arasında paylaş.',
    'Refresh bitmiş ama ikinci 401 eski token’dan gelmişse storage’daki yeni token ile doğrudan retry yap; retry’ı bir turla sınırla.',
  ],
})
