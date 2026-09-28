import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema’yı yayına hazırla',
  difficulty: 'zor',
  concepts: [
    'deploy.build-preview',
    'deploy.env',
    'deploy.spa-fallback',
    'deploy.cache-headers',
    'monitoring.error-reporting',
    'security.csp',
    'web.http-cache',
  ],
  project: 'sinema',
  focusFiles: [
    'public/_redirects',
    'public/_headers',
    'src/shared/lib/report-error.ts',
    'src/main.tsx',
    'vite.config.ts',
  ],
  reviewFiles: [
    'src/main.tsx',
    'src/shared/lib/report-error.ts',
    'vite.config.ts',
    'public/_headers',
  ],
  rubric: [
    'React kökündeki yakalanan, yakalanmayan ve kurtarılabilir hatalar reportError ile kaydedilir; componentStack bağlamı korunur.',
    'Rapor gövdesi gerçek sırları, access token’ı veya kullanıcı parolasını taşımaz; tanı için gerekli kısa hata bilgisi ve sürüm bağlamını taşır.',
    'CSP’de connect-src uygulamanın gerçek API ve raporlama origin’lerini kapsar; gereksiz script izni verilmez.',
    'Gizli source map dosyaları hata izleme servisine release ile eşleştirilerek yüklenir ve halka açık statik yayına dahil edilmez.',
  ],
  hints: [
    'Doğrudan açılan `/movie/550` ile mevcut hash’li asset’in farklı host davranışları gerektirdiğini düşün. Hata uç noktası boşken kullanıcı akışını bozma.',
    '`public/_redirects` ve `public/_headers` host kurallarını taşır. React 19 `createRoot` seçenekleri ile hata kanallarını, `navigator.sendBeacon` ve `fetch` ile gönderimi kur.',
    '`/*  /index.html  200` fallback’ini, asset için `immutable`, HTML için `no-cache` kuralını ekle. `reportError` içinde endpoint yoksa `console.error`; varsa JSON gövdesini önce beacon, ardından `keepalive` POST ile gönder. Vite build’de `sourcemap: "hidden"` seç.',
  ],
})
