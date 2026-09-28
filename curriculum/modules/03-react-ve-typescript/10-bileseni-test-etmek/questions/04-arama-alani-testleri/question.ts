import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama alanı testlerini yaz',
  difficulty: 'orta',
  concepts: ['test.vitest-basics', 'test.aaa', 'test.rtl-queries', 'test.user-event'],
  files: ['SearchBox.test.tsx'],
  hints: [
    'Bir arama alanını kullanan kişi onu adıyla bulabilmeli, mevcut sorguyu görebilmeli ve yazdığını uygulamaya iletebilmeli.',
    "`screen.getByRole('searchbox', { name: 'Film ara' })` ile sorgula; yazma davranışı için `userEvent.setup()` ve `await user.type(...)` kullan.",
    'İskelet: `render(<SearchBox query="" onQueryChange={onQueryChange} />)`; sonra alanı bul, etkileşim uygula ve `expect(onQueryChange).toHaveBeenLastCalledWith(...)` ile doğrula.',
    'Sıradan text input, `searchbox` rolünü taşımaz; ayrıca callback’in gerçekten çağrıldığını denetle.',
  ],
  testWriting: {
    mutants: [
      { id: 'wrong-label', label: 'arama alanına yanlış erişilebilir ad veren sürüm' },
      { id: 'no-change-callback', label: 'yazılan sorguyu üst bileşene iletmeyen sürüm' },
      { id: 'text-input', label: 'arama alanını sıradan metin alanı yapan sürüm' },
    ],
  },
})
