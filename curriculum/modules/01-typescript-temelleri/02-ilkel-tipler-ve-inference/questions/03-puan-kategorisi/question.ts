import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Puan aralığı kategorisi',
  difficulty: 'kolay',
  concepts: ['ts.primitives', 'ts.functions'],
  files: ['scoreBand.ts'],
  hints: [
    'Puanın sıfır olma durumunu diğer sayısal karşılaştırmalardan önce ele almayı düşün.',
    'Önce `=== 0` ile oylanmamış durumu, ardından `>= 8` ile yüksek puan durumunu kontrol et.',
    'İskelet: `if (vote === 0) return "oy yok"; if (vote >= 8) return "yüksek"; return "normal";`',
    '`if (vote)` gibi falsy kontrolleri `0` değerini yanlışlıkla genel dallara gönderebilir; açık `=== 0` karşılaştırması kullan.',
  ],
})
