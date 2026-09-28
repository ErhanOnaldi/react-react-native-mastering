import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MoviePoster } from '@exercise/MoviePoster'

describe('MoviePoster', () => {
  it('priority true olduğunda loading eager ve fetchpriority high özniteliklerini taşır', () => {
    render(
      <MoviePoster
        src="/posters/inception.jpg"
        alt="Başlangıç"
        width={300}
        height={450}
        priority={true}
      />,
    )

    const img = screen.getByRole('img', { name: 'Başlangıç' })
    expect(img).toHaveAttribute('loading', 'eager')
    expect(img.getAttribute('fetchpriority')).toBe('high')
  })

  it('priority verilmediğinde veya false olduğunda loading lazy özniteliğini taşır', () => {
    const { rerender } = render(
      <MoviePoster
        src="/posters/interstellar.jpg"
        alt="Yıldızlararası"
        width={300}
        height={450}
      />,
    )

    let img = screen.getByRole('img', { name: 'Yıldızlararası' })
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img.getAttribute('fetchpriority')).not.toBe('high')

    rerender(
      <MoviePoster
        src="/posters/interstellar.jpg"
        alt="Yıldızlararası"
        width={300}
        height={450}
        priority={false}
      />,
    )

    img = screen.getByRole('img', { name: 'Yıldızlararası' })
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('her zaman decoding async özniteliğine sahiptir', () => {
    render(
      <MoviePoster
        src="/posters/matrix.jpg"
        alt="Matrix"
        width={300}
        height={450}
      />,
    )

    const img = screen.getByRole('img', { name: 'Matrix' })
    expect(img).toHaveAttribute('decoding', 'async')
  })

  it('verilen width ve height değerlerini sayısal olarak DOM öğesine aktarır', () => {
    render(
      <MoviePoster
        src="/posters/fight-club.jpg"
        alt="Dövüş Kulübü"
        width={250}
        height={375}
      />,
    )

    const img = screen.getByRole('img', { name: 'Dövüş Kulübü' })
    expect(img).toHaveAttribute('width', '250')
    expect(img).toHaveAttribute('height', '375')
  })

  it('src, alt ve className değerlerini doğru şekilde yansıtır', () => {
    render(
      <MoviePoster
        src="/posters/gladiator.jpg"
        alt="Gladyatör"
        width={200}
        height={300}
        className="rounded-lg shadow"
      />,
    )

    const img = screen.getByRole('img', { name: 'Gladyatör' })
    expect(img).toHaveAttribute('src', '/posters/gladiator.jpg')
    expect(img).toHaveAttribute('class', expect.stringContaining('rounded-lg shadow'))
  })
})
