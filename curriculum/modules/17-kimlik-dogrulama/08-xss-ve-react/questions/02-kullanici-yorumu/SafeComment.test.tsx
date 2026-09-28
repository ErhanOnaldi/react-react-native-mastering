import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SafeComment } from '@exercise/SafeComment'

describe('SafeComment', () => {
  it('yazar adını ve normal yorum metnini ekranda gösterir', () => {
    render(<SafeComment author="Ahmet" content="Sinematografi çok etkileyiciydi." />)
    expect(screen.getByText('Ahmet')).toBeInTheDocument()
    expect(screen.getByText('Sinematografi çok etkileyiciydi.')).toBeInTheDocument()
  })

  it('zararlı img etiketini HTML olarak çalıştırmaz, salt metin olarak gösterir', () => {
    const maliciousPayload = '<img src=x onerror="alert(1)">'
    const { container } = render(
      <SafeComment author="Saldırgan" content={maliciousPayload} />,
    )

    // DOM içinde kesinlikle <img> etiketi oluşmamalıdır
    expect(container.querySelector('img')).toBeNull()

    // Metin kaçışlanmış olarak görünür olmalıdır
    expect(screen.getByText(maliciousPayload)).toBeInTheDocument()
  })

  it('zararlı script etiketini DOM öğesi olarak eklemez ve metin olarak kaçışlar', () => {
    const maliciousScript = '<script>window.hacked = true</script>'
    const { container } = render(
      <SafeComment author="Kötü Niyetli" content={maliciousScript} />,
    )

    expect(container.querySelector('script')).toBeNull()
    expect(screen.getByText(maliciousScript)).toBeInTheDocument()
  })

  it('güvenli websiteUrl verildiğinde harici bağlantıyı rel özniteliğiyle render eder', () => {
    render(
      <SafeComment
        author="Ayşe"
        content="İncelememi sitemde paylaştım."
        websiteUrl="https://sinema-kulubu.example"
      />,
    )

    const link = screen.getByRole('link', { name: 'Web sitesi' })
    expect(link).toHaveAttribute('href', 'https://sinema-kulubu.example')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('javascript şeması içeren websiteUrl değerini fallback (#) bağlantısına çevirir', () => {
    render(
      <SafeComment
        author="Saldırgan"
        content="Profilime tıkla."
        websiteUrl="javascript:alert(document.cookie)"
      />,
    )

    const link = screen.getByRole('link', { name: 'Web sitesi' })
    expect(link).toHaveAttribute('href', '#')
    expect(link.getAttribute('href')).not.toContain('javascript:')
  })
})
