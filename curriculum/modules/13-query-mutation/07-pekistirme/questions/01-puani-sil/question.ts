import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Silme mutation’ının durumunu göster',
  difficulty: 'orta',
  concepts: ['query.useMutation', 'react.events', 'fetch.loading-states'],
  files: ['DeleteRatingButton.tsx'],
  hints: [
    'Sunucu işlemi bitene kadar kullanıcıya hangi geri bildirimin gerektiğini belirle.',
    'Silme Promise’ini bir mutation olarak kur ve kullanıcı eyleminden başlat.',
    'Pending, success ve error durumlarına göre düğme ve mesajı render et.',
  ],
})
