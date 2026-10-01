import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieRow } from '@exercise/MovieRow'
describe('MovieRow', () => {
  it('başlık ve puanı aynı satır düzenine alır', () => {
    const { container } = render(<MovieRow title="Dövüş Kulübü" score="8.4" />)
    expect(container.firstElementChild).toHaveClass(
      'flex',
      'items-center',
      'justify-between',
      'gap-2',
    )
  })
  it('uzun başlığa daralma ve kısaltma class’ı verir', () => {
    render(<MovieRow title="Yıldızlararası: Uzun Bir Yolculuk" score="8.6" />)
    expect(screen.getByRole('heading', { name: 'Yıldızlararası: Uzun Bir Yolculuk' })).toHaveClass(
      'min-w-0',
      'truncate',
    )
  })
  it('puanı daralmadan korur', () => {
    render(<MovieRow title="Matrix" score="8.2" />)
    expect(screen.getByText('8.2')).toHaveClass('shrink-0')
  })
})
