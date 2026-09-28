import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Dış bağlantı URL denetimi',
  difficulty: 'kolay',
  concepts: ['security.xss'],
  files: ['safeExternalUrl.ts'],
  hints: [
    'Kullanıcıdan gelen URL değerini `new URL(trimmed)` ile ayrıştırarak protokolünü incele.',
    'Yalnızca izin verilen güvenli protokolleri (`https:`, `http:`, `mailto:`) kabul et.',
    '`javascript:` veya `data:` gibi çalıştırılabilir şemalar, ayrıştırılamayan geçersiz adresler ve tip dışı girdiler için `fallback` döndür.',
  ],
})
