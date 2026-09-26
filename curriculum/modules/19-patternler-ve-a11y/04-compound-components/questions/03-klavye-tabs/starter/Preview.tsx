import { KeyboardTabs as T } from './KeyboardTabs'
export default function Preview() {
  return (
    <T defaultValue="summary">
      <T.List aria-label="Film bilgileri">
        <T.Trigger value="summary">Özet</T.Trigger>
        <T.Trigger value="cast">Oyuncular</T.Trigger>
        <T.Trigger value="video">Videolar</T.Trigger>
      </T.List>
      <T.Panel value="summary">Dövüş Kulübü özeti</T.Panel>
      <T.Panel value="cast">Oyuncular</T.Panel>
      <T.Panel value="video">Fragmanlar</T.Panel>
    </T>
  )
}
