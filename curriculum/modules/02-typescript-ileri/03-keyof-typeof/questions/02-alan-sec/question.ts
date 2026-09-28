import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tipli alan seçici',
  difficulty: 'orta',
  concepts: ['ts.keyof-typeof', 'ts.indexed-access', 'ts.generics'],
  files: ['task.ts'],
  hints: [
    'Seçilen anahtarın yalnızca nesnede gerçekten bulunmasını nasıl sağlayacağını düşün.',
    '`K extends keyof T` ile anahtarı sınırla; dönüşü `T[K]` yap.',
    'Fonksiyon gövdesi yalnızca `value[key]` değerini döndürür.',
  ],
})
