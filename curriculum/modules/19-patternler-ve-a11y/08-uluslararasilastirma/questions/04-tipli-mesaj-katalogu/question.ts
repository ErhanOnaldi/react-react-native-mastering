import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Mesaj anahtarlarını ve parametrelerini tiple',
  difficulty: 'orta',
  concepts: ['i18n.message-catalog', 'ts.discriminated-union', 'ts.narrowing'],
  files: ['messages.ts'],
  hints: [
    'Bir mesajın türü hangi parametreyi taşıdığını da belirlemeli; iki mesajın verisini ayrı ayrı düşün.',
    'Mesaj nesnesine ayırt edici bir `key` alanı ver ve her key için gereken alanları tanımla.',
    'Fonksiyonda `message.key` değerini kontrol et; her dalda yalnız o mesajın parametrelerini kullan.',
  ],
})
