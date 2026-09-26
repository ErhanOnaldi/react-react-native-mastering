import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { MovieDetail } from '@exercise/MovieDetail'

describe('değişen film detayı', () => {
  it('aynı bileşen açıkken yeni kimlik için istek atıp yeni başlığı gösterir', async () => {
    const view = render(<MovieDetail id={550} />)
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
    view.rerender(<MovieDetail id={27205} />)
    await waitFor(() => expect(requests('/3/movie/27205')).toHaveLength(1))
    expect(await screen.findByRole('heading', { name: 'Başlangıç' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Dövüş Kulübü' })).not.toBeInTheDocument()
  })

  it('yeni detay beklenirken eski film başlığını göstermeyip geri dönüşte yeniler', async () => {
    const view = render(<MovieDetail id={550} />)
    await screen.findByRole('heading', { name: 'Dövüş Kulübü' })
    view.rerender(<MovieDetail id={27205} />)
    expect(screen.queryByRole('heading', { name: 'Dövüş Kulübü' })).not.toBeInTheDocument()
    expect(screen.getByText('Yükleniyor')).toBeInTheDocument()
    await screen.findByRole('heading', { name: 'Başlangıç' })
    view.rerender(<MovieDetail id={550} />)
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
    expect(requests('/3/movie/550')).toHaveLength(2)
  })
})
