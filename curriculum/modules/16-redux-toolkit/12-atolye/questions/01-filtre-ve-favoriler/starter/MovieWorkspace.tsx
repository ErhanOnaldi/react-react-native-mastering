import { useState } from 'react'

export function MovieWorkspace() {
  const [genre, setGenre] = useState('28')

  return (
    <section>
      <label>
        Tür
        <select aria-label="Tür" value={genre} onChange={(event) => setGenre(event.target.value)}>
          <option value="28">Aksiyon</option>
          <option value="35">Komedi</option>
        </select>
      </label>
      <button>Sonraki sayfa</button>
      <p>Sonuç yok</p>
    </section>
  )
}
