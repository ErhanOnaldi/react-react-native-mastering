import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Şapka kuralını kodla',
  difficulty: 'orta',
  concepts: ['tooling.semver', 'js.destructuring', 'js.array-methods'],
  files: ['semver.ts'],
  hints: [
    'Önce her iki sürüm metnini hazır `parseVersion` fonksiyonuyla ayrıştır; aralık metninin başındaki `^` işaretini `range.slice(1)` ile temizle.',
    'MAJOR numaraları eşleşmiyorsa (`v.major !== min.major`) hemen `false` döndür.',
    'İskelet: `if (v.minor !== min.minor) return v.minor > min.minor; return v.patch >= min.patch;`',
    'Tuzak: MINOR sürüm daha büyükse (`19.4.0` vs `19.3.7`), patch sayısına bakılmaksızın sürüm geçerli sayılmalıdır.',
  ],
})
