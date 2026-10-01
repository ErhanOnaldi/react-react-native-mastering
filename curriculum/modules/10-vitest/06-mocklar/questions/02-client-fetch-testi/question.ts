import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TMDB client isteğini test et',
  difficulty: 'orta',
  concepts: [
    'test.mocks',
    'arch.api-client',
    'fetch.headers-auth',
    'fetch.query-params',
    'js.destructuring',
  ],
  files: ['tmdbClient.test.ts'],
  hints: [
    'Test edilen client kodunu gerçek bırak; yalnızca kontrol dışındaki ağ sınırını değiştir.',
    'Gerçek ağ yerine `vi.fn` ile `Response.json(...)` döndüren fetch kur.',
    '`vi.stubGlobal("fetch", fake)` kullan; URL’yi `new URL(...)` ile incele.',
    '`Authorization` başlığını `new Headers(init?.headers)` ile okuyup `Bearer test-token` bekle.',
  ],
  testWriting: {
    mutants: [
      { id: 'missing-page', label: 'sayfa parametresini isteğe taşımayan sürüm' },
      { id: 'no-auth', label: 'yetki başlığını göndermeyen sürüm' },
    ],
  },
})
