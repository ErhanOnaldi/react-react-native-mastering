import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Postman çalışırken tarayıcı neden hata verir?',
  difficulty: 'kolay',
  concepts: ['web.cors'],
  question:
    'Bir API endpoint’ine Postman veya `curl` ile istek attığında veri sorunsuz dönüyor; ancak aynı adrese React uygulamasından `fetch()` ile istek attığında CORS hatası alıyorsun. Bunun temel nedeni nedir?',
  options: [
    {
      text: 'CORS bir sunucu güvenlik duvarı değil, tarayıcının JavaScript ortamına uyguladığı bir okuma kısıtıdır.',
      correct: true,
      explanation:
        'Doğru. CORS kuralları yalnızca tarayıcı içinde çalışan JavaScript kodları için geçerlidir. Postman, curl veya sunucudan sunucuya yapılan çağrılarda Same-Origin Policy işletilmez.',
    },
    {
      text: 'Tarayıcı isteği API’ye hiç göndermez; CORS ağ katmanında tüm isteği durdurur.',
      explanation:
        'CORS bazı isteklerde ön kontrol yapar, ancak temel kural JavaScript’in cevabı okuyup okuyamayacağını belirlemektir. Basit bir istek sunucuya ulaşmış olabilir.',
    },
    {
      text: 'Postman isteklerinde `Origin` başlığı olmadığı için API tarayıcı isteklerini reddeder.',
      explanation:
        'Postman CORS denetimi yapmadığı için çalışabilir. Tarayıcıdaki asıl fark, API cevabının `Access-Control-Allow-Origin` iznidir.',
    },
    {
      text: 'Tarayıcı API’den gelen cevabı JavaScript’e verir; `try/catch` içindeki kod gövdeyi boşaltır.',
      explanation:
        'CORS izni yoksa tarayıcı JavaScript’e cevabın içeriğini vermez; `fetch` genel bir ağ hatasıyla reddedilir.',
    },
  ],
})
