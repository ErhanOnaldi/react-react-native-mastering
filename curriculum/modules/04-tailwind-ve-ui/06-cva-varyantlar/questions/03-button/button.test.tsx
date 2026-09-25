import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button, buttonVariants } from '@exercise/Button'
describe('Button', () => {
  it('varsayılan primary ve md görünümünü üretir', () => {
    render(<Button>Kaydet</Button>)
    expect(screen.getByRole('button', { name: 'Kaydet' })).toHaveClass(
      'bg-sky-700',
      'px-4',
      'focus-visible:outline-2',
    )
  })
  it('secondary ve ghost varyantlarını ayırır', () => {
    const { rerender } = render(<Button variant="secondary">Seç</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-sky-700')
    rerender(<Button variant="ghost">Seç</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })
  it('sm ve lg boyutları farklı iç boşluk verir', () => {
    expect(buttonVariants({ size: 'sm' })).toContain('px-2')
    expect(buttonVariants({ size: 'lg' })).toContain('px-6')
  })
  it('küçük ghost birleşiminde compound class üretir', () => {
    expect(buttonVariants({ variant: 'ghost', size: 'sm' })).toContain('underline-offset-2')
  })
  it('dışarıdan verilen padding override’ını korur', () => {
    render(<Button className="px-8">Kaydet</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-8')
    expect(screen.getByRole('button')).not.toHaveClass('px-4')
  })
  it('disabled, aria, data ve tıklama props’larını iletir', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled aria-label="Kaydet" data-state="busy" onClick={onClick}>
        Metin
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Kaydet' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('data-state', 'busy')
    await userEvent.setup().click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
