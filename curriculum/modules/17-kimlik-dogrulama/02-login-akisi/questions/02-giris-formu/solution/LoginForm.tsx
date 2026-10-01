import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  username: z.string().trim().min(1, { error: 'Kullanıcı adı gerekli' }),
  password: z.string().min(1, { error: 'Parola gerekli' }),
})
export interface LoginValues {
  username: string
  password: string
}
export function LoginForm({
  onLogin,
}: {
  onLogin: (credentials: { username: string; password: string }) => Promise<void> | void
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
  })
  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        try {
          await onLogin(values)
        } catch (error) {
          setError('root', { message: error instanceof Error ? error.message : 'Giriş başarısız' })
        }
      })}
    >
      <label>
        Kullanıcı adı
        <input {...register('username')} aria-invalid={Boolean(errors.username)} />
      </label>
      {errors.username && <p role="alert">{errors.username.message}</p>}
      <label>
        Parola
        <input type="password" {...register('password')} aria-invalid={Boolean(errors.password)} />
      </label>
      {errors.password && <p role="alert">{errors.password.message}</p>}
      {errors.root && <p role="alert">{errors.root.message}</p>}
      <button disabled={isSubmitting}>Giriş yap</button>
    </form>
  )
}
