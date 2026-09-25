import { expect, it } from 'vitest'
import { greet } from '@project/src/greet'

it('ismi selamlar', () => {
  expect(greet('Ada')).toBe('Merhaba Ada')
})
