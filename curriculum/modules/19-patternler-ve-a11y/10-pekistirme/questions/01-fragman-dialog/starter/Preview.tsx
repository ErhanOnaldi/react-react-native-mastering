import { TrailerDialog } from './TrailerDialog'

export default function Preview() {
  return (
    <main>
      <article style={{ overflow: 'hidden', height: 120, border: '1px solid', padding: 12 }}>
        <h1>Dövüş Kulübü</h1>
        <TrailerDialog movieTitle="Dövüş Kulübü" />
      </article>
      <button type="button">Arka sayfa eylemi</button>
    </main>
  )
}
