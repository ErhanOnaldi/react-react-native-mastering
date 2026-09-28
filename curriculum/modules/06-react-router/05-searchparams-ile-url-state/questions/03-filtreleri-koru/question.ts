import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Filtreleri koruyarak URL’yi güncelle',
  difficulty: 'orta',
  concepts: ['router.search-params', 'react.controlled-input', 'react.immutability', 'ts.union'],
  files: ['SearchControls.tsx'],
  hints: [
    "Input değerini URL'den oku; sorgu veya tür değişince hangi anahtar geçersizleşiyor, hangisi korunuyor?",
    "`useSearchParams` setter callback'inde mevcut params'ı yeni `URLSearchParams` nesnesine kopyala.",
    "Q değişince q'yu güncelle, türü koru ve page'i sil; tür düğmeleri de aynı koruma kuralını izlesin.",
  ],
})
