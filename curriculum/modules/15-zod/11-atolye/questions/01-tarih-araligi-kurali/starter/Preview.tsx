import { PlanForm } from './PlanForm'

export default function Preview() {
  return <PlanForm onSubmit={(values) => console.log('gönderildi', values)} />
}
