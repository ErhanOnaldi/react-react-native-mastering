import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema authClient',
  difficulty: 'zor',
  project: 'sinema',
  concepts: ['auth.refresh', 'arch.api-client', 'js.async-await'],
  focusFiles: ['src/features/auth/authClient.ts', 'src/features/auth/auth-api.ts'],
  hints: [
    'Önceki derslerde kurduğun tek uçuş (single-flight) mantığını Sinema projesinin dosya yapısına taşı.',
    'Closure seviyesinde `let inFlightRefresh: Promise<Tokens> | null = null;` değişkeni tut; 401 yanıtında bu değişken doluysa yenisini başlatma.',
    '401 durumunda: `if (!inFlightRefresh) { inFlightRefresh = refreshTokens(storage).finally(() => { inFlightRefresh = null; }); }` çağrısını bekle ve dönen yeni token ile isteği bir kez retry et.',
    'Uygulamadaki varsayılan `authClient` örneğini export etmeyi unutma; bu örnek depodaki `sinema-auth` anahtarıyla konuşmalıdır.',
  ],
})
