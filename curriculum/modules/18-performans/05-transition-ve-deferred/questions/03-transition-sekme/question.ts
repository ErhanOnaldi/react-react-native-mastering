import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Ağır sekmeyi geçişle aç',
  difficulty: 'orta',
  concepts: ['perf.transitions', 'react.events'],
  files: ['MovieTabs.tsx'],
  hints: [
    "Sekme güncellemesini yapan event handler'ları bul.",
    '`useTransition()` iki değer döndürür: bekleme bilgisi ve başlatıcı.',
    '`startTransition(() => setTab(...))` kullan; `isPending` için durum metni ekle.',
  ],
})
