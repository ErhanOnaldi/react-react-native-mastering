import { describe, expect, it } from 'vitest'
import { parseCommit } from '@exercise/parseCommit'

describe('parseCommit', () => {
  it('tür, kapsam ve açıklamayı ayırır', () => {
    expect(parseCommit('feat(sinema): puan rozeti ekle')).toEqual({
      type: 'feat',
      scope: 'sinema',
      breaking: false,
      subject: 'puan rozeti ekle',
    })
  })

  it('kapsam opsiyoneldir', () => {
    expect(parseCommit('docs: kurulum adımlarını yaz')).toEqual({
      type: 'docs',
      scope: undefined,
      breaking: false,
      subject: 'kurulum adımlarını yaz',
    })
  })

  it('"!" kırıcı değişikliği işaretler', () => {
    expect(parseCommit('fix!: oturum yapısını değiştir')?.breaking).toBe(true)
    expect(parseCommit('feat(auth)!: token biçimi değişti')).toMatchObject({
      scope: 'auth',
      breaking: true,
    })
  })

  it('yalnızca ilk satırı inceler', () => {
    expect(
      parseCommit('fix(search): boş aramada istek atma\n\nKullanıcı boş arama yapınca...')?.subject,
    ).toBe('boş aramada istek atma')
  })

  it('biçime uymayan mesajlarda null döner', () => {
    expect(parseCommit('düzeltmeler')).toBeNull()
    expect(parseCommit('feat:eksik boşluk')).toBeNull()
    expect(parseCommit('feat(): boş kapsam')).toBeNull()
  })

  it('bilinmeyen türü reddeder', () => {
    expect(parseCommit('update: bir şeyler')).toBeNull()
  })

  it('boş açıklamayı reddeder', () => {
    expect(parseCommit('feat:    ')).toBeNull()
  })
})
