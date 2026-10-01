import { describe, expect, it } from 'vitest'
import { readFilters } from '@exercise/filters'

describe('URL filtreleri', () => {
  it('sayfa stringini sayıya ve false metnini false değerine dönüştürür', () => {
    expect(readFilters('?page=2&archived=false')).toEqual({ page: 2, archived: false })
  })
  it('true ve 1 flag değerlerini kabul eder', () => {
    expect(readFilters('?archived=true').archived).toBe(true)
    expect(readFilters('?archived=1').archived).toBe(true)
  })
  it('geçersiz sayfada güvenli ilk sayfaya döner', () => {
    for (const page of ['0', '-1', '1.5', 'abc']) expect(readFilters(`?page=${page}`).page).toBe(1)
  })
  it('eksik parametrelere varsayılan verir', () => {
    expect(readFilters('')).toEqual({ page: 1, archived: false })
  })
})
