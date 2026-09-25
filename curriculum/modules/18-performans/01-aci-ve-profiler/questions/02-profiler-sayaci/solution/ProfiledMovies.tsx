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
    <Profiler id="movie-list" onRender={onCommit}>
      <ul>
        {titles.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>
    </Profiler>
  )
}
