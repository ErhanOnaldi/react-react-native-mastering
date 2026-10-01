import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Başarı durumu',
  difficulty: 'kolay',
  concepts: ['ts.discriminated-union', 'ts.narrowing'],
  question: `Bu fonksiyona aşağıdaki durum verildiğinde ekrana ne yazılır?

\`\`\`ts
type Result =
  | { status: 'success'; data: string }
  | { status: 'error'; error: string }

function label(result: Result): string {
  if (result.status === 'success') return result.data.toUpperCase()
  return result.error
}

label({ status: 'success', data: 'dövüş kulübü' })
\`\`\``,
  options: [
    {
      text: '`DÖVÜŞ KULÜBÜ`',
      correct: true,
      explanation:
        'status success olduğunda TypeScript data alanını açar; toUpperCase metni büyük harfe çevirir.',
    },
    { text: '`dövüş kulübü`', explanation: 'Bu, toUpperCase çalıştırılmadan önceki değerdir.' },
    {
      text: 'Derleme hatası; data ortak alanda değil.',
      explanation:
        'status kontrolü success dalını seçtiği için bu dalın data alanı güvenle okunabilir.',
    },
    {
      text: 'undefined',
      explanation: 'Başarı nesnesinde data bulunur; fonksiyon string döndürür.',
    },
  ],
})
