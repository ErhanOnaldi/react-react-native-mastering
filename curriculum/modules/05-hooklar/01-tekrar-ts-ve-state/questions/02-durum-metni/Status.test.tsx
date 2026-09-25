import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Status } from '@exercise/Status'
describe('Status', () => {
  it('istek öncesinde arama çağrısı gösterir', () => {
    render(<Status result={{ status: 'idle' }} />)
    expect(screen.getByText('Aramaya başla')).toBeInTheDocument()
  })
  it('yüklenirken boş sonuç demez', () => {
    render(<Status result={{ status: 'loading' }} />)
    expect(screen.getByText('Yükleniyor')).toBeInTheDocument()
  })
  it('boş başarıyı ayrı gösterir', () => {
    render(<Status result={{ status: 'success', data: [] }} />)
    expect(screen.getByText('Sonuç yok')).toBeInTheDocument()
  })
  it('başarılı film sayısını gösterir', () => {
    render(<Status result={{ status: 'success', data: ['A', 'B'] }} />)
    expect(screen.getByText('2 film')).toBeInTheDocument()
  })
  it('hata açıklamasını gösterir', () => {
    render(<Status result={{ status: 'error', error: 'Bağlantı yok' }} />)
    expect(screen.getByText('Hata: Bağlantı yok')).toBeInTheDocument()
  })
})
