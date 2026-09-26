import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewValues>({
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
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>
        Başlık
        <input {...register('title')} />
      </label>
      {errors.title && <p role="alert">{errors.title.message}</p>}
      <label>
        Yorum
        <textarea {...register('body')} />
      </label>
      {errors.body && <p role="alert">{errors.body.message}</p>}
      <button type="submit" disabled={isSubmitting}>
        Gönder
      </button>
      {status === 'success' && <p role="status">Yorumun gönderildi</p>}
      {status === 'error' && <p role="alert">Yorum gönderilemedi, tekrar dene</p>}
    </form>
  )
}
