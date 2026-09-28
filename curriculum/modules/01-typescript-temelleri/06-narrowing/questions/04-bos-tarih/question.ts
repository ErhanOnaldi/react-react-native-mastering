import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Boş tarih ve erken dönüş',
  difficulty: 'kolay',
  concepts: ['ts.narrowing', 'js.string-formatting'],
  files: ['yearLabel.ts'],
  hints: [
    'Boş metin kontrolünü ilk adımda yaparak erken dönüş uygulamayı düşün.',
    '`if (date === "") return "Tarih yok"` kontrolü yapıp dolu metinde `.slice(0, 4)` kullanabilirsin.',
    'İskelet: `export function yearLabel(date: string): string { if (date === "") return "Tarih yok"; return date.slice(0, 4); }`',
    '`date ?? "Tarih yok"` ifadesi boş metni yakalayamaz çünkü boş string bir nullish değer değildir.',
  ],
})
