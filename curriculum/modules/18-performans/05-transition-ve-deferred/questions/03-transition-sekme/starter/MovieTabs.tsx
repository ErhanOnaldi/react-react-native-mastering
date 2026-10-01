import { useState } from 'react'
export function MovieTabs() {
  const [tab, setTab] = useState<'overview' | 'cast'>('overview')
  return (
    <section>
      <button onClick={() => setTab('overview')}>Özet</button>
      <button onClick={() => setTab('cast')}>Oyuncular</button>
      <p role="status"></p>
      <p>{tab === 'overview' ? 'Film özeti' : 'Oyuncu listesi'}</p>
    </section>
  )
}
