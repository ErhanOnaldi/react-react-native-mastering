import { useRef } from 'react'
export function SearchFocus() {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div>
      <button type="button" onClick={() => inputRef.current?.focus()}>
        Aramaya geç
      </button>
      <input ref={inputRef} aria-label="Film ara" />
    </div>
  )
}
