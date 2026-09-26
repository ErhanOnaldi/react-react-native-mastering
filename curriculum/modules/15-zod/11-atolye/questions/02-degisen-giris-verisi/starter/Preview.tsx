import { useState } from 'react'
import { DraftEditor, type Draft } from './DraftEditor'

const drafts: Draft[] = [
  { id: 'a', title: 'Yaz listesi taslağı', dueDate: '2026-07-01' },
  { id: 'b', title: 'Kış listesi taslağı', dueDate: '' },
]

export default function Preview() {
  const [index, setIndex] = useState(0)
  return (
    <div>
      <button onClick={() => setIndex((index + 1) % drafts.length)}>Başka taslak seç</button>
      <DraftEditor draft={drafts[index]} onSave={(values) => console.log('kaydedildi', values)} />
    </div>
  )
}
