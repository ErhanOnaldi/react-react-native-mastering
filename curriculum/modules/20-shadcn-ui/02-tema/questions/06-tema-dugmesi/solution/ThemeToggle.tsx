import { useState } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  function toggleTheme() {
    const nextDark = !dark
    setDark(nextDark)
    if (nextDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  return (
    <button type="button" aria-pressed={dark} onClick={toggleTheme}>
      {dark ? 'Açık temaya geç' : 'Koyu temaya geç'}
    </button>
  )
}
