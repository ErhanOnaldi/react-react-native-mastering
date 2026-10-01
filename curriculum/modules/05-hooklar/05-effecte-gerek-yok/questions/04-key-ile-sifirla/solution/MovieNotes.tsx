import { useState } from 'react'
export function MovieNotes({ id }: { id: number }) {
  return (
    <section>
      <Notes key={id} id={id} />
    </section>
  )
}
function Notes({ id }: { id: number }) {
  const [note, setNote] = useState('')
  return (
    <label>
      {id} notu
      <input aria-label="Film notu" value={note} onChange={(e) => setNote(e.target.value)} />
    </label>
  )
}
