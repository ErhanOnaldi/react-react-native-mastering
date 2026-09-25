import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema’ya typecheck script’i ekle',
  difficulty: 'kolay',
  concepts: ['tooling.scripts', 'tooling.package-json', 'tooling.type-check'],
  project: 'sinema',
  focusFiles: ['package.json'],
  hints: [
    '`scripts` nesnesine yeni bir satır ekle: `"typecheck": "..."`.',
    'Komut, build script’inin ilk yarısıyla aynı: `tsc -b`.',
  ],
})
