type SearchBoxProps = {
  query: string
  onQueryChange: (query: string) => void
}

export function SearchBox({ query, onQueryChange }: SearchBoxProps) {
  return (
    <input
      type="text"
      aria-label="Film ara"
      value={query}
      onChange={(event) => onQueryChange(event.currentTarget.value)}
    />
  )
}
