import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrandHeading } from '@exercise/BrandHeading'
describe('BrandHeading', () => {
  it('başlığı anlamsal h2 olarak gösterir', () => {
    render(<BrandHeading>Dövüş Kulübü</BrandHeading>)
    expect(screen.getByRole('heading', { level: 2, name: 'Dövüş Kulübü' })).toBeInTheDocument()
  })
  it('tema rengi ve font utility’lerini kullanır', () => {
    render(<BrandHeading>Sinema</BrandHeading>)
    expect(screen.getByRole('heading')).toHaveClass(
      'font-display',
      'text-brand-700',
      'dark:text-brand-300',
    )
  })
  it('ek className değerini korur', () => {
    render(<BrandHeading className="text-rose-700">Sinema</BrandHeading>)
    expect(screen.getByRole('heading')).toHaveClass('text-rose-700')
    expect(screen.getByRole('heading')).not.toHaveClass('text-brand-700')
  })
})
