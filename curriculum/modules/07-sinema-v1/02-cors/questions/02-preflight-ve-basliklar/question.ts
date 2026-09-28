import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi istek preflight tetikler?',
  difficulty: 'orta',
  concepts: ['web.cors'],
  question:
    'Tarayıcı, sunucuya asıl isteği göndermeden önce hangi senaryoda otomatik olarak bir `OPTIONS` ön kontrol isteği (**preflight**) ateşler?',
  options: [
    {
      text: 'İsteğe `Authorization: Bearer <token>` başlığı veya `Content-Type: application/json` eklendiğinde',
      correct: true,
      explanation:
        'Doğru. `Authorization` başlığı ve `application/json` içerik türü CORS-safelisted (güvenli liste) içinde değildir; tarayıcı asıl istekten önce mutlaka `OPTIONS` ile sunucudan izin ister.',
    },
    {
      text: 'Yalnızca `GET` yöntemiyle ve başlık olmadan istek atıldığında',
      explanation: 'Başlıksız basit `GET` isteği preflight gerektirmez; doğrudan gönderilir.',
    },
    {
      text: '`Content-Type` başlığı `text/plain` olduğunda',
      explanation:
        '`text/plain`, basit istekler için izin verilen üç güvenli Content-Type türünden biridir ve tek başına preflight tetiklemez.',
    },
    {
      text: 'İstek URL’sinde query parametresi (`?page=1`) bulunduğunda',
      explanation: 'Query parametrelerinin varlığı preflight mekanizmasını etkilemez.',
    },
  ],
})
