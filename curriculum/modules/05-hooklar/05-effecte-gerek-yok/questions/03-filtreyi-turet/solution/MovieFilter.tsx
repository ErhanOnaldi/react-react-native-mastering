export function MovieFilter({ titles, query }: { titles: string[]; query: string }) {
  const visible = titles.filter((t) =>
    t.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')),
  )
  return (
    <ul>
      {visible.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}
