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
      text: 'Payload’daki `exp` değerini okuyabilirim; token’ın geçerli olup olmadığına sunucu karar verir.',
      correct: true,
      explanation: 'Evet. Decode yalnız veriyi okur; imza ve yetki kontrolü sunucudadır.',
    },
    {
      text: 'Payload’daki kullanıcı adı doğru görünüyorsa token’ı o kullanıcı adına kullanabilirim.',
      explanation:
        'Okunabilir bir payload imzanın doğrulandığını göstermez; sahte payload da çözülebilir. Yetki kararını sunucu verir.',
    },
    {
      text: 'Payload okunabildiğine göre içindeki `role` alanına göre özel API çağrısı yapabilirim.',
      explanation:
        'Payload okunabilir olsa da imzası doğrulanmış anlamına gelmez; API yetkisini sunucu denetler.',
    },
  ],
})
