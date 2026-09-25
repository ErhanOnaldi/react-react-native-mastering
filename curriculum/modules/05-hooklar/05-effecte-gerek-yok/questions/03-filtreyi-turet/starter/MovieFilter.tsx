import { useEffect, useState } from 'react'
export function MovieFilter({ titles, query }: { titles: string[]; query: string }) {
  const [visible, setVisible] = useState(titles)
  useEffect(() => {
    setVisible(
      titles.filter((t) => t.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))),
    )
  }, [titles])
  return (
    <ul>
      {visible.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}
