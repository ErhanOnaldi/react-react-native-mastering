import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'URL’den statik film detayı',
  difficulty: 'orta',
  concepts: ['router.params', 'ts.narrowing', 'js.array-methods'],
  files: ['MovieDetails.tsx'],
  hints: [
    'Adres parametresinin eksik/bozuk olmasını, geçerli ama kaydı olmayan kimlikten ayrı düşün.',
    '`useParams` ile route değerini al; metin biçimini denetlemeden sayıya çevirme.',
    'Önce pozitif tam sayı kontrolü, sonra `Number`, sonra `movies.find`; her başarısız dal için istenen metni render et.',
  ],
})
