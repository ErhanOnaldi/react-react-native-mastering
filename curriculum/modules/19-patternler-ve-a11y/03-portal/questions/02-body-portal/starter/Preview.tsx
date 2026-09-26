import { BodyPortal } from './BodyPortal'
export default function Preview() {
  return (
    <div style={{ height: 80, overflow: 'hidden', border: '2px solid' }}>
      <p>Film kartı</p>
      <BodyPortal>
        <div style={{ background: 'white', border: '2px solid', padding: 24 }}>
          Dövüş Kulübü fragman alanı
        </div>
      </BodyPortal>
    </div>
  )
}
