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
    'Dönüş tipi `RemoteData<T>` union’ı olsun.',
    'Effect dependency’si URL; null dalında idle’a dön.',
    'Controller sinyalini fetch’e ver; `!response.ok` için hata fırlat, AbortError’ı kullanıcı hatası sayma.',
  ],
})
