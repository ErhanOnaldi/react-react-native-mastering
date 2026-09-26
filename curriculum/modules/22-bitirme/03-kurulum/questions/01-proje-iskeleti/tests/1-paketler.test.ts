import { describe, expect, it } from 'vitest'
import { readPackageJson } from './project-tools'

const pkg = readPackageJson()
const scripts = pkg.scripts ?? {}
const deps = pkg.dependencies ?? {}
const devDeps = pkg.devDependencies ?? {}

describe('package.json', () => {
  it('ES modülü ("type": "module") ve yayınlanmayan ("private": true) bir paket', () => {
    expect(pkg.type).toBe('module')
    expect(pkg.private).toBe(true)
  })

  it('geliştirme script’leri: dev, build (önce tsc -b), preview, typecheck', () => {
    expect(scripts.dev).toMatch(/^vite(\s|$)/)
    expect(scripts.build).toMatch(/^tsc -b && vite build/)
    expect(scripts.preview).toMatch(/^vite preview/)
    expect(scripts.typecheck).toMatch(/^tsc -b/)
  })

  it('kalite script’leri: lint → eslint ., format → prettier --write ., format:check → prettier --check .', () => {
    expect(scripts.lint).toMatch(/^eslint \.($|\s)/)
    expect(scripts.format).toMatch(/^prettier --write \.($|\s)/)
    expect(scripts['format:check']).toMatch(/^prettier --check \.($|\s)/)
  })

  it('test script’leri: test → vitest run (izleme modunda takılmaz), test:e2e → playwright test', () => {
    expect(scripts.test).toMatch(/vitest (run|--run)/)
    expect(scripts['test:e2e']).toMatch(/playwright test/)
  })

  it.each([
    'react',
    'react-dom',
    'react-router',
    '@tanstack/react-query',
    'react-hook-form',
    '@hookform/resolvers',
    'zod',
  ])('tarayıcıya giden %s → dependencies', (name) => {
    expect(deps, `${name} dependencies içinde olmalı`).toHaveProperty([name])
    expect(devDeps).not.toHaveProperty([name])
  })

  it.each([
    'typescript',
    'vite',
    '@vitejs/plugin-react',
    'tailwindcss',
    '@tailwindcss/vite',
    'vitest',
    'jsdom',
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event',
    'msw',
    'eslint',
    'typescript-eslint',
    'eslint-plugin-react-hooks',
    'prettier',
    '@playwright/test',
  ])('geliştirme aracı %s → devDependencies', (name) => {
    expect(devDeps, `${name} devDependencies içinde olmalı`).toHaveProperty([name])
    expect(deps).not.toHaveProperty([name])
  })

  it('eski eğitimlerin paketlerini kullanmaz: react-router-dom (v8’de kaldırıldı)', () => {
    expect({ ...deps, ...devDeps }).not.toHaveProperty(['react-router-dom'])
  })
})
