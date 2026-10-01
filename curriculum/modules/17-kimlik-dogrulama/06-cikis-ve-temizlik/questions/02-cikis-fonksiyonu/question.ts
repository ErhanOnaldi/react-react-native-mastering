import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Çıkış fonksiyonunu tamamla',
  difficulty: 'kolay',
  concepts: ['auth.token-storage', 'redux.store', 'query.useQuery'],
  files: ['logout.ts'],
  hints: [
    "Oturum bilgisinin kalıcı kopyası, Redux state'i ve query cache'i ayrı ayrı nerede temizleniyor?",
    'Depo API’si hata verse bile bellekteki kullanıcı verisinin temizlenmesi gerekiyor; bu hatayı yalnız depolama çağrısının çevresinde ele al.',
    'Saklama anahtarı `sinema-auth`; Redux temizliği `resetStore()`, query temizliği `queryClient.clear()` ile yapılır.',
    '`invalidateQueries()` veriyi kaldırmaz; oturum değişirken tüm cache kayıtlarını `clear()` ile sil.',
  ],
})
