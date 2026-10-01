import { PosterGrid } from './PosterGrid'
export default function Preview() {
  return (
    <PosterGrid
      movies={[
        { id: 550, title: 'Dövüş Kulübü' },
        { id: 27205, title: 'Başlangıç' },
      ]}
    />
  )
}
