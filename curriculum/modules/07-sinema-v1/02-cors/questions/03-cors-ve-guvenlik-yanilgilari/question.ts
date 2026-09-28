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
      text: 'React’in `fetch` implementasyonu Postman kadar HTTP standardına uygun değildir.',
      explanation: 'Sorun React ile ilgili değildir; tarayıcının güvenlik modeli kuralı uygular.',
    },
    {
      text: 'API sunucusu yalnızca Postman’den gelen User-Agent başlığına izin vermektedir.',
      explanation:
        'CORS engeli genellikle User-Agent ile değil, tarayıcının gönderdiği `Origin` başlığına sunucunun izin başlığı (`Access-Control-Allow-Origin`) dönmemesiyle ilgilidir.',
    },
    {
      text: 'JavaScript `try/catch` bloğu CORS hatasını otomatik olarak yutar.',
      explanation:
        'Tam tersine, CORS engellendiğinde `fetch` Promise’i `TypeError: Failed to fetch` ile reddedilir.',
    },
  ],
})
