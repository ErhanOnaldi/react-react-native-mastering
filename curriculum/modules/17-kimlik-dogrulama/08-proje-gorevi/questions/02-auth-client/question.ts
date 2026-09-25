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
    'get isteğine güncel access token’ı Bearer olarak ekle.',
    '401’de refresh Promise’ını paylaş; iki istek tek rotation kullanmalı.',
    'İki yeni token’ı store ve kalıcı depoda birlikte güncelle; retry yalnız bir kez olsun.',
  ],
})
