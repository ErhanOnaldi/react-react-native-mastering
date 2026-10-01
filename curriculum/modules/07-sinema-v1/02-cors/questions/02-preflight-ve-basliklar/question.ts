import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Preflight isteğinde hangi sıra izlenir?',
  difficulty: 'orta',
  concepts: ['web.cors'],
  question:
    'Sinema, başka origin’deki API’ye `Authorization: Bearer ...` başlığıyla `GET` atıyor. API `OPTIONS` ön kontrolüne izin başlıklarıyla cevap veriyor. Tarayıcının izleyeceği sıra hangisidir?',
  options: [
    {
      text: 'Önce `OPTIONS` gider; izin gelince gerçek `GET` ve `Authorization` başlığı gider.',
      correct: true,
      explanation:
        'Doğru. Tarayıcı önce izin sorgular. `OPTIONS` cevabı uygunsa ardından gerçek `GET` isteğini gönderir; token asıl isteğin başlığındadır.',
    },
    {
      text: 'Önce gerçek `GET` gider; sunucu token’ı reddederse tarayıcı `OPTIONS` ile tekrar dener.',
      explanation:
        'Preflight başarısız isteği tekrar etmek için kullanılmaz. Tarayıcı izin istemini gerçek isteğin önüne koyar.',
    },
    {
      text: '`OPTIONS` isteği film verisini taşır; ardından ayrıca `GET` gerekmez.',
      explanation:
        '`OPTIONS` yalnızca tarayıcının izin sorusudur. Film verisini alan gerçek `GET`, izin cevabından sonra gönderilir.',
    },
    {
      text: 'Tarayıcı `OPTIONS` ile token’ı gönderir, `GET` isteğinde yeniden göndermez.',
      explanation:
        'Preflight hangi başlığın kullanılacağını bildirir; `Authorization` değerini taşıyan asıl istek daha sonra gelir.',
    },
  ],
})
