import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Oturum dönüşü',
  difficulty: 'zor',
  concepts: ['auth.jwt', 'react.useEffect.cleanup', 'fetch.headers-auth'],
  files: ['ProfileGate.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Bileşenin başlangıç durumunu nasıl kurduğuna ve profil isteğini tetikleyen yan etkiye odaklan.',
    "`initialToken` prop'unu doğrudan `useState(initialToken)` içine başlangıç değeri olarak aktar.",
    '`useEffect` içinde unutulmuş mükerrer `fetchMe` çağrısını sil; tek bir istek bırak ve eski yanıtları yok sayacak bir cleanup bayrağı ekle.',
    "`useState(null)` yazıp ardından ayrı bir `useEffect` içinde prop'u state'e senkronize etmeye çalışmak ek render ve yarış durumları doğurur.",
  ],
})
