import { useState } from 'react'
export function PopularTitles() {
  const [titles, setTitles] = useState<string[]>([])
  return <p>{titles.length ? titles[0] : 'Yükleniyor'}</p>
}
