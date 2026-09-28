import { describe, expect, it } from 'vitest'
import { assetHref } from '@exercise/assetHref'

describe('assetHref', () => {
  it('kök yayında asset yolunu tek eğik çizgiyle başlatır', () => {
    expect(assetHref('/', 'assets/main-a41c.js')).toBe('/assets/main-a41c.js')
  })
  it('alt yolun ve asset yolunun sınırındaki fazla çizgileri kaldırır', () => {
    expect(assetHref('/festival/', '/assets/main-a41c.js')).toBe('/festival/assets/main-a41c.js')
    expect(assetHref('festival', 'assets/theme-b82d.css')).toBe('/festival/assets/theme-b82d.css')
  })
  it('iç içe yayın yolunda hashli dosya adını korur', () => {
    expect(assetHref('//etkinlik///2026/', '//assets/chunk-a7f39.js')).toBe(
      '/etkinlik/2026/assets/chunk-a7f39.js',
    )
  })
})
