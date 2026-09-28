import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Arama ekranını bağla',
  difficulty: 'orta',
  concepts: ['react.controlled-input', 'react.custom-hooks', 'react.conditional-rendering'],
  files: ['SearchPage.tsx'],
  hints: [
    'Kullanıcının yazdığı metin ile ağ isteği atılan metin aynı anda değişmek zorunda değil.',
    'Input state’i ile gecikmiş query’yi ayrı tut; 30 ms bekleyen timer kur.',
    'Timer cleanup’ı ve ağ cleanup’ı farklı effect’lerde olmalı.',
    'Boş query’de istek atma ve eski listeyi temizle; dolu query’de Bearer başlığıyla çek.',
  ],
})
