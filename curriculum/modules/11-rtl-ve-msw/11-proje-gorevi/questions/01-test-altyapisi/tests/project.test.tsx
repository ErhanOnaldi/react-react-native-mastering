import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { screen } from '@testing-library/react'
import { useParams } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '@project/src/test/render'
const root = process.env.RM_PROJECT_DIR!
function IdPage() {
  const { id } = useParams()
  return <h1>Film {id}</h1>
}
describe('Sinema test altyapısı', () => {
  it('setup MSW ve RTL temizliğini kurar', () => {
    const setupPath = join(root, 'src/test/setup.ts')
    const handlersPath = join(root, 'src/test/msw/handlers.ts')
    expect(existsSync(setupPath)).toBe(true)
    expect(existsSync(handlersPath)).toBe(true)
    const setup = readFileSync(setupPath, 'utf8')
    const handlers = readFileSync(handlersPath, 'utf8')
    const vite = readFileSync(join(root, 'vite.config.ts'), 'utf8')
    expect(setup).toContain('@testing-library/jest-dom/vitest')
    expect(setup).toMatch(/setupServer\s*\(/)
    expect(setup).toMatch(/resetHandlers\s*\(/)
    expect(setup).toMatch(/cleanup\s*\(/)
    expect(setup).toMatch(/server\.close\s*\(/)
    expect(handlers).toMatch(/http\.get\s*\(/)
    expect(handlers).toMatch(/Authorization/)
    expect(vite).toMatch(/setupFiles/)
  })
  it('renderWithRouter route parametresini bileşene verir', () => {
    const { router } = renderWithRouter([{ path: '/movie/:id', element: <IdPage /> }], {
      route: '/movie/550',
    })
    expect(screen.getByRole('heading', { name: 'Film 550' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/movie/550')
  })
})
