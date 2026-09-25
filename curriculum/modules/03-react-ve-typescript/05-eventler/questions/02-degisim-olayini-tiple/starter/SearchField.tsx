import type { ChangeEvent } from 'react'
type Props = { value: string; onChange: (value: string) => void }
export function SearchField({ value, onChange }: Props) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {}
  return <input aria-label="Film ara" value={value} onChange={handleChange} />
}
