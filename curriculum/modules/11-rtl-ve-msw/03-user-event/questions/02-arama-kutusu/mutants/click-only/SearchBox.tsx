interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
}

export function SearchBox({ value, onChange, onSubmit }: Props) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const query = value.trim()
        if (query && event.nativeEvent.submitter) onSubmit(query)
      }}
    >
      <label htmlFor="movie-search">Film ara</label>
      <input
        id="movie-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.preventDefault()
        }}
      />
      <button type="submit">Ara</button>
    </form>
  )
}
