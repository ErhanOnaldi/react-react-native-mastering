import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Detay isteğini hook’a taşı',
  difficulty: 'zor',
  concepts: [
    'react.custom-hooks',
    'react.useEffect.deps',
    'react.useEffect.cleanup',
    'react.abort-controller',
    'arch.separation-of-concerns',
  ],
  files: ['useMovieDetails.ts'],
  hints: [
    'Seçili id değiştiğinde hangi işi durdurup hangisini yeniden başlatman gerekiyor?',
    '`useEffect` cleanup ve `AbortController` API’lerine bak.',
    'Effect içinde yeni controller oluştur, loading state yaz, signal ile loader’ı çağır; cleanup’ta controller’ı abort et.',
    'Loader abort sinyalini yok sayarsa bile yalnızca aktif isteğin state yazmasına izin ver.',
  ],
})
