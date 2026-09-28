import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Hatadan sonra yükleniyor',
  difficulty: 'orta',
  concepts: [
    'fetch.error-handling',
    'fetch.loading-states',
    'test.msw-overrides',
    'web.http-anatomy',
  ],
  files: ['MovieDetail.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    '500, retry ve film kimliği değişimini ayrı kullanıcı durumları olarak sırala.',
    '`response.ok` ile HTTP hatasını yakala; retry callback’i yeni fetch başlatmalı, effect cleanup eski sonucu geçersiz kılmalı.',
    'Loading/data/error state’lerini kur; id veya retry sayacı değişince isteği başlat, başarı/hata sonrası loading’i kapat ve yalnız güncel isteğin sonucunu göster.',
  ],
})
