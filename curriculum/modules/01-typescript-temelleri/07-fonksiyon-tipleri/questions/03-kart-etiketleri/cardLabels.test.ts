import { describe, expect, it } from 'vitest'
import { cardLabels } from '@exercise/cardLabels'

describe('cardLabels', () => {
  it('her film için başlık ve yıl döner', () => { expect(cardLabels([{ title: 'Dövüş Kulübü', release_date: '1999-10-15' }])).toEqual(['Dövüş Kulübü · 1999']) })
  it('boş tarihte varsayılan metni kullanır', () => { expect(cardLabels([{ title: 'Yeni film', release_date: '' }])).toEqual(['Yeni film · Tarih yok']) })
  it('verilen fallback metnini callback içinde kullanır', () => { expect(cardLabels([{ title: 'Yeni film', release_date: '' }], 'Yakında')).toEqual(['Yeni film · Yakında']) })
})
