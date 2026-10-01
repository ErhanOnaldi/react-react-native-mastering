import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film sayfasını doğrula',
  difficulty: 'orta',
  concepts: ['ts.type-guards', 'ts.unknown-any', 'ts.narrowing'],
  files: ['task.ts'],
  hints: [
    'Sayfa ve her film satırı için kabul edeceğin alanları tek tek belirle.',
    'Boolean döndüren bir type guard yaz; dizi ve içindeki nesneleri ayrı kontrol et.',
    '`Array.isArray` sonrasında `every` ile her sonucun id ve title alanlarını denetle.',
  ],
})
