interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <label htmlFor="movie-search">Film ara</label>
      <input
        id="movie-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-500 bg-slate-900 px-3 py-2 text-white focus-visible:outline-2 focus-visible:outline-sky-400"
      />
    </div>
  )
}
