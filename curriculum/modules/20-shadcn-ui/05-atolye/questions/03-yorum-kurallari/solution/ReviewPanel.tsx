import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from './ui'

const reviewSchema = z
  .object({
    title: z.string().trim().min(1, { error: 'Başlık gerekli' }),
    body: z.string().trim().min(1, { error: 'Yorum metni gerekli' }),
  })
  .refine((values) => values.title.length + values.body.length >= 15, {
    error: 'Başlık ve yorum birlikte en az 15 karakter olmalı',
    path: ['body'],
  })

type ReviewValues = z.infer<typeof reviewSchema>

export function ReviewPanel() {
  const form = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { title: '', body: '' },
  })
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')

  async function onSubmit(values: ReviewValues) {
    setStatus('idle')
    try {
      const response = await fetch('https://dummyjson.com/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: `${values.title}: ${values.body}`,
          postId: 1,
          userId: 1,
        }),
      })
      if (!response.ok) throw new Error('Yorum gönderilemedi')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Başlık</FormLabel>
              <FormControl>
                <Input {...field} />
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
        <button type="submit" disabled={form.formState.isSubmitting}>
          Gönder
        </button>
        {status === 'success' && <p role="status">Yorumun gönderildi</p>}
        {status === 'error' && <p role="alert">Yorum gönderilemedi, tekrar dene</p>}
      </form>
    </Form>
  )
}
