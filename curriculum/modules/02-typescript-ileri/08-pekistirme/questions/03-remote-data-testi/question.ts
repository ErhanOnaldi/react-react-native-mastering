import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Uzak veri sınırını test et',
  difficulty: 'orta',
  concepts: ['test.vitest-basics', 'test.aaa', 'test.matchers', 'ts.type-guards', 'ts.unknown-any'],
  files: ['venueGuard.test.ts'],
  hints: [
    'Örnekleri geçerli nesne, null, dizi ve alanı bozuk nesne gruplarına ayır; her testte beklenen true/false davranışını yaz.',
    '`@impl/venueGuard` içinden `isVenue` fonksiyonunu import et; `describe`, `it` ve `expect` Vitest araçlarını kullan.',
    'Doğru şekil `{ id: number; name: string; address: string | null }`; `toBe(true)` ve `toBe(false)` ile her alanın türünü kontrol et.',
    'Guard ekstra alanları kabul edebilir; ama null, dizi, eksik anahtar ve yanlış tür ayrı ayrı reddedilmeli.',
  ],
  testWriting: {
    mutants: [
      { id: 'accepts-null', label: 'null değerini mekan kaydı sayan sürüm' },
      { id: 'skips-address', label: 'adres alanı eksik olsa da geçerli sayan sürüm' },
      { id: 'accepts-wrong-name', label: 'metin olmayan mekan adını kabul eden sürüm' },
    ],
  },
})
