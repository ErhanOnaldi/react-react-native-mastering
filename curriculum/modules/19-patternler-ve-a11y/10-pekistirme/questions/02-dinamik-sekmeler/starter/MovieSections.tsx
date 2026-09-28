import { useState } from 'react'
export function MovieSections({
  title,
  cast,
  videos,
}: {
  title: string
  cast: string[]
  videos: string[]
}) {
  const [selected, setSelected] = useState('summary')
  return (
    <>
      <div>
        <button onClick={() => setSelected('summary')}>Özet</button>
        <button onClick={() => setSelected('cast')}>Oyuncular</button>
        <button onClick={() => setSelected('videos')}>Videolar</button>
      </div>
      <div>
        {selected === 'summary' ? title : selected === 'cast' ? cast.join(', ') : videos.join(', ')}
      </div>
    </>
  )
}
