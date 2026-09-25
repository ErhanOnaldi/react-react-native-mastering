import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
export type Values = { body: string }
export function CommentForm({ postId = 550 }: { postId?: number }) {
  const { register, handleSubmit } = useForm<Values>({ defaultValues: { body: '' } })
  useMutation({ mutationFn: async (values: Values) => values })
  return (
    <form onSubmit={handleSubmit(() => {})}>
      <label htmlFor="body">Yorum</label>
      <textarea id="body" {...register('body')} />
      <button>Gönder</button>
    </form>
  )
}
