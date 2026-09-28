import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Çıkış fonksiyonunu tamamla',
  difficulty: 'kolay',
  concepts: ['auth.token-storage', 'redux.store', 'query.useQuery'],
  files: ['logout.ts'],
  hints: [
    "Oturum sonlandırmada üç ayrı katmanı (kalıcı depo, uygulama state'i ve sorgu önbelleği) sırasıyla sıfırla.",
    '`storage.removeItem("sinema-auth")` ile depoyu, `resetStore()` ile durumu, `queryClient.clear()` ile önbelleği temizle.',
    'Fonksiyon gövdesinde sırayla bu üç çağrıyı gerçekleştir: önce depoyu temizle, ardından `resetStore()` çağır, en son `queryClient.clear()` yap.',
    '`queryClient.invalidateQueries()` çağırma; invalidation verileri silmez, yalnızca bayatlatır. Çıkış anında kesin temizlik için `clear()` zorunludur.',
  ],
})
