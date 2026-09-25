import { DeferredSearch } from './DeferredSearch'
const titles = Array.from({ length: 500 }, (_, i) => (i === 249 ? 'Dövüş Kulübü' : `Film ${i + 1}`))
export default function Preview() {
  return <DeferredSearch titles={titles} />
}
