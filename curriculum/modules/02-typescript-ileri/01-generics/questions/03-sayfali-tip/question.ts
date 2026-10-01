import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film ve tür sayfalarını ortaklaştır',
  difficulty: 'orta',
  concepts: ['ts.generics', 'ts.api-types'],
  files: ['task.ts'],
  hints: [
    'Sayfalama alanları iki cevapta aynı; yalnızca `results` öğelerinin tipi değişiyor.',
    'Tek bir generic type, `results` dizisinin öğe tipini çağrıya veya kullanıma göre taşıyabilir.',
    '`Paginated<T>` içinde `results: T[]` kullan. Sonra film ve tür cevap adlarını bu tipten kur; `firstResult` ilk öğeyi döndürsün.',
    'Boş `results` dizisinde ilk öğe `undefined` olur; dönüş tipinde bu olasılığı unutma.',
  ],
})
