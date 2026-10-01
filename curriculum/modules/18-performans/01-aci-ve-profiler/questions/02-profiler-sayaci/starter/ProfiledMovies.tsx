import { Profiler } from 'react'
import type { ProfilerOnRenderCallback } from 'react'

export function ProfiledMovies({
  titles,
  onCommit,
}: {
  titles: string[]
  onCommit: ProfilerOnRenderCallback
}) {
  // Liste commit'lerini ölçen sarmalayıcıyı ekle.
  return (
    <ul>
      {titles.map((title) => (
        <li key={title}>{title}</li>
      ))}
    </ul>
  )
}
