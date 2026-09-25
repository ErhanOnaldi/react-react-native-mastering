import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResultPanel } from '@/features/question/result-panel'

describe('ResultPanel', () => {
  it('sonuç yokken yönlendirme metnini gösterir', () => {
    render(<ResultPanel running={false} emptyHint="Çalıştır'a bas" />)
    expect(screen.getByText("Çalıştır'a bas")).toBeInTheDocument()
  })

  it('çalışırken durum gösterir', () => {
    render(<ResultPanel running emptyHint="" />)
    expect(screen.getByRole('status')).toHaveTextContent('Testler çalışıyor')
  })

  it('kalan testin mesajını ve konumunu, tip hatalarını ve mutant sonuçlarını gösterir', () => {
    render(
      <ResultPanel
        running={false}
        emptyHint=""
        result={{
          status: 'failed',
          summary: '1/2 test · 1 tip hatası · 1/2 hatalı versiyon yakalandı',
          durationMs: 1200,
          tests: [
            { name: 'a', fullName: 'toplar', status: 'passed' },
            {
              name: 'b',
              fullName: 'sıfırda sayıyı korur',
              status: 'failed',
              failedBy: 'type',
              message: 'expected 0 to be 5',
              location: 'sum.test.ts:10',
            },
          ],
          typeErrors: [
            { file: 'sum.ts', line: 2, column: 3, code: 'TS2322', message: 'Type string…' },
          ],
          mutants: [
            { id: 'x', label: 'ikinci sayıyı yok sayan', caught: true },
            { id: 'y', label: 'hep 0 dönen', caught: false },
          ],
        }}
      />,
    )
    expect(
      screen.getByText('1/2 test · 1 tip hatası · 1/2 hatalı versiyon yakalandı'),
    ).toBeInTheDocument()
    expect(screen.getByText('expected 0 to be 5')).toBeInTheDocument()
    expect(screen.getByText('→ sum.test.ts:10')).toBeInTheDocument()
    expect(screen.getByText('tip testi')).toBeInTheDocument()
    expect(screen.getByText('sum.ts:2:3 · TS2322')).toBeInTheDocument()
    expect(screen.getByText('kaçtı')).toBeInTheDocument()
  })
})
