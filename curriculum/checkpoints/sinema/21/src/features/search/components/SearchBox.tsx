import { Input } from '@/components/ui/input'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <label htmlFor="movie-search">Film ara</label>
      <Input
        id="movie-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
