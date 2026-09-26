import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MovieSummary } from '@exercise/MovieSummary'

describe('film özeti', () => {
  it('seçim değiştiği anda yeni filmin başlığını ve süresini gösterir', async () => {
    render(<MovieSummary />)
    expect(screen.getByLabelText('Film özeti')).toHaveTextContent('Dövüş Kulübü: 139 dakika')
    await userEvent.click(screen.getByRole('button', { name: 'Başlangıç' }))
    expect(screen.getByLabelText('Film özeti')).toHaveTextContent('Başlangıç: 148 dakika')
    expect(screen.getByRole('button', { name: 'Başlangıç' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('önceki filme dönünce özeti tekrar onunla eşler', async () => {
    render(<MovieSummary />)
    await userEvent.click(screen.getByRole('button', { name: 'Başlangıç' }))
    await userEvent.click(screen.getByRole('button', { name: 'Dövüş Kulübü' }))
    expect(screen.getByLabelText('Film özeti')).toHaveTextContent('Dövüş Kulübü: 139 dakika')
  })
})
