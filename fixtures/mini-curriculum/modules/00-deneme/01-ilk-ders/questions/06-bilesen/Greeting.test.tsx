import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Greeting } from '@exercise/Greeting'

describe('Greeting', () => {
  it('ismi başlıkta gösterir', () => {
    render(<Greeting name="Ada" />)
    expect(screen.getByRole('heading', { name: 'Merhaba Ada' })).toBeInTheDocument()
  })
})
