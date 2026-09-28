import { SessionPanel } from './SessionPanel'

export default function Preview() {
  return (
    <div>
      <p>
        1 dakikalık oturumla giriş yap (emilys / emilyspass), bir dakikadan fazla bekle, sonra
        "Profili yenile"ye bas.
      </p>
      <SessionPanel sessionMinutes={1} />
    </div>
  )
}
