import { useState } from 'react'
import { WatchlistEditor } from './WatchlistEditor'
import { watchlists } from './watchlists'

export default function Preview() {
  const [index, setIndex] = useState(0)
  return (
    <div>
      <button onClick={() => setIndex((index + 1) % watchlists.length)}>Başka liste seç</button>
      <WatchlistEditor
        list={watchlists[index]}
        onSave={(values) => console.log('kaydedildi', values)}
      />
    </div>
  )
}
