import { describe, expect, it } from 'vitest'
import * as prettier from 'prettier'
import { formatOptions } from '@exercise/formatOptions'

describe('Sinema biçimi', () => {
  it('TS kodunda tek tırnak ve noktalı virgülsüz çıktı üretir', async () => {
    const result = await prettier.format('const title = "Dövüş Kulübü";\n', formatOptions)
    expect(result).toBe("const title = 'Dövüş Kulübü'\n")
  })
  it('uzun satırı 80 karakter sınırında böler', async () => {
    const source =
      'const movies = ["Dövüş Kulübü", "Başlangıç", "Kara Şövalye", "Yıldızlararası", "Matrix", "Ucuz Roman"];'
    const result = await prettier.format(source, formatOptions)
    expect(result).toContain('\n')
    expect(result.split('\n').every((line) => line.length <= 80)).toBe(true)
  })
})
