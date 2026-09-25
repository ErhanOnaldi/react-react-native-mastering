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
    'Yükleyici fonksiyon `id` değişince yeniden çalışmalı.',
    'Effect içinde loading durumuna geçip `load(id, controller.signal)` çağır.',
    'Cleanup’ta abort et; geç gelen eski cevabın yeni filmi ezmesine izin verme.',
  ],
})
