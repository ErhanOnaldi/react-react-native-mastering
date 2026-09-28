import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Çerezli ve CSRF korumalı istek',
  difficulty: 'orta',
  concepts: ['security.cookies', 'security.csrf', 'web.cors'],
  files: ['buildCookieRequest.ts'],
  hints: [
    'Çerez tabanlı oturumlarda tarayıcının çerezleri istekte iletmesi için hangi fetch seçeneği gerekir?',
    "Dönüş nesnesine `credentials: 'include'` ekle; HTTP metodunu büyük harfe normalize et.",
    'Durum değiştiren yöntemlerde (`POST`, `PUT`, `DELETE`, `PATCH`) verilen `csrfToken` değerini `X-CSRF-TOKEN` başlığına yaz. `GET` isteklerinde bu başlığı ekleme.',
    '`body` mevcutsa ve `headers` içinde `Content-Type` tanımlanmamışsa varsayılan olarak `application/json` ata.',
  ],
})
