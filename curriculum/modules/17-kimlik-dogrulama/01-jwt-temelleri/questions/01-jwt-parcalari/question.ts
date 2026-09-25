import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'JWT payload ne söyler?',
  difficulty: 'kolay',
  concepts: ['auth.jwt', 'fetch.headers-auth'],
  question:
    'Bir access token `header.payload.signature` biçiminde. Payload içindeki `exp` değerini tarayıcıda çözdün. Hangisini güvenle söyleyebilirsin?',
  options: [
    {
      text: 'Token’ın bildirdiği bitiş zamanını okuyabilirim; geçerliliği sunucu doğrulamalı.',
      correct: true,
      explanation: 'Evet. Decode yalnız veriyi okur; imza ve yetki kontrolü sunucudadır.',
    },
    {
      text: 'Payload okunabildiğine göre token imzası da doğrulanmıştır.',
      explanation:
        'Base64url çözmek kriptografik imza doğrulaması yapmaz. Sahte payload da okunabilir.',
    },
    {
      text: 'Payload gizlidir; onu yalnız sunucu açabilir.',
      explanation: 'JWT payload şifrelenmiş değildir, yalnız kodlanmıştır. Gizli bilgi koyma.',
    },
  ],
})
