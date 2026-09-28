import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tarayıcı hata kaydını gönder',
  difficulty: 'orta',
  concepts: ['monitoring.error-reporting'],
  files: ['sendErrorReport.ts'],
  hints: [
    'Önce bilinmeyen hata değerini güvenli, küçük bir kayda çevir; gönderimin başarılı olup olmadığını ayrı ele al.',
    'Sayfa kapanırken de çalışabilen `navigator.sendBeacon` yolunu dene; `false` dönerse `fetch` ve `keepalive` kullan.',
    '`const body = JSON.stringify({ name, message, context }); if (navigator.sendBeacon?.(endpoint, new Blob([body], { type: "application/json" }))) return true; const response = await fetch(endpoint, { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }); return response.ok` iskeletini tamamla.',
  ],
})
