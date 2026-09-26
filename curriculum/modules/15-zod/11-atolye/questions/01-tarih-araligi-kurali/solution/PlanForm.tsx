import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const planSchema = z
  .object({
    title: z.string().trim().min(1, { error: 'Plan adı gerekli' }),
    startDate: z.string().min(1, { error: 'Başlangıç tarihi gerekli' }),
    endDate: z.string().min(1, { error: 'Bitiş tarihi gerekli' }),
  })
  .refine((value) => value.endDate >= value.startDate, {
    path: ['endDate'],
    error: 'Bitiş tarihi başlangıçtan önce olamaz',
  })

type PlanValues = z.infer<typeof planSchema>

export function PlanForm({ onSubmit }: { onSubmit: (values: PlanValues) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanValues>({ resolver: zodResolver(planSchema) })

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))}>
      <label htmlFor="title">Plan adı</label>
      <input
        id="title"
        aria-invalid={Boolean(errors.title)}
        aria-describedby={errors.title ? 'title-error' : undefined}
        {...register('title')}
      />
      {errors.title && (
        <p role="alert" id="title-error">
          {errors.title.message}
        </p>
      )}

      <label htmlFor="startDate">Başlangıç tarihi</label>
      <input
        id="startDate"
        placeholder="YYYY-AA-GG"
        aria-invalid={Boolean(errors.startDate)}
        aria-describedby={errors.startDate ? 'startDate-error' : undefined}
        {...register('startDate')}
      />
      {errors.startDate && (
        <p role="alert" id="startDate-error">
          {errors.startDate.message}
        </p>
      )}

      <label htmlFor="endDate">Bitiş tarihi</label>
      <input
        id="endDate"
        placeholder="YYYY-AA-GG"
        aria-invalid={Boolean(errors.endDate)}
        aria-describedby={errors.endDate ? 'endDate-error' : undefined}
        {...register('endDate')}
      />
      {errors.endDate && (
        <p role="alert" id="endDate-error">
          {errors.endDate.message}
        </p>
      )}

      <button type="submit">Planı kaydet</button>
    </form>
  )
}
