import { useRef, useState } from 'react'

export type WatchlistDraft = {
  name: string
  description: string
  cover: string
  firstMovie: string
  tag: string
  color: string
  sort: string
  note: string
}
export function ManualWatchlistForm({ onSave }: { onSave: (draft: WatchlistDraft) => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState('')
  const [firstMovie, setFirstmovie] = useState('')
  const [tag, setTag] = useState('')
  const [color, setColor] = useState('')
  const [sort, setSort] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const renders = useRef(0)
  renders.current += 1
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Liste adı gerekli')
      return
    } else if (name.trim().length < 3) {
      setError('Liste adı en az 3 karakter olmalı')
      return
    } else if (!firstMovie.trim()) {
      setError('İlk film gerekli')
      return
    }
    setError('')
    onSave({ name, description, cover, firstMovie, tag, color, sort, note })
  }
  return (
    <form onSubmit={submit}>
      <output>{renders.current}</output>
      <label htmlFor="name">Liste adı</label>
      <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="description">Açıklama</label>
      <input
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label htmlFor="cover">Kapak</label>
      <input id="cover" value={cover} onChange={(e) => setCover(e.target.value)} />
      <label htmlFor="firstMovie">İlk film</label>
      <input id="firstMovie" value={firstMovie} onChange={(e) => setFirstmovie(e.target.value)} />
      <label htmlFor="tag">Etiket</label>
      <input id="tag" value={tag} onChange={(e) => setTag(e.target.value)} />
      <label htmlFor="color">Renk</label>
      <input id="color" value={color} onChange={(e) => setColor(e.target.value)} />
      <label htmlFor="sort">Sıra</label>
      <input id="sort" value={sort} onChange={(e) => setSort(e.target.value)} />
      <label htmlFor="note">Not</label>
      <input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
      {error && <p>{error}</p>}
      <button type="submit">Kaydet</button>
    </form>
  )
}
