import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RemoteView } from '@exercise/RemoteView'
describe('RemoteView', () => {
  it('idle ve loading durumlarını ayrı gösterir', () => {
    const { rerender } = render(<RemoteView state={{ status: 'idle' }} />)
    expect(screen.getByText('Arama yap')).toBeInTheDocument()
    rerender(<RemoteView state={{ status: 'loading' }} />)
    expect(screen.getByText('Yükleniyor')).toBeInTheDocument()
  })
  it('hata mesajını alert olarak gösterir', () => {
    render(<RemoteView state={{ status: 'error', message: 'Bağlantı yok' }} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Bağlantı yok')
  })
  it('başarı durumunda film veya boş mesaj gösterir', () => {
    const { rerender } = render(
      <RemoteView state={{ status: 'success', data: [{ id: 550, title: 'Dövüş Kulübü' }] }} />,
    )
    expect(screen.getByRole('listitem')).toHaveTextContent('Dövüş Kulübü')
    rerender(<RemoteView state={{ status: 'success', data: [] }} />)
    expect(screen.getByText('Film bulunamadı')).toBeInTheDocument()
  })
})
