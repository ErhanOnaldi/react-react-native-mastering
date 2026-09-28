import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Puan butonunda mutation durumları',
  difficulty: 'orta',
  concepts: ['query.useMutation', 'react.events', 'fetch.loading-states'],
  files: ['RateButton.tsx'],
  hints: [
    'Düğmenin hangi anda kilitlenmesi, hangi anda tekrar etkinleşmesi gerektiğini sırala.',
    '`useMutation` ile mutation state’ini oku; `mutate` yalnızca kullanıcı olayında çağır.',
    'Pending’de disabled ve “Kaydediliyor…” göster; success ve error için ayrı metin render et.',
    'Hata mesajını `role="alert"` içinde tut ve ilk render’da fonksiyon çağırma.',
  ],
})
