import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'React Router',
  phase: 1,
  summary:
    'Sinema sayfalarını paylaşılabilir adreslere taşı; yol, filtre ve sayfalamayı URL ile yönet.',
  pain: `:::pain[Problem]
Sinema'da sayfayı useState ile değiştiriyorsun. Film detayından geri tuşuna basınca listeye dönmüyor. Arama filtresi yenileyince sıfırlanıyor; arkadaşına aynı sonucu açan linki gönderemiyorsun. Sayfa ve filtre state'ini URL'ye taşıyacağız.
:::`,
  outcomes: [
    'React Router 8 data mode ile rota ağacı kurabilirsin',
    'Link, NavLink ve Outlet ile gezinme ve ortak layout oluşturabilirsin',
    'useParams değerlerini TypeScript ile güvenle daraltabilirsin',
    'Arama, sayfa ve tür seçimini URL state olarak yönetebilirsin',
    '404 ve rota hatalarını görünür biçimde gösterebilirsin',
    'Sinema sayfalarını RouterProvider ile bağlayabilirsin',
  ],
})
