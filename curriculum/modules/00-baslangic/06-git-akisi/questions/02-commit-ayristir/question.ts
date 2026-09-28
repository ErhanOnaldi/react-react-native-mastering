import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Commit mesajını ayrıştır',
  difficulty: 'orta',
  concepts: ['tooling.conventional-commits', 'js.destructuring', 'ts.optional-nullable'],
  files: ['parseCommit.ts'],
  hints: [
    'Başlığı sırasıyla tür, varsa kapsam, varsa kırıcı değişiklik işareti ve açıklama parçalarına ayır. Gövdeyi inceleme.',
    'Başlık biçimini bir düzenli ifadeyle yakalayabilirsin; türü `TYPES` listesiyle doğrula ve açıklamayı `trim()` et.',
    "Örnek iskelet: `const [header = ''] = message.split('\\n')`, ardından `HEADER.exec(header)`. Eşleşme yoksa `null` döndür.",
    'Boş kapsamı ve yalnızca boşluklardan oluşan açıklamayı geçersiz say; `!` her iki izinli konumda da yakalanmalı.',
  ],
})
