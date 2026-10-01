import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'TMDB yardımcısını yaz',
  difficulty: 'orta',
  concepts: ['fetch.headers-auth', 'fetch.error-handling', 'fetch.query-params', 'ts.generics'],
  project: 'sinema',
  focusFiles: ['src/lib/tmdb.ts'],
  reviewFiles: ['src/lib/tmdb.ts'],
  rubric: [
    'Bearer token ve Türkçe dil tek merkezde',
    'HTTP hatası başarısız Promise olarak aktarılıyor',
  ],
  hints: [
    'Önce URL kurma, yetkilendirme ve cevap kontrolü işlerini birbirinden ayır; sonra bunları tek giriş noktasında sırala.',
    'Bir adres nesnesiyle query parametrelerini güvenle ekle. Token ve varsayılan dili her istekte aynı noktada sağlayıp isteğe özel seçenekleri de koru.',
    'Önce HTTP durumunu denetle. Hata gövdesi JSON olmayabilir; durum kodu her durumda kullanılabilir. Başarılı gövdeyi tek kez JSON olarak oku.',
    '`response.json()` gövdeyi tek bir kez okuyabilir; hem hata durumunda hem de başarı durumunda aynı yanıt nesnesinde iki kez `json()` çağırmamaya dikkat et.',
  ],
})
