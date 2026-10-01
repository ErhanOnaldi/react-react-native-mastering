import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sayfa sınırı için test yaz',
  difficulty: 'orta',
  concepts: ['test.matchers', 'fetch.query-params'],
  files: ['requirePage.test.ts'],
  hints: [
    'Geçerli sınırları ve reddedilmesi gereken değerleri ayrı senaryolar olarak ele al.',
    'Hatalı çağrıyı doğrudan çalıştırmak yerine hata üreten fonksiyonu matcher’a ver.',
    '`expect(() => requirePage(page)).toThrow(...)` biçimini kullan.',
    'RangeError türünü ve `Sayfa 1 ile 500 arasında olmalı` mesajını aynı testte güvenceye al.',
  ],
  testWriting: {
    mutants: [
      { id: 'fraction-allowed', label: 'ondalıklı sayfayı kabul eden sürüm' },
      { id: 'wrong-error', label: 'hatalı sayfada beklenen hata sözleşmesini vermeyen sürüm' },
    ],
  },
})
