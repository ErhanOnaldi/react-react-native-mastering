import { defineModule } from '@rm/content/define'
export default defineModule({
  title: 'Hook’lar derinlemesine',
  phase: 1,
  summary:
    'Effect, cleanup, ref, reducer, custom hook ve Context’i Sinema’daki somut sorunları çözerek öğreniyoruz.',
  pain: `:::pain[Problem]
Render içinde çekilen film verisi önizleme sayacını 100 isteğe çıkarıyor. Hızlı aramada eski cevap yeniyi eziyor; favoriler yenilemede kayboluyor. Her sorunu görüp o anda gereken hook’u kuracağız.
:::`,
  outcomes: [
    'Render ile dış sistem senkronizasyonunu ayırabilirsin',
    'Dependency array ve cleanup ile eski isteklerin ekranı bozmasını önleyebilirsin',
    'Türetilmiş state için gereksiz effect yazmadan güncel ekran üretebilirsin',
    'Ref ve reducer ile odak ve bağlantılı state geçişlerini yönetebilirsin',
    'Tekrarlanan davranışları tipli custom hook’lara taşıyabilirsin',
    'Favorileri tipli Context ve localStorage ile paylaşabilirsin',
  ],
})
