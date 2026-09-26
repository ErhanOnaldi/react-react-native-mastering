import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PlanForm } from '@exercise/PlanForm'

describe('izleme planı formu', () => {
  it('bitiş başlangıçtan önceyse erişilebilir hata gösterir ve göndermez', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<PlanForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Plan adı'), 'Yaz Tatili')
    await user.type(screen.getByLabelText('Başlangıç tarihi'), '2026-07-10')
    await user.type(screen.getByLabelText('Bitiş tarihi'), '2026-07-05')
    await user.click(screen.getByRole('button', { name: 'Planı kaydet' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('önce olamaz')
    const endDateInput = screen.getByLabelText('Bitiş tarihi')
    expect(endDateInput).toHaveAttribute('aria-invalid', 'true')
    expect(endDateInput).toHaveAttribute('aria-describedby', alert.id)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('geçerli aralıkla girilen değerlerle gönderir', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<PlanForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Plan adı'), 'Yaz Tatili')
    await user.type(screen.getByLabelText('Başlangıç tarihi'), '2026-07-10')
    await user.type(screen.getByLabelText('Bitiş tarihi'), '2026-07-20')
    await user.click(screen.getByRole('button', { name: 'Planı kaydet' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Yaz Tatili',
      startDate: '2026-07-10',
      endDate: '2026-07-20',
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
