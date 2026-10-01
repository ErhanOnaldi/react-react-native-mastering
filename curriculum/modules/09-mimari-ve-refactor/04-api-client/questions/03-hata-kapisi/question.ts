import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Bearer ve ApiError',
  difficulty: 'zor',
  concepts: [
    'arch.api-client',
    'arch.api-error',
    'fetch.headers-auth',
    'fetch.error-handling',
    'ts.generics',
    'web.http-anatomy',
  ],
  files: ['tmdbClient.ts'],
  hints: [
    'Ağ bağlantısı hatasıyla sunucudan gelen HTTP hata cevabının farkını düşün.',
    'Önce `ApiError` içine HTTP durumu, TMDB durumu ve mesajı taşı; sonra `get` içinde `response.ok` kontrol et.',
    '`URLSearchParams` ile query değerlerini ekle; `Headers` nesnesinde `Authorization` başlığı kur.',
    'JSON hata gövdesi boş ya da bozuk olabilir; anlamlı varsayılan mesaj bırak ve başarısız cevapta `ApiError` fırlat.',
  ],
  rubric: [
    '`ApiError` HTTP `status`, TMDB `statusCode` ve `message` değerlerini taşır ve `Error` olarak tanınır.',
    'Başarılı cevapta JSON gövdesi `Promise<T>` olarak döner.',
    'HTTP hatası `ApiError` fırlatır; gövde okunamazsa varsayılan mesaj kullanılır.',
    'Her istekte Bearer ve `language=tr-TR` bulunur; token URL’ye yazılmaz.',
    '`undefined` query değerleri atlanır, Türkçe arama metni korunur.',
  ],
})
