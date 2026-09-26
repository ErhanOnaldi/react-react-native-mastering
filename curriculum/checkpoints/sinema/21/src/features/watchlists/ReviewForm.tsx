import { useId } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { reviewSchema } from './schemas'

type ReviewValues = z.output<typeof reviewSchema>

const SCORES = [1, 2, 3, 4, 5]

export function ReviewForm({ postId }: { postId: number }) {
  const id = useId()
  const form = useForm<ReviewValues>({
    defaultValues: { body: '' },
    resolver: zodResolver(reviewSchema),
  })

  const mutation = useMutation({
    mutationFn: async ({ body }: ReviewValues) => {
      const response = await fetch('https://dummyjson.com/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, postId, userId: 1 }),
      })
      if (!response.ok)
        throw new Error(`Yorum gönderilemedi (${response.status}).`)
      return response.json()
    },
    onSuccess: () => form.reset(),
  })

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              {/* FormLabel bir <label htmlFor>; radiogroup bir div olduğu için adı aria-labelledby ile veriyoruz. */}
              <FormLabel id={`${id}-rating-label`}>Puan</FormLabel>
              <FormControl>
                <RadioGroup
                  aria-labelledby={`${id}-rating-label`}
                  className="flex flex-wrap gap-4"
                  name={field.name}
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(value) => field.onChange(Number(value))}
                  onBlur={field.onBlur}
                >
                  {SCORES.map((score) => (
                    <div key={score} className="flex items-center gap-2">
                      <RadioGroupItem
                        id={`${id}-rating-${score}`}
                        value={String(score)}
                      />
                      <Label htmlFor={`${id}-rating-${score}`}>
                        {score} yıldız
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yorum</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Gönderiliyor…' : 'Gönder'}
        </Button>
        {mutation.isSuccess && <p role="status">Yorum kaydedildi</p>}
        {mutation.isError && <p role="alert">{mutation.error.message}</p>}
      </form>
    </Form>
  )
}
