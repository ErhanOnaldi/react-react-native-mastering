import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Geç gelen arama cevabını yok say',
  difficulty: 'orta',
  concepts: ['react.useEffect.cleanup', 'react.race-conditions', 'fetch.headers-auth'],
  files: ['SearchTitle.tsx'],
  hints: [
    'Her effect çalışmasının kendine ait bir `ignore` değişkeni olsun.',
    'Cleanup onu `true` yapmalı.',
    'Promise sonucunda yalnızca `!ignore` ise state güncelle.',
  ],
})
