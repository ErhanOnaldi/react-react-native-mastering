import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Alt yolda yayınlanan asset bağlantısı',
  difficulty: 'orta',
  concepts: ['deploy.build-preview', 'tooling.vite-config'],
  files: ['assetHref.ts'],
  hints: [
    'Önce uygulamanın yayın kökünü ve build’in ürettiği göreli asset yolunu ayrı düşün; URL’de yalnızca bir ayraç olmalı.',
    '`base` değerini başında ve sonunda `/` olacak biçime getir; asset yolunun başındaki `/` karakterlerini temizle.',
    'Örneğin `const root = "/" + base.split("/").filter(Boolean).join("/"); return (root === "/" ? "" : root) + "/" + asset.replace(/^\\/+/, "")` iskeletini sınır durumlarına uygula.',
  ],
})
