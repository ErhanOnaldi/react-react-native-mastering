import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Şapka kuralını kodla',
  difficulty: 'orta',
  concepts: ['tooling.semver', 'js.destructuring', 'js.array-methods'],
  files: ['semver.ts'],
  hints: [
    '`parseVersion` hazır: `"19.3.0"` → `{ major: 19, minor: 3, patch: 0 }`. Önce ikisini de parse et.',
    'MAJOR farklıysa hemen `false`. Aynıysa, sürümün aralıktan **büyük ya da eşit** olup olmadığına bak.',
    'Büyük/eşit karşılaştırması: önce minor’a bak; minor eşitse patch’e. `aralık` başındaki `^` işaretini `range.slice(1)` ile at.',
  ],
})
