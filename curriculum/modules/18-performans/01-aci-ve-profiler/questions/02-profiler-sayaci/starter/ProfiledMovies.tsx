import { Profiler } from 'react'
import type { ProfilerOnRenderCallback } from 'react'

export function ProfiledMovies({
  titles,
  onCommit,
}: {
  titles: string[]
  onCommit: ProfilerOnRenderCallback
}) {
  return (
    <ul>
      {titles.map((title) => (
        <li key={title}>{title}</li>
      ))}
    </ul>
  )
}
