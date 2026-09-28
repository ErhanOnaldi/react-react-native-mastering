// Modül 21'e özel kavramlar (merkezi kayıtta olmayanlar).
import { defineConcepts } from '@rm/content/define'

export default defineConcepts({
  'test.playwright-config': { title: 'playwright.config ve webServer' },
  'test.playwright-assertions': { title: 'Web-first assertion’lar ve auto-waiting' },
  'test.playwright-debug': { title: 'UI mode, trace viewer ve hata okuma' },
  'deploy.build-preview': { title: 'Build çıktısı ve preview' },
  'deploy.env': { title: 'Build anında ortam değişkenleri' },
  'deploy.spa-fallback': { title: 'Statik SPA için derin yol fallback' },
  'deploy.cache-headers': { title: 'HTML ve hash’li asset cache başlıkları' },
  'monitoring.error-reporting': { title: 'Tarayıcı hata raporlama' },
})
