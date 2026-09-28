import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Dönüş adresini sınırla',
  difficulty: 'orta',
  concepts: ['security.open-redirect'],
  files: ['getSafeRedirect.ts'],
  hints: [
    'Dönüş adresinin yalnız uygulama içinde kalması için ilk karakterleri incele.',
    'typeof value kontrolünden sonra `/` başlangıcını kabul et; `//` başlangıcını reddet.',
    'Geçerli dizgiyi aynen döndür; diğer her durumda fallback döndür. Ters eğik çizgi ve kontrol karakterlerinin URL yorumunu değiştirebileceğini de düşün.',
  ],
})
