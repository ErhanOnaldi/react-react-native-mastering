import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Commit mesajını ayrıştır',
  difficulty: 'orta',
  concepts: ['tooling.conventional-commits', 'js.destructuring', 'ts.optional-nullable'],
  files: ['parseCommit.ts'],
  hints: [
    'Tek bir düzenli ifade (regex) yeter. Parçalar: tür, opsiyonel `(kapsam)`, opsiyonel `!`, `: `, açıklama.',
    'Örnek desen: `/^(\\w+)(?:\\(([^)]+)\\))?(!)?: (.+)$/`. `match` sonucu null ise geçersiz mesajdır.',
    'Türün izin verilenler listesinde olup olmadığını `TYPES.includes(...)` ile kontrol et; açıklamayı `trim()` et.',
  ],
})
