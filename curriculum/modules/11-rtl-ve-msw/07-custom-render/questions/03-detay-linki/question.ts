import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Route parametresi ve link',
  difficulty: 'orta',
  concepts: ['test.custom-render', 'router.params', 'router.navigation'],
  files: ['MovieRoute.tsx'],
  hints: [
    'Bileşenin URL’den hangi bilgiyi okuyacağını ve kullanıcıyı nereye götüreceğini ayır.',
    '`useParams` ile route parametresini, `Link` ile istemci tarafı navigasyonu kullan.',
    'Id varsa `Film #${id}` heading ve `/search` linki döndür; yoksa `Film seçilmedi` metnini göster.',
  ],
})
