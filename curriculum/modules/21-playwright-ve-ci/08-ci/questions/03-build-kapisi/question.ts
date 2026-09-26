import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'E2E öncesi build kapısı',
  difficulty: 'orta',
  concepts: ['tooling.build', 'tooling.ci'],
  question:
    'CI yalnız `pnpm dev` üstünde Playwright çalıştırıyor. Geliştirme sunucusu açılıyor ama `vite build` sırasında production import hatası var. Hangi adım bu hatayı E2E’den önce yakalar?',
  options: [
    {
      text: 'Ayrı `pnpm build` adımı; package script’i typecheck ve Vite production build’i çalıştırmalı.',
      correct: true,
      explanation:
        'Doğru. CI, dağıtılacak çıktının üretilebildiğini sınar; dev sunucusunun açılması bu kanıtı vermez.',
    },
    {
      text: 'Yalnız `waitForTimeout` süresini artırmak.',
      correct: false,
      explanation: 'Bekleme süresi production import çözümleme hatasını düzeltmez.',
    },
    {
      text: 'Playwright screenshot sayısını artırmak.',
      correct: false,
      explanation:
        'Screenshot dev sunucusunda görünen ekranı yakalar; production build hatasını göstermez.',
    },
  ],
})
