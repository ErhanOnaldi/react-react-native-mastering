import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
export type Values = { body: string }
export function CommentForm({ postId = 550 }: { postId?: number }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Values>({ defaultValues: { body: '' } })
  const mutation = useMutation({
    mutationFn: async (values: Values) => {
      const response = await fetch('https://dummyjson.com/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: values.body, postId, userId: 1 }),
      })
      if (!response.ok) throw new Error('Yorum gönderilemedi')
      return response.json() as Promise<{ id: number; body: string }>
    },
  })
  async function submit(values: Values) {
    try {
      await mutation.mutateAsync(values)
      reset()
    } catch {
      // mutation.isError kullanıcıya hatayı gösterir; metin korunur.
    }
  }
  return (
    <form onSubmit={handleSubmit(submit)}>
      <label htmlFor="body">Yorum</label>
      <textarea id="body" {...register('body', { required: 'Yorum gerekli' })} />
      {errors.body && <p role="alert">{errors.body.message}</p>}
      {mutation.isError && <p role="alert">Yorum gönderilemedi</p>}
      {mutation.isSuccess && <p role="status">Yorum kaydedildi</p>}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Gönderiliyor…' : 'Gönder'}
      </button>
    </form>
  )
}
