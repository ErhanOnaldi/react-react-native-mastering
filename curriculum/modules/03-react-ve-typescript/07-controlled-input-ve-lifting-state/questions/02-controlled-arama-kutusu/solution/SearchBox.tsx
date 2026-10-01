type Props = { value: string; onChange: (value: string) => void }
export function SearchBox({ value, onChange }: Props) {
  return (
    <label>
      Film ara
      <input value={value} onChange={(event) => onChange(event.currentTarget.value)} />
    </label>
  )
}
