import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Geri tuşunda eski sonuç',
  difficulty: 'zor',
  concepts: ['router.search-params', 'react.useEffect.deps', 'react.race-conditions'],
  files: ['SearchPage.tsx'],
  hints: [
    'Adres değişirken ekrandaki son sonucu hangi arama çalışması yazıyor?',
    'URL’deki `q` her değiştiğinde yeni aramayı başlat; önceki çalışmanın geç gelen sonucunu geçersiz kıl.',
    'Effect içinde her `q` için ayrı geçerlilik işareti tut; cleanup onu kapatsın, cevap yalnızca hâlâ güncelse listeyi değiştirsin.',
  ],
  preview: { entry: 'Preview.tsx' },
})
