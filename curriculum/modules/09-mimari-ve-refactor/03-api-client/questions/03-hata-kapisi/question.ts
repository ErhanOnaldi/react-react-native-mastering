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
    '`URLSearchParams`, `response.ok` ve `HeadersInit` API’lerini kullan.',
    'Başlık ve query’yi kur; başarısız cevabın gövdesini güvenli oku ve özel hata nesnesinde HTTP/TMDB alanlarını taşı.',
    'JSON hata gövdesi boş ya da bozuk olabilir; anlamlı varsayılan mesaj bırak.',
  ],
})
