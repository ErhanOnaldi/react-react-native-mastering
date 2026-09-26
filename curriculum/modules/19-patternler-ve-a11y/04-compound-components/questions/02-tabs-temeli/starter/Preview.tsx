import { Tabs } from './Tabs'
export default function Preview() {
  return (
    <Tabs defaultValue="summary">
      <Tabs.List aria-label="Film bilgileri">
        <Tabs.Trigger value="summary">Özet</Tabs.Trigger>
        <Tabs.Trigger value="cast">Oyuncular</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="summary">Dövüş Kulübü özeti</Tabs.Panel>
      <Tabs.Panel value="cast">Oyuncu listesi</Tabs.Panel>
    </Tabs>
  )
}
