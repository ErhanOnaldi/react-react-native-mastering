import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film süresi için ilk testini yaz',
  difficulty: 'kolay',
  concepts: ['test.vitest-basics', 'test.aaa', 'test.matchers', 'ts.narrowing', 'ts.functions'],
  files: ['formatRuntime.test.ts'],
  hints: [
    'Her testte tek bir davranışı sınamak için bir girdi hazırla, fonksiyonu çağır ve sonucu `expect(...).toBe(...)` ile karşılaştır.',
    '`@impl/formatRuntime` içinden `formatRuntime` fonksiyonunu import et; `describe`, `it`, `expect` araçlarını `vitest` paketinden al.',
    '60 dakikadan az (ör. `45`), tam saat (ör. `120`), saat ve dakika içeren (ör. `139`) ve geçersiz (`null`, `0`, negatif) durumlar için ayrı testler yaz.',
    'Tam saatlerde kalan dakikanın `0 dk` olarak eklenmediğini ve `null` sürede `"Süre bilinmiyor"` metninin döndüğünü mutlaka doğrula.',
  ],
  testWriting: {
    mutants: [
      { id: 'null-fallback', label: 'null veya geçersiz sürede boş string dönen sürüm' },
      { id: 'no-hours', label: '60 dakikadan uzun sürelerde saat hesabını yapmayan sürüm' },
      { id: 'no-remainder', label: 'saati hesaplayan ancak kalan dakikayı göstermeyen sürüm' },
    ],
  },
})
