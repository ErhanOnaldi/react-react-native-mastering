import { useForm } from 'react-hook-form'

interface PlanValues {
  title: string
  startDate: string
  endDate: string
}

export function PlanForm({ onSubmit }: { onSubmit: (values: PlanValues) => void }) {
  const { register, handleSubmit } = useForm<PlanValues>()

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))}>
      <label htmlFor="title">Plan adı</label>
      <input id="title" {...register('title')} />

      <label htmlFor="startDate">Başlangıç tarihi</label>
      <input id="startDate" placeholder="YYYY-AA-GG" {...register('startDate')} />

      <label htmlFor="endDate">Bitiş tarihi</label>
      <input id="endDate" placeholder="YYYY-AA-GG" {...register('endDate')} />

      <button type="submit">Planı kaydet</button>
    </form>
  )
}
