import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TMDB URL’sini tek yerde kur',
  difficulty: 'orta',
  concepts: ['arch.api-client', 'fetch.query-params', 'ts.record'],
  files: ['buildTmdbUrl.ts'],
  hints: [
    'Hesapla: URL kurulumunda hangi kısımlar tüm endpoint’lerde değişmeden kalıyor?',
    '`URL` ve `URLSearchParams` API’leriyle path ve query değerlerini oluştur.',
    'TMDB kökünü URL constructor’a ver; `language` ile başla, sonra tanımlı parametreleri `.set()` ile ekle.',
    '`undefined` değerini string’e çevirme; boş değeri atlamak ile boş string göndermek aynı şey değil.',
  ],
})
