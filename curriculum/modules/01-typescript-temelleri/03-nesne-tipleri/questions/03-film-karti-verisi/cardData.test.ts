import { describe, expect, expectTypeOf, it } from 'vitest'
import { cardData } from '@exercise/cardData'
import type { CardMovie } from '@exercise/cardData'

describe('cardData', () => {
  it('kart etiketi için puanı tek ondalık gösterir', () => {
    expect(cardData({ id: 550, title: 'Dövüş Kulübü', vote_average: 8.437 })).toEqual({
      id: 550,
      label: 'Dövüş Kulübü (8.4)',
    })
  })
  it('tam sayıda sondaki sıfırı korur', () => {
    expect(cardData({ id: 155, title: 'Kara Şövalye', vote_average: 8 })).toEqual({
      id: 155,
      label: 'Kara Şövalye (8.0)',
    })
  })
  it('kart için gereken alanların tipini korur', () => {
    expectTypeOf<CardMovie['vote_average']>().toEqualTypeOf<number>()
  })
})
