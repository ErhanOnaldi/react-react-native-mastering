import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { z } from 'zod'
import { useAppDispatch } from '@/app/store'
import { login } from '@/features/auth/auth-api'
import { setCredentials } from '@/features/auth/authSlice'
import { getSafeRedirect } from '@/features/auth/safe-redirect'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

const schema = z.object({
  username: z.string().trim().min(1, 'Kullanıcı adı gerekli.'),
  password: z.string().min(1, 'Parola gerekli.'),
})
type Values = z.infer<typeof schema>

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })
  async function submit(values: Values) {
    setError('')
    try {
      const { id, username, accessToken, refreshToken } = await login(
        values.username,
        values.password,
      )
      dispatch(
        setCredentials({ user: { id, username }, accessToken, refreshToken }),
      )
      const from = (location.state as { from?: unknown } | null)?.from
      const queryRedirect = new URLSearchParams(location.search).get('redirect')
      const destination = getSafeRedirect(from, getSafeRedirect(queryRedirect))
      await navigate(destination, { replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Giriş başarısız.')
    }
  }
  return (
    <section className="max-w-sm space-y-4">
      <h2 className="text-2xl font-semibold">Giriş yap</h2>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <label className="block">
          Kullanıcı adı
          <Input autoComplete="username" {...register('username')} />
        </label>
        {errors.username && <p role="alert">{errors.username.message}</p>}
        <label className="block">
          Parola
          <Input
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
        </label>
        {errors.password && <p role="alert">{errors.password.message}</p>}
        {error && <p role="alert">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>
          Giriş yap
        </Button>
      </form>
    </section>
  )
}
