import { describe, it } from 'vitest'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupStore, WatchCounter } from '@impl/WatchCounter'

describe('gerçek store ile bileşen', () => {
  it.todo('başlangıç state’indeki kayıt sayısını gösterir')
  it.todo('tıklama store’u ve çıktıyı günceller, aynı ID’yi tekrarlamaz')
})
