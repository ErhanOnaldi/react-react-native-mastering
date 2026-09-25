import { expect, it } from 'vitest'
import { countTo } from '@exercise/loop'

it('n değerine kadar sayar', () => {
  expect(countTo(3)).toBe(3)
})
