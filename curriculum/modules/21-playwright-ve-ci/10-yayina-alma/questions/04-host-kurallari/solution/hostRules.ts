export function makeHostRules(apiOrigins: string[]): { redirects: string; headers: string } {
  const origins = [...new Set(apiOrigins)]
  return {
    redirects: '/*  /index.html  200\n',
    headers:
      [
        '/*',
        `  Content-Security-Policy: default-src 'self'; connect-src 'self' ${origins.join(' ')}; object-src 'none'`,
        '/assets/*',
        '  Cache-Control: public, max-age=31536000, immutable',
        '/index.html',
        '  Cache-Control: no-cache',
      ].join('\n') + '\n',
  }
}
