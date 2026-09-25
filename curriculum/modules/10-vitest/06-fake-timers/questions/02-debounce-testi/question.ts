import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'useDebounce zamanını test et',
  difficulty: 'orta',
  concepts: [
    'test.fake-timers',
    'test.render-hook',
    'react.custom-hooks',
    'react.useEffect.cleanup',
  ],
  files: ['useDebounce.test.ts'],
  hints: [
    '`renderHook` ve `rerender` ile değeri değiştir.',
    'Saati `act(() => vi.advanceTimersByTime(...))` içinde ilerlet.',
    'Eski timer’ın süresi dolduğunda son değerin erken gelmediğini; yeni timer dolduğunda geldiğini denetle.',
  ],
  testWriting: {
    mutants: [
      { id: 'instant', label: 'beklemeden son değeri gösteren sürüm' },
      { id: 'stale-timer', label: 'önceki arama zamanlayıcısını açık bırakan sürüm' },
    ],
  },
})
