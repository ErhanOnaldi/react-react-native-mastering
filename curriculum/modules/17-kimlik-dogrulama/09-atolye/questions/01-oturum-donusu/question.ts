import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Oturum dönüşü',
  difficulty: 'zor',
  concepts: ['auth.jwt', 'react.useEffect.cleanup', 'fetch.headers-auth'],
  files: ['ProfileGate.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Bileşen zaten bir jeton alarak açılabiliyorsa, o jetonu görmezden gelen bir başlangıç değeri arıyorsun.',
    'Jetona bağlı profil isteği tek bir yerde ve jeton her değiştiğinde yalnızca bir kez çalışmalı.',
    'Başlangıç state’ini prop’tan kur; profil isteğini tetikleyen effect’te yalnızca tek bir çağrı bırak ve eski cevabı yok sayan bir bayrakla temizle.',
  ],
})
