import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Statik host kurallarını üret',
  difficulty: 'orta',
  concepts: ['deploy.spa-fallback', 'deploy.cache-headers', 'security.csp', 'web.http-cache'],
  files: ['hostRules.ts'],
  hints: [
    'Doğrudan açılan uygulama yolu ile gerçek statik dosyanın cache ihtiyacı farklıdır; çıktıda iki ayrı kural bulundur.',
    '`_redirects` biçiminde fallback satırı, `_headers` biçiminde yol blokları ve `Content-Security-Policy` başlığı üret.',
    '`redirects` için `/*  /index.html  200`; `headers` için `/assets/*` altında uzun cache, `/index.html` altında `no-cache`, `/*` altında `connect-src` listesi iskeletini kullan.',
  ],
})
