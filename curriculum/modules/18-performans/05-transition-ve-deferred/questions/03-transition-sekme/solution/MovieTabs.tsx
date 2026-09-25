import { useState, useTransition } from 'react'
export function MovieTabs() {
  const [tab, setTab] = useState<'overview' | 'cast'>('overview')
  const [isPending, startTransition] = useTransition()
  return (
    <section>
      <button onClick={() => startTransition(() => setTab('overview'))}>Özet</button>
      <button onClick={() => startTransition(() => setTab('cast'))}>Oyuncular</button>
      <p role="status">{isPending ? 'Sekme açılıyor' : ''}</p>
      <p>{tab === 'overview' ? 'Film özeti' : 'Oyuncu listesi'}</p>
    </section>
  )
}
