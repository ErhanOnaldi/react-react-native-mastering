import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface FormValues {
  rating: string
}

const MOVIE_ID = 550
const MOVIE_TITLE = 'Dövüş Kulübü'
const headers = { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` }

export function RatingForm() {
  const [session, setSession] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({ defaultValues: { rating: '8' } })

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/authentication/guest_session/new', { headers })
      .then((response) => response.json() as Promise<{ guest_session_id: string }>)
      .then((data) => setSession(data.guest_session_id))
  }, [])

  async function submit(values: FormValues) {
    setStatus('idle')
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${MOVIE_ID}/rating?guest_session_id=${session}`,
      {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: Number(values.rating) }),
      },
    )
    if (!response.ok) {
      setStatus('error')
      return
    }
    setStatus('success')
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <p>{MOVIE_TITLE}</p>
      <label>
        Puan
        <select aria-label="Puan" disabled={!session} {...register('rating')}>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </label>
      <button disabled={!session || isSubmitting} type="submit">
        Gönder
      </button>
      {status === 'success' && <p>Puan kaydedildi</p>}
      {status === 'error' && <p role="alert">Puan kaydedilemedi, tekrar dene</p>}
    </form>
  )
}
