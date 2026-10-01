import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Dört rapor durumunu modelle',
  difficulty: 'orta',
  concepts: ['ts.discriminated-union', 'ts.generics', 'ts.narrowing'],
  files: ['task.ts'],
  hints: [
    'Önce her durumda gerçekten bulunması gereken alanları ayır; başarı verisi hata durumunda bulunmamalı.',
    '`status` alanı dört değerden birini taşıyan ayrı nesne biçimleri kur.',
    '`message` içinde `switch (state.status)` ile her duruma kendi metnini ver.',
  ],
})
