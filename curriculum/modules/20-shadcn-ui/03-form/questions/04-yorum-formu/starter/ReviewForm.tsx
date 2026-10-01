import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from './form'
import { reviewSchema, type ReviewValues } from './reviewSchema'

export function ReviewForm({ onSubmit }: { onSubmit: (values: ReviewValues) => void }) {
  const form = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { body: '' },
  })

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <button type="submit">Gönder</button>
      </form>
    </Form>
  )
}
