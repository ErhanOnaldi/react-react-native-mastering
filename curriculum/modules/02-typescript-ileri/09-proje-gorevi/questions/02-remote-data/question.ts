import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Uzak veri durumlarını ortaklaştır',
  difficulty: 'zor',
  concepts: ['ts.discriminated-union', 'ts.type-guards', 'ts.exhaustive-check', 'ts.generics'],
  project: 'sinema',
  focusFiles: ['src/lib/remote-data.ts'],
  hints: [
    'Dört nesne biçimini `status` literal alanıyla union yap.',
    'Guard dönüşünde `state is ...` yaz; gövdede status eşitliği yeterli.',
    'Dört fonksiyon aynı kalıbı izler ama her biri ayrı durumu kontrol eder.',
  ],
})
