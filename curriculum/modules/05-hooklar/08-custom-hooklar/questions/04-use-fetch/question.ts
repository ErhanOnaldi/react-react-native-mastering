import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Tipli ve iptal edilebilir fetch',
  difficulty: 'orta',
  concepts: [
    'react.custom-hooks',
    'react.abort-controller',
    'ts.discriminated-union',
    'fetch.headers-auth',
  ],
  files: ['useFetch.ts'],
  hints: [
    'URL yokken dış sistem ilişkisi yok; URL varken ağ durumunu ayrı state dallarıyla temsil et.',
    'Dönüş tipi `RemoteData<T>` union’ı olsun; effect dependency’si URL.',
    'Null dalında idle’a dön; URL dalında loading başlat, JSON cevabını success’e yaz.',
    'AbortController sinyalini fetch’e ver; `!response.ok` için hata fırlat, `AbortError`ı kullanıcı hatası sayma.',
  ],
})
