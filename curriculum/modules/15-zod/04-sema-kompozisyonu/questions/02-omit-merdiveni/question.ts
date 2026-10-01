import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Şemadan yeni liste girdisi türet',
  difficulty: 'orta',
  concepts: ['zod.schema-composition', 'ts.omit', 'zod.infer'],
  files: ['schemas.ts'],
  hints: [
    'Tam kaydın hangi alanlarını kullanıcı sağlar, hangilerini uygulama üretir?',
    'Önce tam kayıt şemasını kur; sonra üç farklı veri kullanımını ayrı şemalara dönüştür.',
    'Yeni girdi için `.omit`, başlık için `.pick`, paylaşım alanı için `.extend` kullan.',
  ],
})
