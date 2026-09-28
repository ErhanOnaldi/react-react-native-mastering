type SearchBoxProps = {
  query: string
  onQueryChange: (query: string) => void
}

export function SearchBox({ query }: SearchBoxProps) {
  return <input type="search" aria-label="Film ara" value={query} readOnly />
}
