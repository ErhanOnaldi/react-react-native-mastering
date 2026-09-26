import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'project',
  title: '401’i tek refresh ile onar',
  difficulty: 'zor',
  project: 'sinema',
  concepts: ['auth.refresh', 'arch.api-client', 'fetch.headers-auth', 'test.msw'],
  focusFiles: [
    'src/features/auth/authClient.ts',
    'src/features/auth/authSlice.ts',
    'src/pages/ProfilePage.tsx',
  ],
  hints: [
    'İki paralel 401’in aynı yeni token çiftini kullanması için hangi işi paylaşmalısın?',
    'GET isteğine Bearer token ekle; 401’de refresh Promise’ını paylaş. Profil için TanStack Query kullanabilirsin.',
    'İki yeni token’ı store ve kalıcı depoda birlikte güncelle; retry yalnız bir kez olsun.',
  ],
})
