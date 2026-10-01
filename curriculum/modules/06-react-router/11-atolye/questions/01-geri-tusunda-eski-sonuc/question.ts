import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Geri tuşunda eski sonuç',
  difficulty: 'zor',
  concepts: ['router.search-params', 'react.useEffect.deps', 'react.race-conditions'],
  files: ['SearchPage.tsx'],
  hints: [
    'URL değişirken hangi sorgu için istek başlatılmalı, hangi sorgunun sonucu ekranda kalmalı?',
    "`useEffect` içinde `q` değişimine bağlı isteği başlat; effect'in cleanup'ında eski isteğin sonucunu geçersiz kıl.",
    'Her effect çağrısında `let active = true` tut. Cleanup bunu `false` yapsın; `.then` içinde yalnız `active` ise `setMovies` çağır.',
  ],
  preview: { entry: 'Preview.tsx' },
})
