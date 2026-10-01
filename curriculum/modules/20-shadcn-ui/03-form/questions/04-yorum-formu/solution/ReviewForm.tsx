import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import { reviewSchema, type ReviewValues } from './reviewSchema'

export function ReviewForm({ onSubmit }: { onSubmit: (values: ReviewValues) => void }) {
  const form = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { body: '' },
  })

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yorum</FormLabel>
              <FormControl>
                <textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Puan (1–5)</FormLabel>
              <FormControl>
                <input
                  type="number"
                  min={1}
                  max={5}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={field.value ?? ''}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === '' ? undefined : event.target.valueAsNumber,
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Gönder</button>
      </form>
    </Form>
  )
}
