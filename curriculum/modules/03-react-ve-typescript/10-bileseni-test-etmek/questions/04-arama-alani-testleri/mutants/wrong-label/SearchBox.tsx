type SearchBoxProps = {
  query: string
  onQueryChange: (query: string) => void
}

export function SearchBox({ query, onQueryChange }: SearchBoxProps) {
  return (
    <label>
      Film ara
      <input
        type="search"
        aria-label="Kitap ara"
        value={query}
        onChange={(event) => onQueryChange(event.currentTarget.value)}
      />
    </label>
  )
}
