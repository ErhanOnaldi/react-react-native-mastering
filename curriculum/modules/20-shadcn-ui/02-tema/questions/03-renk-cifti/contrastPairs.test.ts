import { describe, expect, it } from 'vitest'
import { findLowContrastPairs, oklchLightness } from '@exercise/contrastPairs'

const light = {
  '--background': 'oklch(1 0 0)',
  '--foreground': 'oklch(0.145 0 0)',
  '--card': 'oklch(0.98 0 0)',
  '--card-foreground': 'oklch(0.18 0 0)',
  '--primary': 'oklch(0.55 0.18 40)',
  '--primary-foreground': 'oklch(0.98 0 0)',
  '--border': 'oklch(0.92 0 0)',
  '--radius': '0.625rem',
}

describe('oklchLightness', () => {
  it('ondalık açıklığı okur', () => {
    expect(oklchLightness('oklch(0.55 0.18 40)')).toBe(0.55)
  })

  it('yüzde yazımını 0–1 aralığına çevirir', () => {
    expect(oklchLightness('oklch(78% 0.14 45)')).toBeCloseTo(0.78)
  })
})

describe('findLowContrastPairs', () => {
  it('iyi ayarlanmış açık temada sorun bulmaz; eşi olmayan token’ları (border, radius) yok sayar', () => {
    expect(findLowContrastPairs(light)).toEqual([])
  })

  it('yalnızca --primary değişip --primary-foreground unutulunca primary çiftini yakalar', () => {
    const dark = { ...light, '--primary': 'oklch(0.85 0.14 45)' }
    expect(findLowContrastPairs(dark)).toEqual(['primary'])
  })

  it('sayfa çiftini --background / --foreground olarak denetler', () => {
    const dim = { ...light, '--background': 'oklch(0.3 0 0)' }
    expect(findLowContrastPairs(dim)).toEqual(['background'])
  })

  it('eşik değeri ayarlanabilir', () => {
    expect(findLowContrastPairs(light, 0.9)).toEqual(['background', 'card', 'primary'])
  })
})
